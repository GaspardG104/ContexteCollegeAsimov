const Projet = require('../../models/Projet');
const path = require('path');

/**
 * Récupère la liste de tous les projets pour l'API.
 * * @async
 * @function apiGetAllProjets
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<Object>} Une promesse qui résout avec la réponse JSON contenant le tableau de projets.
 * @throws {Error} Renvoie un statut 500 avec un tableau vide en cas d'erreur serveur.
 */

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

/**
 * Crée un nouveau projet.
 * * @async
 * @function apiCreateProjet
 * @param {import('express').Request} req - L'objet de requête Express contenant les données dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} Envoie un statut 201 et l'ID du projet créé.
 */

exports.apiCreateProjet = async (req, res) => {
    try {
        const newId = await Projet.create(req.body); // req.body contiendra le JSON envoyé par Java
        res.status(201).json({ message: "Projet créé !", id: newId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Met à jour un projet existant via son identifiant.
 * * @async
 * @function apiUpdateProjet
 * @param {import('express').Request} req - L'objet de requête Express (ID dans `req.params.id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} Message de confirmation de mise à jour.
 */

exports.apiUpdateProjet = async (req, res) => {
    try {
        await Projet.update(req.params.id, req.body);
        res.json({ message: "Projet mis à jour !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Supprime un projet via son identifiant.
 * * @async
 * @function apiDeleteProjet
 * @param {import('express').Request} req - L'objet de requête Express (ID dans `req.params.id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} Message de confirmation de suppression.
 */

exports.apiDeleteProjet = async (req, res) => {
    try {
        await Projet.delete(req.params.id);
        res.json({ message: "Projet supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Récupère la liste de tous les élèves (nom, prénom) pour l'application Java.
 * * @async
 * @function apiGetAllEleves
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} Envoie un tableau d'objets élèves triés par nom.
 */

exports.apiGetAllEleves = async (req, res) => {
    try {
        const [eleves] = await Projet.query('SELECT id_eleve, nom, prenom FROM eleves ORDER BY nom ASC');// a mettre dans le modele 
        res.json(eleves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};