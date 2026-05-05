const express = require('express');
const router = express.Router();
const usersController = require('../controllers/ApiUsersController');

// 1 Voir la liste
router.get('/api/users', usersController.apiGetAllUsers);

// 2 Supprimer un utilisateur 

router.delete('/api/users/:id', usersController.apiDeleteUser);


// POur avoir les utilisateurs à supprimer
router.get('/api/users/toDelete', usersController.apiGetUsersToDelete);



module.exports = router;