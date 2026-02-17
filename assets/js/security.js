/**
 * ═══════════════════════════════════════════════════
 * PIPOCAFLIX — SECURITY.JS
 * Anti-inspect / Anti-debug / Anti-copy
 * ═══════════════════════════════════════════════════
 */
(function () {
  'use strict';

  // ─── Bloqueio de atalhos de teclado ───────────────
  document.addEventListener('keydown', function (e) {
    const k = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // Bloqueia: F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J,
    //           Ctrl+S, Ctrl+P, Ctrl+A, Ctrl+C
    const blocked =
      k === 'F12' ||
      (ctrl && k === 'u') ||
      (ctrl && k === 'U') ||
      (ctrl && shift && (k === 'I' || k === 'i')) ||
      (ctrl && shift && (k === 'J' || k === 'j')) ||
      (ctrl && shift && (k === 'C' || k === 'c')) ||
      (ctrl && (k === 's' || k === 'S')) ||
      (ctrl && (k === 'p' || k === 'P'));

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // ─── Bloqueia menu de contexto ─────────────────────
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  // ─── Bloqueia seleção de texto ─────────────────────
  document.addEventListener('selectstart', function (e) {
    // Permitir seleção em inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    return false;
  });

  // ─── Bloqueia arrastar elementos ──────────────────
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  });

  // ─── Anti-print screen / print ────────────────────
  document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen') {
      navigator.clipboard && navigator.clipboard.writeText('');
    }
  });

  // ─── Detecção de DevTools ──────────────────────────
  const devToolsDetect = () => {
    const threshold = 160;
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;

    if (widthDiff || heightDiff) {
      // DevTools provavelmente abertas
      _onDevToolsDetected();
    }
  };

  // ─── Técnica de timing debugger ───────────────────
  const _antiDebug = () => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const elapsed = performance.now() - start;
    if (elapsed > 100) {
      _onDevToolsDetected();
    }
  };

  let _devDetected = false;
  const _onDevToolsDetected = () => {
    if (_devDetected) return;
    _devDetected = true;
    // Redireciona suavemente
    try {
      document.body.innerHTML = '';
      setTimeout(() => {
        window.location.replace('https://www.google.com');
      }, 200);
    } catch (e) {
      window.location.href = 'https://www.google.com';
    }
  };

  // ─── Inicia detecção periódica ─────────────────────
  // Verificação a cada 1.5s
  setInterval(() => {
    devToolsDetect();
  }, 1500);

  // Anti-debug check a cada 3s
  setInterval(() => {
    _antiDebug();
  }, 3000);

  // ─── Override de console ───────────────────────────
  const _noop = () => undefined;
  try {
    Object.defineProperty(window, 'console', {
      get: () => ({
        log: _noop, warn: _noop, error: _noop,
        info: _noop, debug: _noop, trace: _noop,
        table: _noop, dir: _noop,
      }),
    });
  } catch (e) { /* ignore */ }

  // ─── Bloqueia view-source:// ──────────────────────
  // (Apenas informativo; o bloqueio real é feito via keydown)

  // ─── Proteção da imagem (capa) ────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('mousedown', e => e.preventDefault());
    });
  });

})();
