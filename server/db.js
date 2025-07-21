// db.js
require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,     // contoh: 'localhost'
  user: process.env.DB_USER,     // contoh: 'root'
  password: process.env.DB_PASS, // contoh: ''
  database: process.env.DB_NAME  // contoh: 'sekolah_online'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err);
  } else {
    console.log('✅ Terhubung ke database');
  }
});

module.exports = db;
