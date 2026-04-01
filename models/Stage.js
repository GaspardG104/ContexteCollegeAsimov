const connection = require('../config/db');

const Stage = {
    // Permet d'exécuter des requêtes brutes (utilisé par le Round-Robin)
    query: (sql, params) => {
        return connection.query(sql, params);
    },

    // Trouver une recherche par son ID
    getById: async (id) => {
        const sql = 'SELECT * FROM stage_recherches WHERE id_recherche = ?';
        const [rows] = await connection.query(sql, [id]);
        return rows[0];
    },

    // Insertion d'un nouveau stage
    create: async (data) => {
        const sql = 'INSERT INTO stage_recherches SET ?';
        return connection.query(sql, [data]);
    },

    // Récupérer tous les stages avec alerte si > 15 recherches
    getAll: async () => {
        const sql = 'SELECT *, (nb_lettres_envoyees > 15) AS alerte_recherche FROM stage_recherches';
        const [rows] = await connection.query(sql);
        return rows;
    },

    // Récupérer le suivi des recherches (pour l'affichage avec alertes)
    getAllRecherches: async () => {
        const sql = `
            SELECT r.*, e.nom, e.prenom 
            FROM stage_recherches r
            JOIN eleves e ON r.id_eleve = e.id_eleve
            ORDER BY r.nb_lettres_envoyees DESC`;
        const [rows] = await connection.query(sql);
        return rows;
    },

    // Insertion d'un stage validé (quand la recherche aboutit)
    createStageValide: async (data) => {
        const sql = 'INSERT INTO stages SET ?';
        return connection.query(sql, [data]);
    },

    // Mettre à jour une recherche
    update: async (id, data) => {
        const sql = 'UPDATE stage_recherches SET ? WHERE id_recherche = ?';
        return connection.query(sql, [data, id]);
    },

    // Supprimer une recherche
    delete: async (id) => {
        const sql = 'DELETE FROM stage_recherches WHERE id_recherche = ?';
        return connection.query(sql, [id]);
    },
};

module.exports = Stage;