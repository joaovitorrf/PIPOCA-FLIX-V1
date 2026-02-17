/**
 * ═══════════════════════════════════════════════════
 * PIPOCAFLIX — SEARCH.JS
 * Busca inteligente com Fuzzy Search + Normalização
 * ═══════════════════════════════════════════════════
 */

const Search = (() => {
  // ─── Normalizar string ────────────────────────────
  const normalize = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s]/g, '')     // remove caracteres especiais
      .replace(/\s+/g, ' ')            // normaliza espaços
      .trim();
  };

  // ─── Algoritmo de Levenshtein ─────────────────────
  const levenshtein = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  };

  // ─── Score de similaridade (0 a 1) ───────────────
  const similarity = (query, target) => {
    const q = normalize(query);
    const t = normalize(target);
    if (!q || !t) return 0;

    // Match exato = score máximo
    if (t === q) return 1.0;

    // Contém exato
    if (t.includes(q)) return 0.9 - (Math.abs(t.length - q.length) * 0.005);
    if (q.includes(t)) return 0.85;

    // Match por palavras
    const qWords = q.split(' ').filter(Boolean);
    const tWords = t.split(' ').filter(Boolean);
    let wordMatches = 0;
    qWords.forEach(qw => {
      if (tWords.some(tw => tw.startsWith(qw) || qw.startsWith(tw))) wordMatches++;
    });
    const wordScore = qWords.length > 0 ? wordMatches / qWords.length : 0;
    if (wordScore > 0) return wordScore * 0.8;

    // Fuzzy com Levenshtein
    const maxLen = Math.max(q.length, t.length);
    const dist = levenshtein(q.substring(0, 20), t.substring(0, 20));
    const fuzzyScore = 1 - (dist / maxLen);
    return fuzzyScore > 0.5 ? fuzzyScore * 0.7 : 0;
  };

  // ─── Buscar em lista ──────────────────────────────
  const searchIn = (query, items, threshold = 0.3) => {
    if (!query || !items || items.length === 0) return items;

    const scored = items
      .map(item => {
        const nome    = item.Nome || item.name || '';
        const score   = similarity(query, nome);
        return { item, score };
      })
      .filter(({ score }) => score >= threshold)
      .sort((a, b) => b.score - a.score);

    return scored.map(({ item }) => item);
  };

  // ─── Busca com debounce ────────────────────────────
  let _debounceTimer = null;
  const debounced = (fn, delay = 350) => (...args) => {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(() => fn(...args), delay);
  };

  // ─── Highlight de match ────────────────────────────
  const highlight = (text, query) => {
    if (!query || !text) return text;
    const q = normalize(query);
    const t = normalize(text);
    const idx = t.indexOf(q);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match  = text.slice(idx, idx + query.length);
    const after  = text.slice(idx + query.length);
    return `${before}<mark>${match}</mark>${after}`;
  };

  return { normalize, similarity, searchIn, debounced, highlight };
})();

window.Search = Search;
