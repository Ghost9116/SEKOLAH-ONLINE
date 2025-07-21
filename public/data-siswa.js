// data-siswa.js
document.addEventListener('DOMContentLoaded', () => {
  loadSiswa();

  const form = document.getElementById('form-siswa');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
      nama: form.nama.value,
      username: form.username.value,
      password: form.password.value,
      paket: form.paket.value,
      kelas: form.kelas.value
    };

    fetch('/tambah-siswa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal menambahkan siswa');
        return res.text();
      })
      .then(msg => {
        alert(msg);
        form.reset();
        loadSiswa();
      })
      .catch(err => {
        alert(err.message);
      });
  });
});

function loadSiswa() {
  fetch('/admin-siswa')
    .then(res => {
      if (!res.ok) throw new Error('Sesi login admin berakhir');
      return res.json();
    })
    .then(siswaList => {
      const container = document.getElementById('siswa-list');
      container.innerHTML = '';

      if (siswaList.length === 0) {
        container.innerHTML = '<p>Belum ada data siswa.</p>';
        return;
      }

      siswaList.forEach(siswa => {
        const div = document.createElement('div');
        div.classList.add('siswa-item');
        div.innerHTML = `
          <p>👤 <strong>${siswa.nama}</strong> (${siswa.username})</p>
          <p>🎒 Paket: ${siswa.paket} | Kelas: ${siswa.kelas}</p>
          <button class="hapus" onclick="hapusSiswa(${siswa.id})">🗑 Hapus</button>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      alert('Sesi login admin telah habis. Silakan login ulang.');
      window.location.href = 'login-admin.html';
    });
}

function hapusSiswa(id) {
  if (confirm('Yakin ingin menghapus siswa ini?')) {
    fetch(`/hapus-siswa/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        loadSiswa();
      })
      .catch(() => {
        alert('Gagal menghapus siswa');
      });
  }
}
