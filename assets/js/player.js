/**
 * ═══════════════════════════════════════════════════
 * PIPOCAFLIX — PLAYER.JS
 * Lógica do player de vídeo com desbloqueio
 * ═══════════════════════════════════════════════════
 */

const Player = (() => {
  const SMARTLINK = 'https://www.effectivegatecpm.com/eacwhk55f?key=87f8fc919fb5d70a825293b5490713dd';
  const MAX_CLICKS = 3;

  let clickCount = 0;
  let hideTimer   = null;
  let isFullscreen = false;

  // ─── Elementos ────────────────────────────────────
  const els = {
    get video()         { return document.getElementById('video'); },
    get overlay()       { return document.getElementById('playerOverlay'); },
    get centerPlay()    { return document.getElementById('centerPlay'); },
    get controls()      { return document.getElementById('playerControls'); },
    get playerBox()     { return document.getElementById('playerBox'); },
    get playPauseBtn()  { return document.getElementById('playPauseBtn'); },
    get back10Btn()     { return document.getElementById('back10'); },
    get fwd10Btn()      { return document.getElementById('forward10'); },
    get fullscreenBtn() { return document.getElementById('fullscreenBtn'); },
    get progress()      { return document.getElementById('playerProgress'); },
    get progressFill()  { return document.getElementById('playerProgressFill'); },
    get currentTime()   { return document.getElementById('currentTime'); },
    get totalTime()     { return document.getElementById('totalTime'); },
    get unlockBtn()     { return document.getElementById('unlockBtn'); },
    get unlockSteps()   { return document.querySelectorAll('.unlock-step'); },
    get playerTitle()   { return document.getElementById('playerTitle'); },
  };

  // ─── Formatar tempo ───────────────────────────────
  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ─── SVG Icons ────────────────────────────────────
  const icons = {
    play:  '<path d="M8 5v14l11-7z"/>',
    pause: '<path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/>',
    fullscreenEnter: '<path d="M4 4h6v2H6v4H4V4zm14 0v6h-2V6h-4V4h6zm0 14h-6v-2h4v-4h2v6zm-14 0v-6h2v4h4v2H4z"/>',
    fullscreenExit:  '<path d="M4 18h6v2H4v-6h2v4zm16-4h-2v4h-4v2h6v-6zM4 6H2V2h6v2H4v2zm10-4h6v6h-2V4h-4V2z"/>',
  };

  // ─── Iniciar reprodução ────────────────────────────
  const startPlay = () => {
    const { overlay, centerPlay, controls, video } = els;
    if (!video) return;
    overlay.classList.add('hidden');
    centerPlay.style.opacity = '0';
    controls.classList.remove('hidden');
    video.play().catch(() => {});
  };

  // ─── Toggle play/pause ─────────────────────────────
  const togglePlayPause = () => {
    const { video, playPauseBtn } = els;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  // ─── Update play/pause icon ───────────────────────
  const updatePlayIcon = (playing) => {
    const btn = els.playPauseBtn;
    if (!btn) return;
    const svg = btn.querySelector('svg');
    if (svg) {
      const pathEl = svg.querySelector('path');
      if (pathEl) pathEl.setAttribute('d', playing ? icons.pause.match(/d="([^"]+)"/)[1] : icons.play.match(/d="([^"]+)"/)[1]);
    }
  };

  // ─── Progresso ────────────────────────────────────
  const updateProgress = () => {
    const { video, progressFill, currentTime, totalTime } = els;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (currentTime) currentTime.textContent = formatTime(video.currentTime);
    if (totalTime)   totalTime.textContent   = formatTime(video.duration);
  };

  // ─── Seek ─────────────────────────────────────────
  const seek = (e) => {
    const { video, progress } = els;
    if (!video || !video.duration || !progress) return;
    const rect = progress.getBoundingClientRect();
    const pos  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * video.duration;
  };

  // ─── Fullscreen ────────────────────────────────────
  const toggleFullscreen = async () => {
    const { playerBox, fullscreenBtn } = els;
    if (!playerBox) return;

    try {
      if (!document.fullscreenElement) {
        await playerBox.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          try { await screen.orientation.lock('landscape'); } catch(e) {}
        }
        isFullscreen = true;
      } else {
        await document.exitFullscreen();
        isFullscreen = false;
      }

      // Atualiza ícone
      if (fullscreenBtn) {
        const svg = fullscreenBtn.querySelector('svg');
        if (svg) {
          const pathEl = svg.querySelector('path');
          if (pathEl) {
            pathEl.setAttribute('d', isFullscreen
              ? icons.fullscreenExit.match(/d="([^"]+)"/)[1]
              : icons.fullscreenEnter.match(/d="([^"]+)"/)[1]
            );
          }
        }
      }
    } catch(e) { /* ignore */ }
  };

  // ─── Auto-hide controls ────────────────────────────
  const showControls = () => {
    const { controls } = els;
    if (!controls) return;
    controls.classList.remove('hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      const { video } = els;
      if (video && !video.paused) controls.classList.add('hidden');
    }, 2500);
  };

  // ─── Botão unlock ─────────────────────────────────
  const setupUnlock = () => {
    const { unlockBtn, playerBox, unlockSteps } = els;
    if (!unlockBtn) return;

    unlockBtn.addEventListener('click', () => {
      // Abre smartlink
      window.open(SMARTLINK, '_blank');
      clickCount++;

      // Atualiza steps visuais
      if (unlockSteps && unlockSteps.length > 0) {
        unlockSteps.forEach((step, i) => {
          if (i < clickCount) step.classList.add('done');
        });
      }

      if (clickCount < MAX_CLICKS) {
        unlockBtn.textContent = `🔓 Clique mais ${MAX_CLICKS - clickCount} vez(es) para desbloquear`;
      } else {
        unlockBtn.textContent = '✅ Player Desbloqueado!';
        unlockBtn.disabled = true;
        if (playerBox) playerBox.style.display = 'block';

        // Scroll suave até o player
        playerBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  // ─── Configurar player para série ─────────────────
  const loadEpisode = (src, title) => {
    const { video, overlay, centerPlay, controls, playerBox, unlockBtn } = els;

    // Abre smartlink
    window.open(SMARTLINK, '_blank');

    if (!playerBox) return;
    playerBox.style.display = 'block';

    if (video) {
      video.src = src;
      video.load();
    }

    if (els.playerTitle) els.playerTitle.textContent = title || '';
    if (overlay) overlay.classList.remove('hidden');
    if (centerPlay) centerPlay.style.opacity = '1';
    if (controls) controls.classList.add('hidden');

    playerBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // ─── Init ─────────────────────────────────────────
  const init = () => {
    const { video, overlay, centerPlay, controls, playerBox,
            back10Btn, fwd10Btn, fullscreenBtn, progress } = els;

    if (!video) return;

    // Play ao clicar overlay
    overlay && overlay.addEventListener('click', startPlay);
    centerPlay && centerPlay.addEventListener('click', startPlay);

    // Play/Pause button
    const ppBtn = els.playPauseBtn;
    ppBtn && ppBtn.addEventListener('click', togglePlayPause);

    // Eventos do vídeo
    video.addEventListener('play',  () => updatePlayIcon(true));
    video.addEventListener('pause', () => updatePlayIcon(false));
    video.addEventListener('ended', () => {
      updatePlayIcon(false);
      if (overlay) overlay.classList.remove('hidden');
      if (centerPlay) centerPlay.style.opacity = '1';
      if (controls) controls.classList.add('hidden');
    });
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);

    // Controles
    back10Btn && back10Btn.addEventListener('click', () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
    });
    fwd10Btn && fwd10Btn.addEventListener('click', () => {
      video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    });

    // Fullscreen
    fullscreenBtn && fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => {
      isFullscreen = !!document.fullscreenElement;
    });

    // Progress bar
    progress && progress.addEventListener('click', seek);

    // Auto-hide controls
    playerBox && playerBox.addEventListener('mousemove', showControls);
    playerBox && playerBox.addEventListener('touchstart', showControls);

    // Teclado (space = play/pause)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
      }
    });

    // Botão de unlock (filmes)
    setupUnlock();
  };

  return { init, loadEpisode, formatTime, SMARTLINK };
})();

window.Player = Player;

// Auto-inicializa
document.addEventListener('DOMContentLoaded', () => Player.init());
