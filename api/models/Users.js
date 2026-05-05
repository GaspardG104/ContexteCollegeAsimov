const connection = require('../config/db');


const Users = {
    query: (sql, params) => {
        return connection.query(sql, params);
    },

    //pour afficher la liste d'utilistauers
    getAll: async () => {
            const sql = "SELECT id_utilisateur, login, role, date_depart FROM utilisateurs";
            const [rows] = await connection.query(sql);
            return rows;
        },

    //pour supprimer l'utilistauers
    delete: async (id) => {
        const sql = 'DELETE FROM utilisateurs WHERE id_utilisateur = ?';
        return connection.query(sql, [id]);
    },
}

module.exports = Users;