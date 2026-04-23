const Projet = require('../models/Projet');
const path = require('path');

// Dans projetController.js

// 1. La logique métier (récupérer les données)
exports.getProjetsData = async () => {
    return await Projet.getAll(); 
};

// 2. Pour le Web (EJS)
exports.viewAllProjets = async (req, res) => {
    try {
        const projets = await exports.getProjetsData();
        res.render('view', { projets }); // On envoie à la vue EJS
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 3. Pour l'API (Java)
exports.apiGetAllProjets = async (req, res) => {
    try {
        const projets = await exports.getProjetsData();
        res.json(projets); // On envoie du JSON brut
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Affiche le formulaire de modification
exports.renderEditForm = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. On récupère les données du projet (id_projet et non id_recherche)
        const [projets] = await Projet.query('SELECT * FROM projets WHERE id_projet = ?', [id]);
        
        // 2. On récupère la liste des élèves pour le menu déroulant du responsable
        const [eleves] = await Projet.query('SELECT id_eleve, nom, prenom FROM eleves');

        if (projets.length === 0) {
            return res.status(404).send("Projet introuvable");
        }

        res.render('projets/Edit', { 
            projet: projets[0], 
            eleves: eleves,
            title: "Modifier le projet"
        });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};

// Traite la modification (POST)
exports.updateProjet = async (req, res) => {
    try {
        await Projet.update(req.params.id, req.body);
        res.redirect('/projets/view');
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour");
    }
};

// Supprime un projet
exports.deleteProjet = async (req, res) => {
    try {
        await Projet.delete(req.params.id);
        res.redirect('/projets/view');
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression");
    }
};

// Affiche le formulaire de création (GET)
exports.renderCreateForm = async (req, res) => {
    try {
        // On a besoin de la liste des élèves pour le menu déroulant du responsable
        const [eleves] = await Projet.query('SELECT id_eleve, nom, prenom FROM eleves ORDER BY nom ASC');
        
        res.render('projets/Create', { 
            eleves: eleves, 
            title: "Nouveau Projet Asimov" 
        });
    } catch (error) {
        res.status(500).send("Erreur lors de l'ouverture du formulaire : " + error.message);
    }
};

// Traite la création du projet (POST)
exports.createProjet = async (req, res) => {
    try {
        // On envoie les données du formulaire (req.body) au modèle
        await Projet.create(req.body);
        
        // Une fois créé, on redirige vers la liste des projets
        res.redirect('/projets/view');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création du projet");
    }
};