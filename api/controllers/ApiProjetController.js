const Projet = require('../../models/Projet');
const path = require('path');


exports.apiGetAllProjets = async (req, res) => {
    try {
        const projets = await Projet.getAll();
        // On s'assure que c'est bien un tableau, même vide
        const dataToSend = projets || []; 
        
        console.log("API envoyée à Java : ", dataToSend.length, "projets");
        
        // On force le Header JSON et on envoie
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(dataToSend); 
    } catch (error) {
        return res.status(500).json([]); // Envoie un tableau vide en cas d'erreur
    }
};

// Créer un projet (API)
exports.apiCreateProjet = async (req, res) => {
    try {
        const newId = await Projet.create(req.body); // req.body contiendra le JSON envoyé par Java
        res.status(201).json({ message: "Projet créé !", id: newId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Modifier un projet (API)
exports.apiUpdateProjet = async (req, res) => {
    try {
        await Projet.update(req.params.id, req.body);
        res.json({ message: "Projet mis à jour !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un projet (API)
exports.apiDeleteProjet = async (req, res) => {
    try {
        await Projet.delete(req.params.id);
        res.json({ message: "Projet supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// pour la liste des éléves dans le java
exports.apiGetAllEleves = async (req, res) => {
    try {
        const [eleves] = await Projet.query('SELECT id_eleve, nom, prenom FROM eleves ORDER BY nom ASC');// a mettre dans le modele 
        res.json(eleves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};