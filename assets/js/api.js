/**
 * ═══════════════════════════════════════════════════
 * PIPOCAFLIX — API.JS
 * Integração com Baserow API
 * ═══════════════════════════════════════════════════
 */

const API = (() => {
  // ─── Config ──────────────────────────────────────
  const BASE_URL   = 'http://213.199.56.115';
  const TOKEN      = '1rq7OOnCoVCuSDKXzv8k7JbGh9wO9MsH';
  const TABLE_ID   = 4400;   // Site Conteudos
  const TABLE_EP   = 5351;   // Site Episodios

  // ─── Cache em memória ─────────────────────────────
  const _cache   = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  const _cacheGet = (key) => {
    const hit = _cache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.ts > CACHE_TTL) { _cache.delete(key); return null; }
    return hit.data;
  };

  const _cacheSet = (key, data) => {
    _cache.set(key, { data, ts: Date.now() });
  };

  // ─── Fetch base ────────────────────────────────────
  const _fetch = async (url, opts = {}) => {
    const cached = _cacheGet(url);
    if (cached) return cached;

    const headers = {
      'Authorization': `Token ${TOKEN}`,
      'Content-Type':  'application/json',
      ...opts.headers
    };

    try {
      const res = await fetch(url, { ...opts, headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      _cacheSet(url, data);
      return data;
    } catch (err) {
      console.error('[PipocaFlix API]', err);
      throw err;
    }
  };

  // ─── Listar todos os conteúdos ────────────────────
  const getConteudos = async (page = 1, size = 100) => {
    const url = `${BASE_URL}/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=${size}&page=${page}`;
    return _fetch(url);
  };

  // ─── Buscar conteúdo por ID de linha ─────────────
  const getConteudoById = async (rowId) => {
    const url = `${BASE_URL}/api/database/rows/table/${TABLE_ID}/${rowId}/?user_field_names=true`;
    return _fetch(url);
  };

  // ─── Buscar episódios por nome da série ──────────
  const getEpisodios = async (nomeSerie) => {
    const encoded = encodeURIComponent(nomeSerie);
    const url = `${BASE_URL}/api/database/rows/table/${TABLE_EP}/?user_field_names=true&size=200&search=${encoded}`;
    return _fetch(url);
  };

  // ─── Buscar todos os episódios de uma série ───────
  const getAllEpisodios = async (nomeSerie) => {
    let allResults = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const encoded = encodeURIComponent(nomeSerie);
      const url = `${BASE_URL}/api/database/rows/table/${TABLE_EP}/?user_field_names=true&size=100&page=${page}&search=${encoded}`;
      try {
        const data = await _fetch(url);
        if (data.results && data.results.length > 0) {
          // Filtrar apenas episódios do nome exato
          const filtered = data.results.filter(ep => {
            const epNome = (ep.Nome || '').toLowerCase().trim();
            const serieNome = nomeSerie.toLowerCase().trim();
            return epNome.includes(serieNome) || serieNome.includes(epNome);
          });
          allResults = [...allResults, ...data.results];
        }
        hasMore = data.next !== null && data.next !== undefined;
        page++;
        if (page > 10) break; // Limite de segurança
      } catch {
        hasMore = false;
      }
    }

    return allResults;
  };

  // ─── Carregar todos os conteúdos (paginado) ───────
  const getAllConteudos = async () => {
    const cacheKey = 'ALL_CONTEUDOS';
    const cached = _cacheGet(cacheKey);
    if (cached) return cached;

    let allResults = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const data = await getConteudos(page, 200);
        if (data.results) allResults = [...allResults, ...data.results];
        hasMore = data.next !== null && data.next !== undefined;
        page++;
        if (page > 20) break; // Limite de segurança
      } catch {
        hasMore = false;
      }
    }

    _cacheSet(cacheKey, allResults);
    return allResults;
  };

  // ─── Agrupar episódios por temporada ─────────────
  const groupEpisodiosByTemporada = (episodios) => {
    const grouped = {};
    episodios.forEach(ep => {
      const temp = ep.Temporada || 1;
      if (!grouped[temp]) grouped[temp] = [];
      grouped[temp].push(ep);
    });
    // Ordenar episódios dentro de cada temporada
    Object.keys(grouped).forEach(temp => {
      grouped[temp].sort((a, b) => (a.Episódio || 0) - (b.Episódio || 0));
    });
    return grouped;
  };

  // ─── Exporta ─────────────────────────────────────
  return {
    getConteudos,
    getConteudoById,
    getEpisodios,
    getAllEpisodios,
    getAllConteudos,
    groupEpisodiosByTemporada,
    BASE_URL,
    TABLE_ID,
    TABLE_EP,
  };
})();

// Expõe globalmente
window.API = API;
