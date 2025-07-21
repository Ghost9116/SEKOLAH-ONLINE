document.addEventListener('DOMContentLoaded', () => {
  fetch('/materi-video')
    .then(res => {
      if (!res.ok) throw new Error('Session expired');
      return res.json();
    })
    .then(videos => {
      const container = document.getElementById('materi-container');
      container.innerHTML = '';

      if (!videos || videos.length === 0) {
        container.innerHTML = '<p>📭 Belum ada materi pembelajaran untukmu.</p>';
        return;
      }

      videos.forEach(video => {
        const videoBox = document.createElement('div');
        videoBox.classList.add('materi-box');

        const youtubeId = getYoutubeID(video.link);

        if (!youtubeId) return;

        videoBox.innerHTML = `
          <h3>${video.judul} <span style="font-size: 14px;">(${video.mapel})</span></h3>
          <div class="video-wrapper">
            <iframe 
              src="https://www.youtube.com/embed/${youtubeId}" 
              frameborder="0" 
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>
          <p>${video.deskripsi}</p>
          <p>🕒 ${new Date(video.waktu).toLocaleString('id-ID')}</p>
        `;

        container.appendChild(videoBox);
      });
    })
    .catch(() => {
      alert('Sesi login sudah habis. Silakan login ulang.');
      window.location.href = 'login.html';
    });
});

function getYoutubeID(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
}
