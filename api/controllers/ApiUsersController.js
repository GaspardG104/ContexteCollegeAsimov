//const db = require('../models/Users');
//const path = require('path');


exports.apiGetAllUsers = async (req, res) => {
    try {
        const stages = await Users.getAll();
        // On s'assure que c'est bien un tableau, même vide
        const dataToSend = utilisateurs || []; 
        
        console.log("API envoyée à Java : ", dataToSend.length, "Users");
        
        // On force le Header JSON et on envoie
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(dataToSend); 
    } catch (error) {
        return res.status(500).json([]); // Envoie un tableau vide en cas d'erreur
    }
};

// Supprimer un utilisateur (API)
exports.apiDeleteUser = async (req, res) => {
    try {
        await Stage.delete(req.params.id);
        res.json({ message: "Utilisateur supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};