const db = require('mariadb');

const pool = db.createPool({
    host: '127.0.0.1',
    user: 'john',
    password: 'password',
    database: 'studentdb',
    connectionLimit: 5
});

// async function asyncFunction() {
//     let conn;
//     try {
//       conn = await pool.getConnection();
//       const rows = await conn.query("SELECT COUNT(*) FROM sensor_data");
//       console.log(rows); //[ {val: 1}, meta: ... ]
  
//     } catch (err) {
//       throw err;
//     } finally {
//       if (conn) conn.release();
//     }
//   }
//   asyncFunction().then(() => {
//     pool.end();
//   });

module.exports = pool;