const connection = require('../config/db');

const Stage = {
    // Permet d'exécuter des requêtes brutes (utilisé par le Round-Robin)
    query: (sql, params) => {
        return connection.query(sql, params);
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
    }
};

module.exports = Stage;