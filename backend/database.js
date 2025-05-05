const db = require('mariadb');

const pool = db.createPool({
    host: '127.0.0.1',
    user: 'john',
    password: 'password',
    database: 'studentdb',
    connectionLimit: 5
});

module.exports = pool;