const express = require('express');
const router = express.Router();
const stageController = require('../controllers/StageController');

// Route pour afficher le formulaire de création (L'élève choisit son entreprise)
router.get('/create', stageController.renderCreateForm);

// Route pour ENREGISTRER les données du formulaire + Algorithme Round-Robin
router.post('/create', stageController.createStage);

// Route pour VOIR la liste des stages (avec l'alerte > 15 recherches)
router.get('/view', stageController.getAllStages);

module.exports = router;