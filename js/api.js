/* ══════════════════════════════════════
   大安ㄍㄤㄍㄤ好籃球聯盟 — API 抽象層
   ══════════════════════════════════════
   所有資料存取統一透過此模組。
   未來後端 API 就緒時，只需修改 API_BASE 與路徑對應。
   ══════════════════════════════════════ */

const ApiConfig = {
  /** 基礎路徑（未來切換為後端 API 時改這裡） */
  BASE_URL: './data',

  /** 各端點對應的路徑（靜態 JSON 時期） */
  endpoints: {
    roster:    'roster.json',
    schedule:  'schedule.json',
    stats:     'stats.json',
    standings: 'standings.json',
    dragon:    'dragon.json',
    rotation:  'rotation.json',
    hof:       'hof.json',
    home:      'home.json',
  },

  /** 預設 fetch 選項（未來可加 headers / auth token） */
  defaultOptions: {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  },

  /** 請求超時時間（ms） */
  timeout: 10000,
};

/* ── 是否為本地開發模式（file:// 協定） ── */
const IS_LOCAL_FILE = window.location.protocol === 'file:';

/* ── 核心 fetch 封裝 ── */

/**
 * 通用 JSON fetch，帶超時與錯誤處理
 * 本地 file:// 模式下會自動使用 MOCK_DATA（需載入 mock-data.js）
 * @param {string} endpoint - ApiConfig.endpoints 中的 key
 * @param {object} [options] - 額外的 fetch options
 * @returns {Promise<any>} parsed JSON
 */
async function apiFetch(endpoint, options) {
  const path = ApiConfig.endpoints[endpoint];
  if (!path) throw new Error(`[api] 未知的 endpoint: ${endpoint}`);

  /* ── file:// 模式：回傳內嵌假資料 ── */
  if (IS_LOCAL_FILE) {
    if (typeof MOCK_DATA !== 'undefined' && MOCK_DATA[endpoint]) {
      console.info(`[mock] 使用本地假資料: ${endpoint}`);
      // 回傳深拷貝，避免頁面邏輯意外修改到原始 mock 資料
      return JSON.parse(JSON.stringify(MOCK_DATA[endpoint]));
    }
    console.warn(`[mock] 找不到 ${endpoint} 的假資料，嘗試 fetch...`);
  }

  const url = `${ApiConfig.BASE_URL}/${path}`;
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
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`[api] 請求超時: ${url}`);
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
