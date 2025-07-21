document.addEventListener('DOMContentLoaded', () => {
  loadVideo();

  const form = document.getElementById('uploadForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    fetch('/upload-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal simpan');
        return res.text();
      })
      .then(msg => {
        alert(msg);
        form.reset();
        loadVideo();
      })
      .catch(() => {
        alert('Gagal menyimpan video. Silakan login ulang.');
        window.location.href = 'login-admin.html';
      });
  });
});

function loadVideo() {
  fetch('/admin-video')
    .then(res => {
      if (!res.ok) throw new Error('Session expired');
      return res.json();
    })
    .then(videos => {
      const container = document.getElementById('video-list');
      container.innerHTML = '';

      if (videos.length === 0) {
        container.innerHTML = '<p>Belum ada video ditambahkan.</p>';
        return;
      }

      videos.forEach(video => {
        const youtubeId = getYoutubeID(video.link);
        const div = document.createElement('div');
        div.classList.add('video-item');
        div.innerHTML = `
          <h3>${video.judul} (${video.mapel})</h3>
          <iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>
          <p>${video.deskripsi}</p>
          <p>Paket ${video.paket} | Kelas ${video.kelas}</p>
          <p>🕒 ${new Date(video.waktu).toLocaleString()}</p>
          <button onclick="hapusVideo(${video.id})">🗑 Hapus</button>
        `;
        container.appendChild(div);
      });
    })
    .catch(() => {
      alert('Sesi login admin telah habis. Silakan login ulang.');
      window.location.href = 'login-admin.html';
    });
}

function hapusVideo(id) {
  if (confirm('Yakin ingin menghapus video ini?')) {
    fetch(`/api/video/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => loadVideo())
      .catch(() => alert('Gagal menghapus video.'));
  }
}

function getYoutubeID(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
}
