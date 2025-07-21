document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-password');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      password_lama: form.password_lama.value,
      password_baru: form.password_baru.value
    };

    const res = await fetch('/ganti-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const text = await res.text();

    if (res.ok) {
      alert(text);
      form.reset();
      window.location.href = 'dashboard.html';
    } else {
      alert(`❌ ${text}`);
    }
  });
});
