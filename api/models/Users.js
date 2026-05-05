const connection = require('../../config/db');


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

    //pour afficher la liste d'utilistauers à supprimer
    getAllToDelete: async () => {
            const sql = `
                            SELECT U.id_utilisateur, U.login, U.role, U.date_depart, E.id_classe_actuelle  
                            FROM utilisateurs U
                            INNER JOIN eleves E
                            ON U.id_utilisateur = E.id_utilisateur
                            WHERE date_depart IS NOT NULL 
                            AND date_depart <= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                        `;
            const [rows] = await connection.query(sql);
            return rows;
        },
}

module.exports = Users;