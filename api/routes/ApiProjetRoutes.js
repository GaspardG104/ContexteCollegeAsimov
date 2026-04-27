const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ApiProjetController');


// --- ROUTES POUR LA CONSULTATION (READ) ---

router.get('/view', projetController.apiGetAllProjets);

// 2. Créer (POST)
// Java enverra un objet JSON à cette route-
router.post('/create', projetController.apiCreateProjet); 
 // pour la liste des élèves (pour le menu déroulant du responsable)
router.get('/eleves', projetController.apiGetAllEleves);

// 3. Supprimer (DELETE ou POST)
// Pour Java, il est plus propre d'utiliser DELETE
router.delete('/:id', projetController.apiDeleteProjet);

// 4. Pour modifier
router.put('/:id', projetController.apiUpdateProjet);

module.exports = router;