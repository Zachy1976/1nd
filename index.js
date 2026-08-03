// ==========================================
// FETCH & RENDER DATA DARI JSON LOKAL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container');

  // Fetch data dari file data.json
  fetch('./data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((projects) => {
      // Bersihkan indikator loading
      container.innerHTML = '';

      // Kalau data kosong
      if (projects.length === 0) {
        container.innerHTML = '<p class="loading">Belum ada proyek yang ditampilkan.</p>';
        return;
      }

      // Loop data JSON dan render jadi elemen HTML
      projects.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">
            ${item.tech || 'HTML/CSS'}
          </span>
        `;

        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Gagal memuat data:', error);
      container.innerHTML = '<p class="loading" style="color: #ef4444;">Gagal memuat data proyek.</p>';
    });
});



///Trying Reaacttt.js
