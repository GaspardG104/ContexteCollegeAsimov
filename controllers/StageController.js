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
        const recherche = await Stage.getById(req.params.id);
        res.render('stages/Edit', {
            recherche: recherche,
            title: "Modifier la recherche"
        });
    } catch (error) {
        res.status(500).send("Erreur lors de l'accès au formulaire");
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