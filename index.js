// ==========================================
// SCRIPT UTAMA (index.html)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const statTotal = document.getElementById('stat-total');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const backToTopBtn = document.getElementById('back-to-top');

  let rawProjectsData = [];
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let currentSort = 'default';

  // 1. Theme Toggle & LocalStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeToggleBtn.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // 2. Back to Top Button
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('hidden');
      } else {
        backToTopBtn.classList.add('hidden');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Skeleton Loading State
  function showSkeletonLoading() {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const skel = document.createElement('div');
      skel.className = 'skeleton-card';
      skel.innerHTML = `
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text-short"></div>
      `;
      container.appendChild(skel);
    }
  }

  showSkeletonLoading();

  // 4. Fetch Data JSON
  fetch('./data.json')
    .then((res) => { 
      const targetGoal = 10; // Target total proyek
      const currentTotal = rawProjectsData.length;
      const percentage = Math.min((currentTotal / targetGoal) * 100, 100);

      const targetText = document.getElementById('target-text');
      const progressBar = document.getElementById('target-progress-bar');

      if (targetText) targetText.textContent = `${currentTotal} / ${targetGoal} Proyek`;
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (!res.ok) throw new Error('Gagal mengambil data proyek');
      return res.json();
    })
    .then((data) => {
      rawProjectsData = data;
      updateCategoryCounts(rawProjectsData);
      if (statTotal) statTotal.textContent = rawProjectsData.length;
      
      setTimeout(() => {
        applyFiltersAndRender();
      }, 300);
    })
    .catch((err) => {
      console.error(err);
      if (container) {
        container.innerHTML = '<p class="loading" style="color: #ef4444;">Gagal memuat data proyek.</p>';
      }
    });

  // 5. Update Badge Counter Kategori
  function updateCategoryCounts(data) {
    const countAll = document.getElementById('count-all');
    const countWeb = document.getElementById('count-web');
    const countTools = document.getElementById('count-tools');

    if (countAll) countAll.textContent = data.length;
    if (countWeb) countWeb.textContent = data.filter(p => p.category === 'web').length;
    if (countTools) countTools.textContent = data.filter(p => p.category === 'tools').length;
  }

  // 6. Filter & Sorting Logic
  function applyFiltersAndRender() {
    let filtered = [...rawProjectsData];

    if (currentCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === currentCategory);
    }

    if (currentSearchQuery.trim() !== '') {
      const query = currentSearchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const descMatch = p.description.toLowerCase().includes(query);
        const techMatch = p.tech && p.tech.some((t) => t.toLowerCase().includes(query));
        return titleMatch || descMatch || techMatch;
      });
    }

    if (currentSort === 'asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderProjects(filtered);
  }

  // 7. Render Kartu Proyek
  function renderProjects(projects) {
    if (!container) return;
    container.innerHTML = '';

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
          currentSearchQuery = '';
          currentCategory = 'all';
          filterBtns.forEach(b => b.classList.remove('active'));
          const allBtn = document.querySelector('.filter-btn[data-category="all"]');
          if (allBtn) allBtn.classList.add('active');
          applyFiltersAndRender();
        });
      }
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
        <div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
        <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">
            ${techBadges}
          </span>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="quick-share-btn" style="background: transparent; border: 1px solid var(--card-border); color: var(--text-muted); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.75rem; cursor: pointer;">🔗 Share</button>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Detail →</span>
          </div>
        </div>
      `;

      // Quick Share Event Listener
      const shareBtn = card.querySelector('.quick-share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const detailUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}detail.html?id=${item.id}`;

          if (navigator.share) {
            navigator.share({ title: item.title, text: item.description, url: detailUrl }).catch(() => {});
          } else {
            navigator.clipboard.writeText(detailUrl);
            shareBtn.innerHTML = '✅ Copied!';
            setTimeout(() => { shareBtn.innerHTML = '🔗 Share'; }, 2000);
          }
        });
      }

      // Redirect ke Detail Page
      card.addEventListener('click', () => {
        window.location.href = `detail.html?id=${item.id}`;
      });

      container.appendChild(card);
    });
  }

  // 8. Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      applyFiltersAndRender();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      applyFiltersAndRender();

      // Tambahkan listener modal di dalam renderProjects
const previewBtn = document.createElement('button');
previewBtn.innerHTML = '💻 Preview';
previewBtn.style.cssText = 'background: transparent; border: 1px solid var(--card-border); color: var(--text-muted); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.75rem; cursor: pointer;';

previewBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const modal = document.getElementById('code-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCode = document.getElementById('modal-code');
  
  if (modal && modalTitle && modalCode) {
    modalTitle.textContent = item.title;
    modalCode.textContent = `// ID: ${item.id}\n// Stack: ${item.tech ? item.tech.join(', ') : 'JS'}\nconsole.log("Menjalankan ${item.title}...");`;
    modal.classList.remove('hidden');
  }
});

// Event listener close modal (ditaruh di luar renderProjects / saat DOMContentLoaded)
const closeModalBtn = document.getElementById('close-modal-btn');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    document.getElementById('code-modal')?.classList.add('hidden');
  });
}
    });
  });
  
  // /DYNAMIC TAB TITLE ON BLUR

let originalTitle = document.title;

window.addEventListener('blur', () => {
  originalTitle = document.title;
  document.title = '👋 Hei, balik lagi ke sini!';
});

window.addEventListener('focus', () => {
  document.title = originalTitle;
});

// Random Project Redirection
const randomBtn = document.getElementById('random-project-btn');
if (randomBtn) {
  randomBtn.addEventListener('click', () => {
    if (rawProjectsData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * rawProjectsData.length);
    const selectedProject = rawProjectsData[randomIndex];
    window.location.href = `detail.html?id=${selectedProject.id}`;
  });
}});

// FITUR 1: Share dengan Toast
if (shareBtn) {
  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const detailUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}detail.html?id=${item.id}`;

    navigator.clipboard.writeText(detailUrl);
    
    // Tampilkan Toast
    const indexToast = document.getElementById('index-toast');
    if (indexToast) {
      indexToast.classList.remove('hidden');
      setTimeout(() => { indexToast.classList.add('hidden'); }, 2000);
    }
  });
}

