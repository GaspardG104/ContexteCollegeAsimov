const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ProjetController');

// --- ROUTES POUR LA CONSULTATION (READ) ---

// Affiche la liste de tous les projets (Ta page View.ejs)
router.get('/view', projetController.viewAllProjets);

// --- ROUTES POUR LA CRÉATION (CREATE) ---

// Affiche le formulaire de création
// Note : Tu devras créer renderCreateForm dans ton contrôleur
router.get('/create', projetController.renderCreateForm);

// Traite l'envoi du formulaire de création
router.post('/create', projetController.createProjet);

// --- ROUTES POUR LA MODIFICATION (UPDATE) ---

// Affiche le formulaire de modification avec les données actuelles
router.get('/edit/:id', projetController.renderEditForm);

// Traite l'envoi du formulaire de modification
router.post('/edit/:id', projetController.updateProjet);

// --- ROUTES POUR LA SUPPRESSION (DELETE) ---

// Supprime un projet spécifique
router.get('/delete/:id', projetController.deleteProjet);

module.exports = router;