document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-upload');
  if (!form) return;

  // Submit Form
  form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/upload-tugas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        form.reset();
        loadTugas();
      })
      .catch(() => {
        alert('Gagal menyimpan tugas');
      });
  });

  loadTugas();
});

function loadTugas() {
  fetch('/admin-tugas')
    .then(res => {
      if (!res.ok) throw new Error('Sesi login habis');
      return res.json();
    })
    .then(tugas => {
      const container = document.getElementById('daftar-tugas');
      container.innerHTML = '';

      if (tugas.length === 0) {
        container.innerHTML = '<p>📭 Belum ada tugas diupload.</p>';
        return;
      }

      tugas.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('tugas-box');
        div.innerHTML = `
          <h3>${item.judul} (${item.mapel})</h3>
          <p>${item.deskripsi}</p>
          <p><a href="${item.link}" target="_blank">📎 Buka Form Tugas</a></p>
          <p>Paket: ${item.paket} | Kelas: ${item.kelas}</p>
          <p>🕒 ${new Date(item.dibuat_pada).toLocaleString()}</p>
          <button onclick="hapusTugas(${item.id})">🗑 Hapus</button>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      alert('Sesi login admin telah habis. Silakan login ulang.');
      window.location.href = 'login-admin.html';
    });
}

function hapusTugas(id) {
  if (confirm('Yakin ingin menghapus tugas ini?')) {
    fetch(`/hapus-tugas/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => loadTugas())
      .catch(() => alert('Gagal menghapus tugas'));
  }
}
