// ==========================================
// SCRIPT UTAMA (index.html) - SEARCH & FILTER
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');
  const statTotal = document.getElementById('stat-total');

  let rawProjectsData = [];
  let currentCategory = 'all';
  let currentSearchQuery = '';

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
      
      // Update angka total proyek di Stats Banner
      if (statTotal) {
        statTotal.textContent = rawProjectsData.length;
      }

      applyFiltersAndRender();
    })
    .catch((error) => {
      console.error('Gagal memuat data:', error);
      container.innerHTML = '<p class="loading" style="color: #ef4444;">Gagal memuat data proyek.</p>';
    });

  // 2. Fungsi Filter Gabungan (Kategori + Search)
  function applyFiltersAndRender() {
    let filtered = rawProjectsData;

    // Filter berdasarkan Kategori
    if (currentCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === currentCategory);
    }

    // Filter berdasarkan Kata Kunci Pencarian (Search Bar)
    if (currentSearchQuery.trim() !== '') {
      const query = currentSearchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const descMatch = p.description.toLowerCase().includes(query);
        const techMatch = p.tech && p.tech.some((t) => t.toLowerCase().includes(query));
        return titleMatch || descMatch || techMatch;
      });
    }

    renderProjects(filtered);
  }

  // 3. Fungsi Render Kartu Proyek
  function renderProjects(projects) {
    container.innerHTML = '';

    if (projects.length === 0) {
      container.innerHTML = '<p class="loading">Proyek tidak ditemukan.</p>';
      return;
    }

    projects.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

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

      // Redirect ke detail.html membawa ID proyek
      card.addEventListener('click', () => {
        window.location.href = `detail.html?id=${item.id}`;
      });

      container.appendChild(card);
    });
  }

  // 4. Event Listener Search Bar (Live Input)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      applyFiltersAndRender();
    });
  }

  // 5. Event Listener Filter Tombol Kategori
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.getAttribute('data-category');
      applyFiltersAndRender();
    });
  });
});

// FITUR 6: Sorting Logic
  const sortSelect = document.getElementById('sort-select');
  let currentSort = 'default';

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Di dalam fungsi applyFiltersAndRender():
  // (Tambahkan bagian ini sebelum memanggil renderProjects(filtered))
  if (currentSort === 'asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentSort === 'desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

// FITUR 7: Tombol Quick Share di Setiap Kartu
const shareBtn = document.createElement('button');
shareBtn.innerHTML = '🔗 Share';
shareBtn.style.cssText = 'background: transparent; border: 1px solid var(--card-border); color: var(--text-muted); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.75rem; cursor: pointer; transition: all 0.2s ease;';

shareBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Mencegah pemicu event klik kartu (pindah halaman)
  
  const detailUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}detail.html?id=${item.id}`;

  if (navigator.share) {
    navigator.share({
      title: item.title,
      text: item.description,
      url: detailUrl
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(detailUrl);
    shareBtn.innerHTML = '✅ Copied!';
    setTimeout(() => { shareBtn.innerHTML = '🔗 Share'; }, 2000);
  }
});

// Masukkan tombol share ke footer kartu di dalam render
const cardFooter = card.querySelector('div');
if (cardFooter) {
  cardFooter.appendChild(shareBtn);
}

// Dynamic Empty State di index.js
  if (projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
        <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Proyek Tidak Ditemukan</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">Coba cari kata kunci lain atau reset filter kamu.</p>
        <button id="reset-search-btn" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-size: 0.85rem;">
          Reset Pencarian
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-search-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentCategory = 'all';
        // Reset class active tombol filter
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn[data-category="all"]');
        if (allBtn) allBtn.classList.add('active');
        
        applyFiltersAndRender();
      });
    }
    return;
  }
