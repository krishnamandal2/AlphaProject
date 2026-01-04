const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // port: process.env.DB_PORT,  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

});

db.getConnection((err) => {
  if (err) {
    console.log("Failed to connect DB:", err.message);
    return;
  }
  console.log(" Database connected");
  
});

module.exports = db;
