// ==========================================
// SCRIPT UTAMA (index.html) - UPDATED
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let rawProjectsData = [];

  // 1. Fetch data dari file data.json
  fetch('./data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      rawProjectsData = data;
      renderProjects(rawProjectsData);
    })
    .catch((error) => {
      console.error('Gagal memuat data:', error);
      container.innerHTML = '<p class="loading" style="color: #ef4444;">Gagal memuat data proyek.</p>';
    });

  // 2. Fungsi Render Kartu Proyek
  function renderProjects(projects) {
    container.innerHTML = '';

    if (projects.length === 0) {
      container.innerHTML = '<p class="loading">Belum ada proyek di kategori ini.</p>';
      return;
    }

    projects.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

      // Render Badge Tech Stack
      const techBadges = item.tech && Array.isArray(item.tech) 
        ? item.tech.join(' • ') 
        : 'HTML/CSS';

      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">
            ${techBadges}
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Lihat Detail →</span>
        </div>
      `;

      // REDIRECT KE DETAIL.HTML SAAT KARTU DIKLIK
      card.addEventListener('click', () => {
        window.location.href = `detail.html?id=${item.id}`;
      });

      container.appendChild(card);
    });
  }

  // 3. Fitur Filter Kategori
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      
      if (category === 'all') {
        renderProjects(rawProjectsData);
      } else {
        const filtered = rawProjectsData.filter((p) => p.category === category);
        renderProjects(filtered);
      }
    });
  });
});
