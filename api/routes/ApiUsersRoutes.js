const express = require('express');
const router = express.Router();

// 1 Voir la liste
router.get('/api/users', UsersController.apiGetAllUsers);

// 2 créer un utilisateur

router.post('/api/users', UsersController.apiCreateUser); 

// 3 Supprimer un utilisateur 

router.delete('/api/users/:id', UsersController.apiDeleteUser);

// 4 modifier un utilisatsur
router.put('/api/users/:id', UsersController.apiUpdateUser);


module.exports = router;