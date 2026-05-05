const connection = require('../config/db');


const Users = {
    query: (sql, params) => {
        return connection.query(sql, params);
    },

}

module.exports = Users;