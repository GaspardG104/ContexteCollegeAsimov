const express = require('express');
const router = express.Router();
const stageController = require('../controllers/StageController');

// Route pour afficher le formulaire de création (L'élève choisit son entreprise)
router.get('/', (req, res) => res.redirect('/stages/view'));
router.get('/create', stageController.renderCreateForm);

// Route pour ENREGISTRER les données du formulaire + Algorithme Round-Robin
router.post('/create', stageController.createStage);

// Route pour VOIR la liste des stages (avec l'alerte > 15 recherches)
router.get('/view', stageController.getAllStages);

// Affichage du formulaire de modif
router.get('/edit/:id', stageController.renderEditForm);

// Traitement de la modif
router.post('/edit/:id', stageController.updateRecherche);

// Suppression
router.get('/delete/:id', stageController.deleteRecherche);

// Le :id permet de savoir pour quelle recherche on génère la convention
router.get('/pdf/:id', stageController.generatePDF);




module.exports = router;