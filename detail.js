// ==========================================
// SCRIPT DETAIL PROYEK (detail.html)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const titleEl = document.getElementById('project-title');
  const descEl = document.getElementById('project-description');
  const techEl = document.getElementById('project-tech');
  const linkEl = document.getElementById('project-link');
  const toastEl = document.getElementById('toast');
  const progressBar = document.getElementById('read-progress');
  const ttsBtn = document.getElementById('tts-btn');

  // 1. Indikator Scroll Reading Progress
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  if (!projectId) {
    if (titleEl) titleEl.textContent = 'Proyek Tidak Ditemukan';
    if (descEl) descEl.textContent = 'Parameter ID tidak ada pada URL.';
    return;
  }

  // 2. Fetch Data dari JSON
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
      
      const fullText = project.longDescription || project.description;
      if (descEl) descEl.textContent = fullText;
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

      // Hitung Estimasi Waktu Baca
      calculateReadTime(fullText);

      // Fitur Copy Link
      setupCopyLink(project.link);
    })
    .catch((err) => {
      console.error(err);
      if (titleEl) titleEl.textContent = 'Terjadi Kesalahan';
    });

  // 3. Estimasi Waktu Baca
  function calculateReadTime(text) {
    if (!text) return;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    
    const readTimeEl = document.createElement('span');
    readTimeEl.style.cssText = 'font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.25rem;';
    readTimeEl.textContent = `⏱️ Est. waktu baca: ${readTime} min`;
    
    if (descEl && descEl.parentElement) {
      descEl.parentElement.insertBefore(readTimeEl, descEl);
    }
  }

  // 4. Logika Copy Link + Toast Notification
  function setupCopyLink(linkUrl) {
    if (!linkEl) return;
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
    setTimeout(() => { toastEl.classList.add('hidden'); }, 2500);
  }

  // 5. Keyboard Shortcut (ESC atau Panah Kiri)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        window.location.href = 'index.html';
      }
    }
  });

  // 6. Text-to-Speech (TTS)
  let isSpeaking = false;
  if (ttsBtn && 'speechSynthesis' in window) {
    ttsBtn.addEventListener('click', () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        ttsBtn.querySelector('span').textContent = 'Dengarkan';
        ttsBtn.style.borderColor = 'var(--card-border)';
        return;
      }

      const textToRead = descEl ? descEl.textContent : '';
      if (!textToRead) return;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;

      utterance.onstart = () => {
        isSpeaking = true;
        ttsBtn.querySelector('span').textContent = 'Stop Audio';
        ttsBtn.style.borderColor = 'var(--primary-color)';
      };

      utterance.onend = () => {
        isSpeaking = false;
        ttsBtn.querySelector('span').textContent = 'Dengarkan';
        ttsBtn.style.borderColor = 'var(--card-border)';
      };

      window.speechSynthesis.speak(utterance);
    });
  } else if (ttsBtn) {
    ttsBtn.style.display = 'none';
  }
});
