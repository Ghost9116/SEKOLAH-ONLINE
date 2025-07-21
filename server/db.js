// db.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.PORT
});

connection.connect(err => {
  if (err) {
    console.error('❌ Gagal terhubung ke database:', err);
  } else {
    console.log('✅ Terhubung ke database!');
  }
});

module.exports = connection;
