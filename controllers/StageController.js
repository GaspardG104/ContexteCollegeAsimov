const db = require('../models/Stage');

// Fonction pour trouver le prochain prof (Round-Robin)
const assignerReferent = async () => {
    try {
        // On récupère tous les profs triés par leur ID ou par charge de travail
        // Ici, on prend celui qui a le moins de stages assignés actuellement
        const sql = `
            SELECT id_enseignant 
            FROM enseignants 
            ORDER BY (SELECT COUNT(*) FROM stage_recherches WHERE id_enseignant = enseignants.id_enseignant) ASC, 
            id_enseignant ASC 
            LIMIT 1`;

        const [rows] = await db.query(sql);
        return rows[0].id_enseignant; // Retourne l'ID du prof choisi
    } catch (error) {
        console.error("Erreur Round-Robin:", error);
        return null;
    }
};

exports.createStage = async (req, res) => {
    try {
        // 1. On extrait les données envoyées par le formulaire (Create.ejs)
        const { 
            id_eleve, 
            entreprise_contactee, 
            nb_lettres_envoyees, 
            nb_lettres_recues, 
            date_entretien, 
            resultat 
        } = req.body;

        // 2. On prépare l'objet pour l'insertion SQL
        // ATTENTION : MySQL n'accepte pas une chaîne vide "" pour une date
        const donneesRecherche = {
            id_eleve: id_eleve,
            entreprise_contactee: entreprise_contactee,
            nb_lettres_envoyees: parseInt(nb_lettres_envoyees) || 0,
            nb_lettres_recues: parseInt(nb_lettres_recues) || 0,
            date_entretien: date_entretien === "" ? null : date_entretien,
            resultat: resultat || ""
        };

        // 3. On appelle la méthode create du modèle (qui fait INSERT INTO stage_recherches)
        // Vérifie bien que 'Stage' est importé en haut de ton fichier
        await Stage.create(donneesRecherche);
        
        // 4. Succès -> Redirection
        res.redirect('/stages/view');

    } catch (error) {
        // Regarde cette log dans ton terminal VS Code si ça plante encore !
        console.error("ERREUR SQL LORS DE LA CREATION :", error);
        res.status(500).send("Erreur serveur : " + error.message);
    }
};

exports.renderCreateForm = async (req, res) => {
    // On va chercher les élèves pour remplir la liste déroulante du formulaire
    const [eleves] = await db.query('SELECT id_eleve, nom, prenom FROM eleves');
    res.render('stages/Create', { 
        eleves: eleves, 
        title: "Nouvelle recherche de stage" 
    });
};

const Stage = require('../models/Stage'); // On importe le modèle

// Fonction pour afficher la liste de tous les stages (avec alertes > 15)
exports.getAllStages = async (req, res) => {
    try {
        // 1. On appelle le modèle (qui doit maintenant pointer vers stage_recherches)
        const recherches = await Stage.getAllRecherches();

        // Debug : Affiche les données reçues dans ton terminal VS Code
        console.log("Données reçues de la BDD :", recherches);

        // 2. On traite les données pour ajouter l'indicateur d'alerte
        const stagesTraites = recherches.map(r => ({
            ...r,
            // On crée un booléen 'alerte' si le nombre de lettres dépasse 15
            alerte: r.nb_lettres_envoyees > 15
        }));

        // 3. On envoie les données à ta vue 'view.ejs'
        res.render('stages/view', {
            stages: stagesTraites, // On l'appelle 'stages' pour que ton EJS actuel fonctionne
            title: "Suivi des recherches de stage"
        });

    } catch (error) {
        // On affiche l'erreur complète dans le terminal pour débugger plus vite
        console.error("Erreur détaillée dans getAllStages:", error);
        res.status(500).send("Erreur lors de la récupération : " + error.message);
    }

};
// Affiche le formulaire de modification
exports.renderEditForm = async (req, res) => {
    try {
        // 1. On récupère l'ID depuis l'URL
        const id = req.params.id;

        // 2. On récupère les données de cette recherche spécifique
        const [recherches] = await db.query('SELECT * FROM stage_recherches WHERE id_recherche = ?', [id]);
        
        // 3. On récupère aussi la liste des élèves (au cas où on veut changer l'élève)
        const [eleves] = await db.query('SELECT id_eleve, nom, prenom FROM eleves');

        if (recherches.length === 0) {
            return res.status(404).send("Recherche introuvable");
        }

        // 4. On envoie tout à la vue Edit.ejs
        res.render('stages/Edit', { 
            recherche: recherches[0], 
            eleves: eleves,
            title: "Modifier la recherche"
        });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};

// Traite la modification (POST)
exports.updateRecherche = async (req, res) => {
    try {
        await Stage.update(req.params.id, req.body);
        res.redirect('/stages/view');
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour");
    }
};

// Supprime une recherche
exports.deleteRecherche = async (req, res) => {
    try {
        await Stage.delete(req.params.id);
        res.redirect('/stages/view');
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression");
    }
};

const PDFDocument = require('pdfkit');

exports.generatePDF = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Récupérer les infos complètes (Jointure recherche + élève)
    const [rows] = await db.query(`
        SELECT r.*, e.nom, e.prenom, e.id_classe_actuelle 
        FROM stage_recherches r
        JOIN eleves e ON r.id_eleve = e.id_eleve
        WHERE r.id_recherche = ?`, [id]);

        if (rows.length === 0) return res.status(404).send("Recherche non trouvée");
        const data = rows[0];

        // 2. Créer le document PDF
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // 3. Configurer la réponse du navigateur pour le téléchargement
        const fileName = `Convention_${data.nom}_${data.entreprise_contactee}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        // Envoyer le flux PDF directement vers la réponse HTTP
        doc.pipe(res);

        // --- DESIGN DU PDF ---
        
        // En-tête
        //doc.image('../../public/css/layouts/logo.png', {width: 100});
        
        doc.fontSize(20).text('CONVENTION DE STAGE', { align: 'center', underline: true });
        doc.moveDown(2);

        doc.fontSize(12).text(`Date de génération : ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Section Élève
        doc.fillColor('#2c3e50').fontSize(14).text('1. INFORMATIONS SUR L\'ÉLÈVE', { underline: true });
        doc.fillColor('black').fontSize(12);
        doc.text(`Nom : ${data.nom.toUpperCase()}`);
        doc.text(`Prénom : ${data.prenom}`);
        doc.text(`Classe : ${data.id_classe_actuelle || 'Non renseignée'}`);
        doc.moveDown();

        // Section Entreprise
        doc.fillColor('#2c3e50').fontSize(14).text('2. INFORMATIONS SUR L\'ENTREPRISE', { underline: true });
        doc.fillColor('black').fontSize(12);
        doc.text(`Entreprise d'accueil : ${data.entreprise_contactee}`);
        doc.text(`Date prévue de l'entretien : ${data.date_entretien ? data.date_entretien.toLocaleDateString() : 'À définir'}`);
        doc.moveDown(2);

        // Zones de signatures
        doc.text('Fait à .........................., le ..........................', { align: 'right' });
        doc.moveDown(3);

        const startY = doc.y;
        doc.text('Signature de l\'élève :', 50, startY);
        doc.text('Cachet de l\'entreprise :', 350, startY);

        // 4. Finaliser le document
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la génération du PDF");
    }
};