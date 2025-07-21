window.addEventListener('DOMContentLoaded', () => {
  fetch('/api/siswa')
    .then(response => response.json())
    .then(data => {
      if (data && data.nama) {
        // Tampilkan data siswa ke elemen di HTML
        document.getElementById('nama-siswa').textContent = data.nama;
        document.getElementById('paket-siswa').textContent = data.paket;
        document.getElementById('kelas-siswa').textContent = 'Kelas ' + data.kelas;
        document.getElementById('welcome').textContent = 'Selamat Datang, ' + data.nama;
      }
    })
    .catch(err => {
      console.error('Gagal mengambil data siswa:', err);
    });
});
