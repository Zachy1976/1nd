// ==========================================
// SCRIPT DETAL PROYEK (detail.html)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const titleEl = document.getElementById('project-title');
  const descEl = document.getElementById('project-description');
  const techEl = document.getElementById('project-tech');
  const linkEl = document.getElementById('project-link');
  const toastEl = document.getElementById('toast');

  if (!projectId) {
    if (titleEl) titleEl.textContent = 'Proyek Tidak Ditemukan';
    if (descEl) descEl.textContent = 'Parameter ID tidak ada pada URL.';
    return;
  }

  // Fetch Data dari JSON
  fetch('./data.json')
    .then((res) => {
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    })
    .then((projects) => {
      const project = projects.find((p) => String(p.id) === String(projectId));

      if (!project) {
        if (titleEl) titleEl.textContent = 'Proyek Tidak Ditemukan';
        if (descEl) descEl.textContent = 'Data proyek tidak cocok dengan ID ini.';
        return;
      }

      // Render data
      document.title = `${project.title} - Detail Proyek`;
      if (titleEl) titleEl.textContent = project.title;
      if (descEl) descEl.textContent = project.longDescription || project.description;
      if (linkEl) linkEl.href = project.link || '#';

      // Render Tech Badges
      if (techEl) {
        techEl.innerHTML = '';
        if (project.tech && Array.isArray(project.tech)) {
          project.tech.forEach((t) => {
            const badge = document.createElement('span');
            badge.textContent = t;
            badge.style.cssText = 'background: var(--card-border); color: var(--text-main); padding: 0.3rem 0.7rem; border-radius: 0.4rem; font-size: 0.85rem; border: 1px solid var(--card-border);';
            techEl.appendChild(badge);
          });
        }
      }

      // FITUR 1: Tombol Copy Link ke Clipboard
      setupCopyLink(project.link);
    })
    .catch((err) => {
      console.error(err);
      if (titleEl) titleEl.textContent = 'Terjadi Kesalahan';
    });

  // Logika Copy Link + Toast Notification
  function setupCopyLink(linkUrl) {
    if (!linkEl) return;

    // Tambah event listener klik kanan atau bikin tombol khusus
    linkEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(linkUrl || window.location.href);
      showToast('Link repo berhasil disalin! 📋');
    });
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');

    setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2500);
  }
});
