const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ProjetController');
const Projet = require('../models/Projet');

// --- ROUTES POUR LA CONSULTATION (READ) ---

// Affiche la liste de tous les projets (Ta page View.ejs)
router.get('/view', projetController.viewAllProjets);


// POUR l'API LOURDE
router.get('/api/json', async (req, res) => {
    try {
        const projets = await Projet.getAll(); 
        res.json(projets); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROUTES POUR LA CRÉATION (CREATE) ---

// Affiche le formulaire de création
router.get('/create', projetController.renderCreateForm);

// Traite l'envoi du formulaire de création
router.post('/create', projetController.createProjet);

// --- ROUTES POUR LA MODIFICATION (UPDATE) ---

// Affiche le formulaire de modification avec les données actuelles
router.get('/edit/:id', projetController.renderEditForm);

// Traite l'envoi du formulaire de modification
router.post('/edit/:id', projetController.updateProjet);

// Supprime un projet spécifique
router.get('/delete/:id', projetController.deleteProjet);

module.exports = router;