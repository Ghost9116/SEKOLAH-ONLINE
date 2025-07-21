document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/siswa')
    .then(res => {
      if (!res.ok) throw new Error('Sesi login habis');
      return res.json();
    })
    .then(siswa => {
      // Tampilkan paket dan kelas
      document.getElementById('info-paket-kelas').textContent = `Paket ${siswa.paket} - Kelas ${siswa.kelas}`;

      // Ambil daftar tugas sesuai paket & kelas
      fetch(`/tugas-siswa?paket=${siswa.paket}&kelas=${siswa.kelas}`)
        .then(res => {
          if (!res.ok) throw new Error('Gagal mengambil data tugas');
          return res.json();
        })
        .then(tugasList => {
          const container = document.getElementById('tugas-container');
          container.innerHTML = '';

          if (tugasList.length === 0) {
            container.innerHTML = '<p>📭 Belum ada tugas untuk kamu saat ini.</p>';
            return;
          }

          tugasList.forEach(tugas => {
            const box = document.createElement('div');
            box.classList.add('tugas-box');
            box.innerHTML = `
              <h3>${tugas.judul}</h3>
              <p>${tugas.deskripsi}</p>
              <p><strong>Mapel:</strong> ${tugas.mapel}</p>
              <p><strong>📅 Dibuat:</strong> ${new Date(tugas.dibuat_pada).toLocaleString()}</p>
              <a href="${tugas.link}" target="_blank">
                <button>📄 Buka Tugas</button>
              </a>
            `;
            container.appendChild(box);
          });
        });
    })
    .catch(err => {
      alert('Sesi login sudah habis. Silakan login ulang.');
      window.location.href = 'login.html';
    });
});
