
const db = require('../../models/Stage');
const path = require('path');



exports.apiGetAllStages = async (req, res) => {
    try {
        const stages = await Stage.getAll();
        // On s'assure que c'est bien un tableau, même vide
        const dataToSend = stages || []; 
        
        console.log("API envoyée à Java : ", dataToSend.length, "stages");
        
        // On force le Header JSON et on envoie
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(dataToSend); 
    } catch (error) {
        return res.status(500).json([]); // Envoie un tableau vide en cas d'erreur
    }
};


// Créer un projet (API)
exports.apiCreateStage = async (req, res) => {
    try {
        const newId = await Stage.create(req.body); // req.body contiendra le JSON envoyé par Java
        res.status(201).json({ message: "Stage créé !", id: newId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Modifier un stage (API)
exports.apiUpdateStage = async (req, res) => {
    try {
        await Stage.update(req.params.id, req.body);
        res.json({ message: "Stage mis à jour !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un stage (API)
exports.apiDeleteStage = async (req, res) => {
    try {
        await Stage.delete(req.params.id);
        res.json({ message: "Stage supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
