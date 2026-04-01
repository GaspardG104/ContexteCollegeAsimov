const connection = require('../config/db');

const Projet = {
    // Permet d'exécuter des requêtes brutes (utilisé par le Round-Robin)
    query: (sql, params) => {
        return connection.query(sql, params);
    },

// Requête pour récupérer les projets et leurs responsables
    getAll: async () => {
        const sql = `
        SELECT p.*, e.nom AS nom_resp, e.prenom AS prenom_resp 
        FROM projets p
        LEFT JOIN eleves e ON p.id_eleve_responsable = e.id_eleve`;
        const [rows] = await connection.query(sql);
        return rows;
    },

    // Mettre à jour unprojet
    update: async (id, data) => {
        const sql = 'UPDATE projets SET ? WHERE id_recherche = ?';
        return connection.query(sql, [data, id]);
    },

    
    // Supprimer un projet
    delete: async (id) => {
        const sql = 'DELETE FROM projets WHERE id_recherche = ?';
        return connection.query(sql, [id]);
    },

    // Insère un nouveau projet
    create: async (data) => {
        const sql = `
            INSERT INTO projets (libelle, description, date_debut, date_fin, id_eleve_responsable, est_valide) 
            VALUES (?, ?, ?, ?, ?, FALSE)`; // On met FALSE par défaut pour la validation
        
        const values = [
            data.libelle, 
            data.description, 
            data.date_debut || null, 
            data.date_fin || null, 
            data.id_eleve_responsable || null
        ];
        
        const [result] = await db.query(sql, values);
        return result.insertId;
    }

};

module.exports = Projet;