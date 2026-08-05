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


document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container');
  const modal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-modal');
  
  // Elemen di dalam modal
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalTech = document.getElementById('modal-tech');
  const modalLink = document.getElementById('modal-link');

  let rawProjectsData = [];

  // 1. Fetch Data dari JSON
  fetch('./data.json')
    .then((res) => {
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    })
    .then((data) => {
      rawProjectsData = data;
      renderProjects(rawProjectsData);
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = '<p class="loading" style="color: #ef4444;">Gagal memuat data proyek.</p>';
    });

  // 2. Fungsi Render Kartu Proyek
  function renderProjects(projects) {
    container.innerHTML = '';

    if (projects.length === 0) {
      container.innerHTML = '<p class="loading">Tidak ada proyek di kategori ini.</p>';
      return;
    }

    projects.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">
          ${item.tech ? item.tech.join(' • ') : 'HTML/CSS'}
        </span>
      `;

      // Event Listener buat Buka Modal Detail saat Kartu Diklik
      card.addEventListener('click', () => openModal(item));

      container.appendChild(card);
    });
  }

  // 3. Fungsi Buka Modal Detail
  function openModal(item) {
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.longDescription || item.description;
    
    // Render Tag Teknologi
    modalTech.innerHTML = '';
    if (item.tech && Array.isArray(item.tech)) {
      item.tech.forEach((t) => {
        const badge = document.createElement('span');
        badge.textContent = t;
        badge.style.cssText = 'background: var(--border-color); color: var(--text-main); padding: 0.2rem 0.6rem; border-radius: 0.25rem; font-size: 0.75rem;';
        modalTech.appendChild(badge);
      });
    }

    modalLink.href = item.link || '#';
    modal.classList.remove('hidden');
  }

  // 4. Event Listener buat Tutup Modal
  closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // 5. Fitur Filter Kategori
  const filterBtns = document.querySelectorAll('.filter-btn');
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

// Arahkan pengunjung ke halaman detail.html bawa ID proyek
card.addEventListener('click', () => {
  window.location.href = `detail.html?id=${item.id}`;
});

///Trying Reaacttt.js
