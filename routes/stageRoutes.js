const express = require('express');
const router = express.Router();
const stageController = require('../controllers/StageController');

// Route pour afficher le formulaire de création (L'élève choisit son entreprise)
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


// Pour le JAVA

// --- ROUTES POUR LA CONSULTATION (READ) ---
router.get('/api/stages', stageController.apiGetAllStages);

// 2. Créer (POST)
// Java enverra un objet JSON à cette route
router.post('/api/stages', stageController.apiCreateStage); 

// 3. Supprimer (DELETE ou POST)
// Pour Java, il est plus propre d'utiliser DELETE
router.delete('/api/stages/:id', stageController.apiDeleteStage);

// 4. Pour modifier
router.put('/api/stages/:id', stageController.apiUpdateStage);
module.exports = router;