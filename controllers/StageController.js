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
        // 1. Appeler l'algorithme pour avoir un prof
        const idProfChoisi = await assignerReferent();
        
        // 2. Récupérer les données du formulaire (Create.ejs)
        const nouveauStage = {
            ...req.body,
            id_enseignant: idProfChoisi,
            date_creation: new Date()
        };

        // 3. Envoyer au modèle pour insertion
        await db.create(nouveauStage);
        
        res.redirect('/stages/view'); // Rediriger vers la liste
    } catch (error) {
        res.status(500).send("Erreur lors de la création du stage");
    }
};

exports.renderCreateForm = async (req, res) => {
    // On va chercher les élèves pour remplir la liste déroulante du formulaire
    const [eleves] = await db.query('SELECT id_eleve, nom, prenom FROM eleves');
    res.render('stages/Create', { eleves: eleves });
};