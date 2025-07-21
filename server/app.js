// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db');

const app = express();
const port = process.env.PORT.APP_PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'rahasia',
  resave: false,
  saveUninitialized: false
}));

// ===== LOGIN SISWA =====
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM siswa WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) return res.send('Terjadi kesalahan server');
    if (result.length > 0) {
      req.session.user = result[0];
      res.redirect('/dashboard.html');
    } else {
      res.redirect('/login.html?error=true');
    }
  });
});

app.get('/api/siswa', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Session expired' });
  res.json(req.session.user);
});

// ===== LOGIN ADMIN =====
app.post('/login-admin', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) return res.send('Terjadi kesalahan server');
    if (result.length > 0) {
      req.session.admin = result[0];
      res.redirect('/admin-dashboard.html');
    } else {
      res.redirect('/login-admin.html?error=true');
    }
  });
});

app.get('/api/admin', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Session expired' });
  res.json(req.session.admin);
});

// ===== ROUTE: VIDEO MATERI =====
app.post('/upload-video', (req, res) => {
  if (!req.session.admin) return res.status(401).send('Unauthorized');
  const { judul, deskripsi, mapel, link, paket, kelas } = req.body;
  const waktu = new Date();
  db.query('INSERT INTO video (judul, deskripsi, mapel, link, paket, kelas, waktu) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [judul, deskripsi, mapel, link, paket, kelas, waktu],
    (err) => {
      if (err) return res.status(500).send('Gagal menyimpan video');
      res.redirect('/kelola-video.html');
    }
  );
});

app.get('/admin-video', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Unauthorized' });
  db.query('SELECT * FROM video ORDER BY waktu DESC', (err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil video' });
    res.json(result);
  });
});

app.delete('/api/video/:id', (req, res) => {
  db.query('DELETE FROM video WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Gagal menghapus video' });
    res.json({ success: true });
  });
});

app.get('/materi-video', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Session expired' });
  const { paket, kelas } = req.session.user;
  db.query('SELECT * FROM video WHERE paket = ? AND kelas = ? ORDER BY waktu DESC', [paket, kelas], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil data video' });
    res.json(rows);
  });
});

// ===== ROUTE: TUGAS SISWA =====
app.post('/upload-tugas', (req, res) => {
  if (!req.session.admin) return res.status(401).send('Unauthorized');
  const { judul, deskripsi, link, mapel, paket, kelas } = req.body;
  const dibuat_pada = new Date();
  db.query('INSERT INTO tugas (judul, deskripsi, link, mapel, paket, kelas, dibuat_pada) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [judul, deskripsi, link, mapel, paket, kelas, dibuat_pada],
    (err) => {
      if (err) return res.status(500).send('Gagal menyimpan tugas');
      res.send('Tugas berhasil disimpan');
    });
});

app.get('/admin-tugas', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Unauthorized' });
  db.query('SELECT * FROM tugas ORDER BY dibuat_pada DESC', (err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil data tugas' });
    res.json(result);
  });
});

app.get('/tugas-siswa', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Session expired' });
  const { paket, kelas } = req.session.user;
  db.query('SELECT * FROM tugas WHERE paket = ? AND kelas = ? ORDER BY dibuat_pada DESC', [paket, kelas], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil data tugas' });
    res.json(rows);
  });
});

app.delete('/hapus-tugas/:id', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Unauthorized' });
  db.query('DELETE FROM tugas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Gagal menghapus tugas' });
    res.json({ success: true });
  });
});

// ===== ROUTE: DATA SISWA =====
app.post('/tambah-siswa', (req, res) => {
  const { nama, username, password, paket, kelas } = req.body;
  if (!nama || !username || !password || !paket || !kelas) {
    return res.status(400).send('Data tidak lengkap');
  }

  db.query('INSERT INTO siswa (nama, username, password, paket, kelas) VALUES (?, ?, ?, ?, ?)',
    [nama, username, password, paket, kelas],
    (err) => {
      if (err) return res.status(500).send('Gagal menambahkan siswa');
      res.send('Siswa berhasil ditambahkan');
    });
});

app.get('/admin-siswa', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Unauthorized' });
  db.query('SELECT * FROM siswa ORDER BY nama ASC', (err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil data siswa' });
    res.json(result);
  });
});

app.delete('/hapus-siswa/:id', (req, res) => {
  if (!req.session.admin) return res.status(401).json({ error: 'Unauthorized' });
  db.query('DELETE FROM siswa WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Gagal menghapus siswa' });
    res.json({ success: true });
  });
});

// ===== GANTI PASSWORD SISWA =====
app.post('/ganti-password', (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  const { passwordBaru } = req.body;
  db.query('UPDATE siswa SET password = ? WHERE id = ?', [passwordBaru, req.session.user.id], (err) => {
    if (err) return res.status(500).send('Gagal mengganti password');
    res.send('Password berhasil diganti');
  });
});

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
