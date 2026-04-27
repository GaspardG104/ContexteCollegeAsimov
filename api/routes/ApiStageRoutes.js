const express = require('express');
const router = express.Router();
const stageController = require('../controllers/ApiStageController');

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