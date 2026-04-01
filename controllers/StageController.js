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
        // Un seul appel suffit
        const idProfChoisi = await assignerReferent();
        
        if (!idProfChoisi) {
            return res.status(500).send("Erreur : Aucun professeur disponible.");
        }
        
        const nouveauStage = {
            ...req.body,
            id_enseignant: idProfChoisi,
            // Correction : ta table s'appelle 'stage_recherches', 
            // assure-toi que les noms correspondent
            date_creation: new Date() 
        };

        await db.create(nouveauStage);
        res.redirect('/stages/view');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création");
    }
};

exports.renderCreateForm = async (req, res) => {
    // On va chercher les élèves pour remplir la liste déroulante du formulaire
    const [eleves] = await db.query('SELECT id_eleve, nom, prenom FROM eleves');
    res.render('stages/Create', { eleves: eleves });
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