document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambil ID proyek dari URL (misal: detail.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const titleEl = document.getElementById('project-title');
  const descEl = document.getElementById('project-description');
  const techEl = document.getElementById('project-tech');
  const linkEl = document.getElementById('project-link');

  if (!projectId) {
    titleEl.textContent = 'Proyek Tidak Ditemukan';
    descEl.textContent = 'Parameter ID tidak ada pada URL.';
    return;
  }

  // 2. Fetch data dari data.json
  fetch('./data.json')
    .then((res) => {
      if (!res.ok) throw new Error('Gagal mengambil data');
      return res.json();
    })
    .then((projects) => {
      // Cari proyek yang ID-nya cocok
      const project = projects.find((p) => String(p.id) === String(projectId));

      if (!project) {
        titleEl.textContent = 'Proyek Tidak Ditemukan';
        descEl.textContent = 'Data proyek dengan ID ini tidak ada di JSON.';
        return;
      }

      // Render data ke halaman detail.html
      document.title = `${project.title} - Detail Proyek`;
      titleEl.textContent = project.title;
      descEl.textContent = project.longDescription || project.description;
      linkEl.href = project.link || '#';

      // Render tech stack
      techEl.innerHTML = '';
      if (project.tech && Array.isArray(project.tech)) {
        project.tech.forEach((t) => {
          const badge = document.createElement('span');
          badge.textContent = t;
          badge.style.cssText = 'background: var(--border-color); color: var(--text-main); padding: 0.3rem 0.7rem; border-radius: 0.25rem; font-size: 0.85rem;';
          techEl.appendChild(badge);
        });
      }
    })
    .catch((err) => {
      console.error(err);
      titleEl.textContent = 'Terjadi Kesalahan';
      descEl.textContent = 'Gagal memuat data dari server lokal.';
    });
});
