const express = require('express');
const router = express.Router();
const usersController = require('../controllers/ApiUsersController');

// 1 Voir la liste
router.get('/api/users', usersController.apiGetAllUsers);

// 3 Supprimer un utilisateur 

router.delete('/api/users/:id', usersController.apiDeleteUser);



module.exports = router;