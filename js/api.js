/* ══════════════════════════════════════
   大安ㄍㄤㄍㄤ好籃球聯盟 — API 抽象層
   ══════════════════════════════════════
   所有資料存取統一透過此模組。
   ── 資料來源優先級 ──
   1. file:// 協定 → MOCK_DATA（本地開發）
   2. GAS Web App → Google Sheets 即時資料
   3. 靜態 JSON   → ./data/ 目錄（GAS 不可用時 fallback）
   ══════════════════════════════════════ */

const ApiConfig = {
  /**
   * GAS Web App 已部署 URL
   * 部署後將下方 URL 替換為實際的 GAS Web App URL
   * 格式: https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
   * 設為空字串 '' 則回退至靜態 JSON
   */
  GAS_URL: '',

  /** 靜態 JSON fallback 路徑 */
  STATIC_URL: './data',

  /** 各端點對應的 type 參數（GAS 用）與靜態檔名（fallback 用） */
  endpoints: {
    roster:    { type: 'roster',    file: 'roster.json'    },
    schedule:  { type: 'schedule',  file: 'schedule.json'  },
    stats:     { type: 'stats',     file: 'stats.json'     },
    standings: { type: 'standings', file: 'standings.json'  },
    dragon:    { type: 'dragon',    file: 'dragon.json'    },
    rotation:  { type: 'rotation',  file: 'rotation.json'  },
    hof:       { type: 'hof',       file: 'hof.json'       },
    home:      { type: 'home',      file: 'home.json'      },
  },

  /** 預設 fetch 選項 */
  defaultOptions: {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  },

  /** 請求超時時間（ms）— GAS 冷啟動可能較慢，設 15 秒 */
  timeout: 15000,
};

/* ── 模式判斷 ── */
const IS_LOCAL_FILE = window.location.protocol === 'file:';
const USE_GAS = !IS_LOCAL_FILE && ApiConfig.GAS_URL !== '';

/* ── 核心 fetch 封裝 ── */

/**
 * 通用 JSON fetch，帶超時與錯誤處理
 * - file:// 模式 → MOCK_DATA（需載入 mock-data.js）
 * - GAS 模式     → GAS_URL?type=xxx，失敗時回退靜態 JSON
 * - 靜態模式     → STATIC_URL/xxx.json
 * @param {string} endpoint - ApiConfig.endpoints 中的 key
 * @param {object} [options] - 額外的 fetch options
 * @returns {Promise<any>} parsed JSON
 */
async function apiFetch(endpoint, options) {
  const ep = ApiConfig.endpoints[endpoint];
  if (!ep) throw new Error(`[api] 未知的 endpoint: ${endpoint}`);

  /* ── file:// 模式：回傳內嵌假資料 ── */
  if (IS_LOCAL_FILE) {
    if (typeof MOCK_DATA !== 'undefined' && MOCK_DATA[endpoint]) {
      console.info(`[mock] 使用本地假資料: ${endpoint}`);
      return JSON.parse(JSON.stringify(MOCK_DATA[endpoint]));
    }
    console.warn(`[mock] 找不到 ${endpoint} 的假資料，嘗試 fetch...`);
  }

  /* ── 決定請求 URL ── */
  const url = USE_GAS
    ? `${ApiConfig.GAS_URL}?type=${ep.type}`
    : `${ApiConfig.STATIC_URL}/${ep.file}`;

  const fetchOptions = Object.assign({}, ApiConfig.defaultOptions, options);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ApiConfig.timeout);
  fetchOptions.signal = controller.signal;

  try {
    const res = await fetch(url, fetchOptions);
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    }

    /* GAS 偶爾回傳 HTML 錯誤頁，先取 text 再 parse 較安全 */
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      throw new Error(`[api] 回應不是有效的 JSON (${endpoint})`);
    }
  } catch (err) {
    clearTimeout(timer);

    if (err.name === 'AbortError') {
      throw new Error(`[api] 請求超時: ${url}`);
    }

    /* ── GAS 失敗時回退至靜態 JSON ── */
    if (USE_GAS) {
      console.warn(`[api] GAS 請求失敗 (${endpoint})，回退至靜態 JSON:`, err.message);
      const fallbackUrl = `${ApiConfig.STATIC_URL}/${ep.file}`;
      try {
        const fbRes = await fetch(fallbackUrl);
        if (fbRes.ok) return await fbRes.json();
      } catch (_) { /* fallback 也失敗，拋出原始錯誤 */ }
    }

    throw err;
  }
}

/* ── 各資源的公開 API ── */

const api = {
  /** 球員名單與出席紀錄 */
  getRoster() {
    return apiFetch('roster');
  },

  /** 賽程 */
  getSchedule() {
    return apiFetch('schedule');
  },

  /** 數據統計 */
  getStats() {
    return apiFetch('stats');
  },

  /** 戰績榜 */
  getStandings() {
    return apiFetch('standings');
  },

  /** 積分龍虎榜 */
  getDragon() {
    return apiFetch('dragon');
  },

  /** 輪值排班 */
  getRotation() {
    return apiFetch('rotation');
  },

  /** 名人堂 */
  getHof() {
    return apiFetch('hof');
  },

  /** 首頁摘要資料 */
  getHome() {
    return apiFetch('home');
  },
};
