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

      // Tombol Copy Link ke Clipboard
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


// Indicator Scroll Progress Bar
  const progressBar = document.getElementById('read-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // Estimasi Waktu Baca (Dipanggil setelah deskripsi di-render)
  function calculateReadTime(text) {
    const wordsPerMinute = 200; // Rata-rata kecepatan membaca
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    
    const readTimeEl = document.createElement('span');
    readTimeEl.style.cssText = 'font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.25rem;';
    readTimeEl.textContent = `⏱️ Est. waktu baca: ${readTime} min`;
    
    if (descEl && descEl.parentElement) {
      descEl.parentElement.insertBefore(readTimeEl, descEl);
    }
  }
  
  // Panggil calculateReadTime(project.longDescription) pas data beres di-fetch!

// Keyboard Shortcut (Tekan 'Esc' atau 'Panah Kiri' untuk Kembali)
  document.addEventListener('keydown', (e) => {
    // Jalankan hanya jika user tidak sedang mengetik di input/textarea
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        window.location.href = 'index.html';
      }
    }
  });

  // Opsional: Tampilkan hint kecil di dekat tombol "Kembali"
  const backLink = document.querySelector('header nav a');
  if (backLink) {
    backLink.innerHTML += ' <kbd style="font-size: 0.7rem; background: var(--card-border); padding: 0.1rem 0.3rem; border-radius: 0.2rem; color: var(--text-muted);">ESC</kbd>';
  }

// Text-to-Speech (TTS) di detail.js
  const ttsBtn = document.getElementById('tts-btn');
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
      utterance.lang = 'id-ID'; // Bahasa Indonesia
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
    ttsBtn.style.display = 'none'; // Sembunyikan kalau browser ga support
  }
