fetch('/api/admin')
  .then(res => {
    if (!res.ok) throw new Error('Sesi login habis');
    return res.json();
  })
  .then(data => {
    document.getElementById('welcome').textContent = `Selamat Datang, ${data.nama}`;
    document.getElementById('nama-admin').textContent = data.nama;
    document.getElementById('paket-admin').textContent = data.paket;
    document.getElementById('kelas-admin').textContent = data.kelas;
  })
  .catch(() => {
    alert('Sesi login sudah habis. Silakan login ulang.');
    window.location.href = 'login-admin.html';
  });
