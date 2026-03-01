/* ══════════════════════════════════════
   大安ㄍㄤㄍㄤ好籃球聯盟 — API 抽象層
   ══════════════════════════════════════
   資料來源優先級：
   1. file:// 協定 → MOCK_DATA（本地開發）
   2. Google Sheets API → 直接讀取 Google Sheets 即時資料
   3. 靜態 JSON → ./data/ 目錄（Sheets 不可用時 fallback）
   ══════════════════════════════════════ */

const ApiConfig = {
  /* ── Google Sheets API 直接存取 ── */
  SHEET_ID: '15GWnfG8yWa7DbPkLY8N3HSs7kBFHCa_l2oYx9Ye8H5c',
  API_KEY: 'AIzaSyC5F-TCj4KzsifU3PoNUl5HPvFvRv7TST4',

  /** Sheets 資料範圍（對應 APIMgr.ts 的 getURL 呼叫） */
  sheetsRanges: {
    home:         'datas!D2:M7',
    dragon:       'datas!D13:L76',
    standings:    'datas!P2:T7',
    roster:       'datas!O19:AH83',
    dates:        'datas!P13:AG13',
    allSchedule:  'datas!D87:N113',
    allRotation:  'datas!Q88:AC177',
    allMatchups:  'datas!D117:F206',
    boxscore:     'boxscore!A1:AO1980',
    leadersTable: 'datas!D212:N224',
    teamOffense:  'datas!D227:K234',
    teamDefense:  'datas!D237:K244',
    teamNet:      'datas!D247:K254',
  },

  /**
   * GAS Web App URL（備用，目前未使用）
   * 設為空字串 '' 則不啟用 GAS 模式
   */
  GAS_URL: '',

  /** 靜態 JSON fallback 路徑 */
  STATIC_URL: './data',

  /** 各端點設定 — sheets: true 表示優先從 Google Sheets 取得 */
  endpoints: {
    roster:    { file: 'roster.json',    sheets: true  },
    schedule:  { file: 'schedule.json',  sheets: true  },
    stats:     { file: 'stats.json',     sheets: false },
    standings: { file: 'standings.json', sheets: true  },
    dragon:    { file: 'dragon.json',    sheets: true  },
    rotation:  { file: 'rotation.json',  sheets: false },
    hof:       { file: 'hof.json',       sheets: false },
    leaders:   { file: 'leaders.json',   sheets: true  },
    home:      { file: 'home.json',      sheets: true  },
    boxscore:  { file: 'boxscore.json',  sheets: true  },
  },

  /** 當前賽季屆數 */
  currentSeason: 25,

  /** 請求超時（ms） */
  timeout: 15000,

  /** Sheets 快取 TTL（ms） — 5 分鐘 */
  cacheTTL: 5 * 60 * 1000,
};

/* ═══════════════════════════════════════
   模式判斷
   ═══════════════════════════════════════ */
const IS_LOCAL_FILE = window.location.protocol === 'file:';
const USE_SHEETS = !IS_LOCAL_FILE && ApiConfig.SHEET_ID !== '' && ApiConfig.API_KEY !== '';
const USE_GAS = !IS_LOCAL_FILE && !USE_SHEETS && ApiConfig.GAS_URL !== '';

/* ═══════════════════════════════════════
   快取
   ═══════════════════════════════════════ */
const _sheetsCache = {};

function getCached(key) {
  const entry = _sheetsCache[key];
  if (entry && Date.now() - entry.ts < ApiConfig.cacheTTL) return entry.data;
  return null;
}

function setCache(key, data) {
  _sheetsCache[key] = { data: JSON.parse(JSON.stringify(data)), ts: Date.now() };
}

/* ═══════════════════════════════════════
   Google Sheets API 工具
   ═══════════════════════════════════════ */

/** 建構單一範圍 URL */
function sheetsUrl(range) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${ApiConfig.SHEET_ID}/values/${encodeURIComponent(range)}?key=${ApiConfig.API_KEY}`;
}

/** 建構批次範圍 URL */
function sheetsBatchUrl(ranges) {
  const params = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
  return `https://sheets.googleapis.com/v4/spreadsheets/${ApiConfig.SHEET_ID}/values:batchGet?${params}&key=${ApiConfig.API_KEY}`;
}

/** 抓取單一 Sheets 範圍，回傳 2D 陣列 */
async function fetchSheetsRange(range) {
  const cached = getCached('range:' + range);
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ApiConfig.timeout);
  try {
    const res = await fetch(sheetsUrl(range), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Sheets HTTP ${res.status}`);
    const json = await res.json();
    const values = json.values || [];
    setCache('range:' + range, values);
    return values;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error(`[sheets] 請求超時: ${range}`);
    throw err;
  }
}

/** 批次抓取多個 Sheets 範圍，回傳 { rangeName: 2D陣列 } */
async function fetchSheetsBatch(rangeNames) {
  // 檢查快取，只抓未快取的
  const result = {};
  const uncached = [];
  rangeNames.forEach(name => {
    const range = ApiConfig.sheetsRanges[name];
    const cached = getCached('range:' + range);
    if (cached) {
      result[name] = cached;
    } else {
      uncached.push(name);
    }
  });

  if (uncached.length === 0) return result;

  const ranges = uncached.map(name => ApiConfig.sheetsRanges[name]);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ApiConfig.timeout);
  try {
    const res = await fetch(sheetsBatchUrl(ranges), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Sheets Batch HTTP ${res.status}`);
    const json = await res.json();
    (json.valueRanges || []).forEach((vr, i) => {
      const name = uncached[i];
      const values = vr.values || [];
      result[name] = values;
      setCache('range:' + ApiConfig.sheetsRanges[name], values);
    });
    return result;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('[sheets] 批次請求超時');
    throw err;
  }
}

/* ═══════════════════════════════════════
   靜態 JSON / MOCK 抓取（fallback）
   ═══════════════════════════════════════ */

async function fetchStatic(endpoint) {
  const ep = ApiConfig.endpoints[endpoint];
  if (!ep) throw new Error(`[api] 未知的 endpoint: ${endpoint}`);

  /* file:// 模式：回傳內嵌假資料 */
  if (IS_LOCAL_FILE) {
    if (typeof MOCK_DATA !== 'undefined' && MOCK_DATA[endpoint]) {
      console.info(`[mock] 使用本地假資料: ${endpoint}`);
      return JSON.parse(JSON.stringify(MOCK_DATA[endpoint]));
    }
    console.warn(`[mock] 找不到 ${endpoint} 的假資料，嘗試 fetch...`);
  }

  const url = USE_GAS
    ? `${ApiConfig.GAS_URL}?type=${ep.type || endpoint}`
    : `${ApiConfig.STATIC_URL}/${ep.file}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ApiConfig.timeout);

  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch (_) { throw new Error(`[api] 回應不是有效的 JSON (${endpoint})`); }
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error(`[api] 請求超時: ${url}`);
    /* GAS 失敗時回退至靜態 JSON */
    if (USE_GAS) {
      console.warn(`[api] GAS 請求失敗 (${endpoint})，回退至靜態 JSON:`, err.message);
      try {
        const fbRes = await fetch(`${ApiConfig.STATIC_URL}/${ep.file}`);
        if (fbRes.ok) return await fbRes.json();
      } catch (_) { /* fallback 也失敗 */ }
    }
    throw err;
  }
}

/* ═══════════════════════════════════════
   TRANSFORMER — Google Sheets → 前端 JSON
   ═══════════════════════════════════════ */

/** 解析 "姓名(隊色)" 或 "姓名(隊色" → { name, team } */
function parseSheetsName(raw) {
  if (!raw) return { name: '', team: '' };
  const m = raw.match(/^(.+)\(([^()]+)\)?$/);
  if (!m) return { name: raw, team: '' };
  return { name: m[1], team: m[2] };
}

/** 從 homeRows 第一欄提取 meta 資訊 */
function extractMeta(homeRows) {
  return {
    season: ApiConfig.currentSeason,
    phase: (homeRows[0] && homeRows[0][0]) || '例行賽',
    week: parseInt((homeRows[1] && homeRows[1][0]) || '0') || 0,
    date: (homeRows[3] && homeRows[3][0]) || '',
    venue: (homeRows[5] && homeRows[5][0]) || '',
  };
}

/** 從 streak 文字解析 streakType */
function parseStreakType(streak) {
  if (!streak) return 'lose';
  return streak.includes('勝') ? 'win' : 'lose';
}

/* ── 從賽程資料計算對戰結果 ── */
/**
 * 從 allWeeks 中提取所有已完成的對戰結果
 * @param {Array} allWeeks - schedule.allWeeks
 * @param {string|null} phaseFilter - 僅計算特定賽制（如 '例行賽'），null 表示全部
 * @returns {{ history: {teamName: [{result:'W'|'L', opponent:string, week:number}]}, h2h: {team1_team2: {team1Wins, team2Wins}} }}
 */
function computeResultsFromSchedule(allWeeks, phaseFilter) {
  const history = {};  // team → [{result, opponent, week}]
  const h2h = {};      // "A_B" (sorted) → { A: wins, B: wins }

  if (!allWeeks) return { history, h2h };

  for (const entry of allWeeks) {
    if (entry.type !== 'game') continue;
    if (phaseFilter && entry.phase !== phaseFilter) continue;
    if (!entry.matchups) continue;

    for (const m of entry.matchups) {
      if (m.status !== 'finished' || !m.home || !m.away) continue;
      const homeWon = m.homeScore > m.awayScore;

      // Record history
      if (!history[m.home]) history[m.home] = [];
      if (!history[m.away]) history[m.away] = [];
      history[m.home].push({ result: homeWon ? 'W' : 'L', opponent: m.away, week: entry.week });
      history[m.away].push({ result: homeWon ? 'L' : 'W', opponent: m.home, week: entry.week });

      // Record head-to-head
      const key = [m.home, m.away].sort().join('_');
      if (!h2h[key]) h2h[key] = {};
      const winner = homeWon ? m.home : m.away;
      h2h[key][winner] = (h2h[key][winner] || 0) + 1;
    }
  }

  return { history, h2h };
}

/** Build head-to-head matrix from h2h data */
function buildH2HMatrix(teamNames, h2h) {
  return teamNames.map(t1 => {
    return teamNames.map(t2 => {
      if (t1 === t2) return null;
      const key = [t1, t2].sort().join('_');
      const data = h2h[key];
      if (!data) return null;
      const t1Wins = data[t1] || 0;
      const t2Wins = data[t2] || 0;
      const diff = t1Wins - t2Wins;
      return diff;
    });
  });
}

/** Build history array (W/L) for a team, ordered by week */
function buildTeamHistory(teamResults) {
  if (!teamResults || !teamResults.length) return [];
  // Sort by week, then by order within the week
  const sorted = [...teamResults].sort((a, b) => a.week - b.week);
  return sorted.map(r => r.result);
}

/* ── 轉換：戰績榜 ── */
function transformStandings(standingsRows, meta, allWeeks) {
  const teams = standingsRows.map(row => ({
    team: row[0],
    name: row[0] + '隊',
    wins: parseInt(row[1]) || 0,
    losses: parseInt(row[2]) || 0,
    pct: row[3] || '0%',
    streak: row[4] || '',
    streakType: parseStreakType(row[4]),
    history: [],
  }));

  // 排序：勝場多→前，同勝場比勝率
  teams.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return parseFloat(b.pct) - parseFloat(a.pct);
  });
  teams.forEach((t, i) => t.rank = i + 1);

  // 從賽程資料計算對戰矩陣（僅例行賽）和歷史
  const teamNames = teams.map(t => t.team);
  let matrixResults;
  if (allWeeks && allWeeks.length) {
    const { history, h2h } = computeResultsFromSchedule(allWeeks, '例行賽');
    matrixResults = buildH2HMatrix(teamNames, h2h);
    // Fill in history for each team
    teams.forEach(t => {
      t.history = buildTeamHistory(history[t.team]);
    });
  } else {
    matrixResults = teamNames.map(() => teamNames.map(() => null));
  }

  return {
    season: meta.season,
    phase: meta.phase,
    currentWeek: meta.week,
    teams,
    matrix: { teams: teamNames, results: matrixResults },
  };
}

/* ── 轉換：龍虎榜 ── */
function transformDragon(dragonRows) {
  const players = dragonRows.map(row => {
    const { name, team } = parseSheetsName(row[1]);
    const att = parseInt(row[3]) || 0;
    const duty = parseInt(row[4]) || 0;
    const totalFloat = parseFloat(row[2]) || 0;
    const intTotal = Math.floor(totalFloat);
    const mop = Math.max(0, intTotal - att - duty);

    return {
      rank: parseInt(row[0]) || 0,
      name,
      team,
      tag: null,
      att,
      duty,
      mop,
      playoff: null,
      total: intTotal,
    };
  });

  return {
    season: ApiConfig.currentSeason,
    phase: '賽季進行中',
    civilianThreshold: 36,
    columns: ['出席', '輪值', '拖地', '季後賽'],
    players,
    rulesLink: 'https://ink-ulna-616.notion.site/1d4a155d96b6809fa811fbbe61f317dd?source=copy_link',
  };
}

/* ── 轉換：出席名單 ── */
function transformRoster(presentRows, dateRows) {
  const dates = (dateRows && dateRows[0]) ? dateRows[0] : [];

  // 建立 weeks 陣列
  const weeks = dates.map((d, i) => ({
    wk: i + 1,
    label: `第${i + 1}週`,
    date: d,
  }));

  // 依隊伍分組
  const teamOrder = ['紅', '黑', '藍', '綠', '黃', '白'];
  const teamMap = {};
  teamOrder.forEach(t => {
    const cfg = TEAM_CONFIG[t] || {};
    teamMap[t] = {
      id: cfg.id || t,
      name: t + '隊',
      players: [],
    };
  });

  presentRows.forEach(row => {
    if (!row[0]) return;
    const { name, team } = parseSheetsName(row[0]);
    if (!teamMap[team]) return;

    // 倒數第一欄是百分比（如 "33%"），其餘是出席資料
    const att = [];
    for (let i = 1; i <= dates.length; i++) {
      const val = (i < row.length) ? row[i] : '';
      if (val === '1' || val === 1) att.push(1);
      else if (val === '0' || val === 0) att.push(0);
      else if (val === 'x' || val === 'X') att.push('x');
      else att.push('?');
    }

    teamMap[team].players.push({ name, att });
  });

  const teams = teamOrder
    .map(t => teamMap[t])
    .filter(t => t.players.length > 0);

  return { weeks, teams };
}

/* ── 解析對戰組合儲存格 ── */
/** 解析 "白vs紅\n22 : 34" → matchup 物件 */
function parseMatchupCell(cell, combo) {
  if (!cell || cell.trim() === '' || cell.trim() === 'vs') {
    return { combo, home: '', away: '', homeScore: null, awayScore: null, status: 'upcoming' };
  }

  const lines = cell.split('\n');
  const teamsPart = (lines[0] || '').trim();
  const scorePart = (lines[1] || '').trim();

  // 解析隊伍："白vs紅" 或 "vs"
  const vsIdx = teamsPart.indexOf('vs');
  const home = vsIdx > 0 ? teamsPart.substring(0, vsIdx).trim() : '';
  const away = vsIdx >= 0 ? teamsPart.substring(vsIdx + 2).trim() : '';

  // 解析分數："22 : 34" 或 ""
  let homeScore = null, awayScore = null, status = 'upcoming';
  if (scorePart && scorePart.includes(':')) {
    const parts = scorePart.split(':');
    const hs = parseInt(parts[0].trim());
    const as = parseInt(parts[1].trim());
    if (!isNaN(hs) && !isNaN(as)) {
      homeScore = hs;
      awayScore = as;
      status = 'finished';
    }
  }

  return { combo, home, away, homeScore, awayScore, status };
}

/* ── 解析輪值人員列 ── */

/** Q~AC 13 欄輪值角色定義 */
const ROTATION_ROLES = [
  { label: '裁判', start: 0, count: 3 },
  { label: '場務', start: 3, count: 3 },
  { label: '攝影', start: 6, count: 1 },
  { label: '器材', start: 7, count: 2 },
  { label: '數據', start: 9, count: 1 },
  { label: '其他', start: 10, count: 3 },
];

/** 解析 Q~AC 一列 → staff 物件 { 裁判:[], 場務:[], ... } */
function parseRotationRow(row) {
  if (!row || !row.length) return {};

  const fmt = (idx) => {
    const val = row[idx];
    if (!val || !val.trim()) return null;
    const p = parseSheetsName(val);
    return p.name ? `${p.name}(${p.team})` : null;
  };

  const staff = {};
  ROTATION_ROLES.forEach(({ label, start, count }) => {
    const arr = [];
    for (let i = start; i < start + count; i++) {
      const v = fmt(i);
      if (v) arr.push(v);
    }
    if (arr.length) staff[label] = arr;
  });

  return staff;
}

/* ── 解析對戰組合 lookup（D117:F206）── */
function parseComboLookup(comboRows) {
  const lookup = {};
  if (!comboRows || !comboRows.length) return lookup;
  for (let i = 0; i < comboRows.length; i += 6) {
    const weekNum = Math.floor(i / 6) + 1;
    lookup[weekNum] = [];
    for (let j = 0; j < 6 && (i + j) < comboRows.length; j++) {
      const cr = comboRows[i + j];
      lookup[weekNum].push({
        combo: j + 1,
        home: (cr[0] || '').trim(),
        away: (cr[2] || '').trim(),
        homeScore: null,
        awayScore: null,
        status: 'upcoming',
      });
    }
  }
  return lookup;
}

/* ── 轉換：完整賽程（所有週次） ── */
function transformAllSchedule(schedRows, rotationRows, comboRows) {
  const allWeeks = [];
  let gameWeekCount = 0;
  const comboLookup = parseComboLookup(comboRows);

  // 跳過第 0 列（標題）和第 1 列（哨兵：周次=0, 1980/1/1）
  for (let i = 2; i < schedRows.length; i++) {
    const row = schedRows[i];
    const weekNum = row[0] ? parseInt(row[0]) : 0;
    const date    = row[1] || '';
    const status  = row[2] || '';
    const venue   = row[3] || '';
    const note    = row[10] || '';

    // 無周次且無狀態 → 佔位列，跳過
    if (!weekNum && !status) continue;

    if (status === '停賽') {
      allWeeks.push({ type: 'suspended', date, venue, reason: note });
      continue;
    }

    if (!weekNum) continue; // 安全檢查

    // 比賽週：解析 6 個對戰組合（來自 allSchedule H~M 欄）
    const originalMatchups = [];
    for (let m = 0; m < 6; m++) {
      originalMatchups.push(parseMatchupCell(row[4 + m] || '', m + 1));
    }

    // 若原始對戰組合無隊伍資料（upcoming），改用 D117:F206 combo lookup
    const hasOriginalTeams = originalMatchups.some(m => m.home && m.away);
    const matchups = (!hasOriginalTeams && comboLookup[weekNum])
      ? comboLookup[weekNum]
      : originalMatchups;

    // 賽程順序：始終使用原始資料（順序未排定時隊伍為空）
    const rotStart = gameWeekCount * 6;
    const games = [];
    for (let g = 0; g < 6; g++) {
      const rotRow = (rotStart + g < rotationRows.length) ? rotationRows[rotStart + g] : [];
      games.push({
        num: g + 1,
        time: '',
        home: originalMatchups[g].home,
        away: originalMatchups[g].away,
        homeScore: originalMatchups[g].homeScore,
        awayScore: originalMatchups[g].awayScore,
        status: originalMatchups[g].status,
        staff: parseRotationRow(rotRow),
      });
    }

    allWeeks.push({
      type: 'game',
      week: weekNum,
      date,
      phase: status,
      venue,
      matchups,
      games,
    });

    gameWeekCount++;
  }

  // 找出最新已完成的比賽週作為 currentWeek
  let currentWeek = 1;
  for (const entry of allWeeks) {
    if (entry.type === 'game' && entry.matchups.some(m => m.status === 'finished')) {
      currentWeek = entry.week;
    }
  }

  // 建立 weeks 物件（向後相容）
  const weeks = {};
  allWeeks.filter(e => e.type === 'game').forEach(e => {
    weeks[String(e.week)] = e;
  });

  return { season: ApiConfig.currentSeason, currentWeek, allWeeks, weeks };
}

/* ── 轉換：賽程（舊版，供 home 使用） ── */
function transformSchedule(homeRows) {
  const meta = extractMeta(homeRows);
  const matchups = [];
  const games = [];

  for (let i = 0; i < 6 && i < homeRows.length; i++) {
    const row = homeRows[i];
    const home = row[1] || '';
    const away = row[2] || '';

    matchups.push({ combo: i + 1, home, away });

    // 工作人員：3 裁判 + 3 場務 + 1 其他（依 column 順序）
    const rawStaff = row.slice(3).filter(s => s);
    const staffObj = {};
    if (rawStaff.length >= 3) {
      staffObj['裁判'] = rawStaff.slice(0, 3).map(s => {
        const p = parseSheetsName(s);
        return `${p.name}(${p.team})`;
      });
    }
    if (rawStaff.length >= 6) {
      staffObj['場務'] = rawStaff.slice(3, 6).map(s => {
        const p = parseSheetsName(s);
        return `${p.name}(${p.team})`;
      });
    }
    if (rawStaff.length >= 7) {
      const p = parseSheetsName(rawStaff[6]);
      staffObj['其他'] = [`${p.name}(${p.team})`];
    }

    games.push({
      num: i + 1,
      time: '',
      home,
      away,
      homeScore: null,
      awayScore: null,
      status: 'upcoming',
      staff: staffObj,
    });
  }

  return {
    season: meta.season,
    phase: meta.phase,
    currentWeek: meta.week,
    totalWeeks: 10,
    weeks: {
      [String(meta.week)]: {
        date: meta.date,
        time: '',
        venue: meta.venue,
        matchups,
        games,
      },
    },
  };
}

/* ── 轉換：首頁 ── */
function transformHome(homeRows, standingsRows, dragonRows, allWeeks) {
  const meta = extractMeta(homeRows);

  // 戰績區塊（帶歷史資料）
  const standingsData = transformStandings(standingsRows, meta, allWeeks);
  const standings = standingsData.teams.map(t => ({
    rank: t.rank,
    name: t.name,
    team: t.team,
    record: `${t.wins}勝 ${t.losses}敗`,
    pct: t.pct,
    history: t.history || [],
    streak: t.streak,
    streakType: t.streakType,
  }));

  // 龍虎榜 TOP 10
  const dragonData = transformDragon(dragonRows);
  const dragonTop10 = dragonData.players.slice(0, 10);

  return {
    season: meta.season,
    currentWeek: meta.week,
    phase: meta.phase,
    scheduleInfo: {
      date: meta.date,
      venue: meta.venue,
    },
    standings,
    dragonTop10,
    miniStats: null, // Sheets 無數據統計資料
  };
}

/* ── 轉換：領先榜 ── */
function transformLeaders(tableRows, offRows, defRows, netRows) {
  const parseSection = (rows) => {
    if (!rows || !rows.length) return { headers: [], rows: [] };
    const nonEmpty = rows.filter(r => r && r.some(c => c && String(c).trim()));
    if (!nonEmpty.length) return { headers: [], rows: [] };
    const headers = (nonEmpty[0] || []).map(h => String(h || '').trim());
    const data = nonEmpty.slice(1).map(r => r.map(c => String(c || '').trim()));
    return { headers, rows: data };
  };
  return {
    leaders: parseSection(tableRows),
    offense: parseSection(offRows),
    defense: parseSection(defRows),
    net:     parseSection(netRows),
  };
}

/* ── 轉換：對戰數據（boxscore） ── */

/**
 * Boxscore Sheets 結構常數
 * 每場比賽佔 BLOCK_SIZE 列，主客隊資料並排
 */
const BS_BLOCK_SIZE = 22;
const BS_PLAYER_START = 4;    // 球員資料起始列 (block offset)
const BS_PLAYER_END = 20;     // 球員資料結束列 (block offset)
const BS_TOTALS_ROW = 21;     // 合計列 (block offset)

/** 主隊欄位偏移 */
const BS_HOME = {
  NAME: 0, FG2MISS: 1, FG2MADE: 2, FG3MISS: 4, FG3MADE: 5,
  FTMISS: 7, FTMADE: 8, PTS: 10, OREB: 11, DREB: 12,
  AST: 14, BLK: 15, STL: 16, TOV: 17, PF: 18, PLAYED: 19,
};

/** 客隊欄位偏移 */
const BS_AWAY = {
  NAME: 21, FG2MISS: 22, FG2MADE: 23, FG3MISS: 25, FG3MADE: 26,
  FTMISS: 28, FTMADE: 29, PTS: 31, OREB: 32, DREB: 33,
  AST: 35, BLK: 36, STL: 37, TOV: 38, PF: 39, PLAYED: 40,
};

/** 安全數字解析 */
function bsNum(v) {
  if (!v || v === '#N/A') return 0;
  const n = parseInt(v);
  return isNaN(n) ? 0 : n;
}

/** 安全字串解析 */
function bsStr(v) {
  return (!v || v === '#N/A') ? '' : String(v).trim();
}

/** 從一列中依欄位定義提取數據 */
function parseStatCols(row, cols) {
  const stats = {
    fg2miss: bsNum(row[cols.FG2MISS]), fg2made: bsNum(row[cols.FG2MADE]),
    fg3miss: bsNum(row[cols.FG3MISS]), fg3made: bsNum(row[cols.FG3MADE]),
    ftmiss:  bsNum(row[cols.FTMISS]),  ftmade:  bsNum(row[cols.FTMADE]),
    pts: bsNum(row[cols.PTS]),   oreb: bsNum(row[cols.OREB]),  dreb: bsNum(row[cols.DREB]),
    ast: bsNum(row[cols.AST]),   blk:  bsNum(row[cols.BLK]),   stl:  bsNum(row[cols.STL]),
    tov: bsNum(row[cols.TOV]),   pf:   bsNum(row[cols.PF]),
  };
  stats.treb = stats.oreb + stats.dreb;
  return stats;
}

/** 解析單場比賽的 22 列資料 */
function parseGameBlock(block) {
  const m1 = block[0] || [];
  const m2 = block[1] || [];

  const weekNum  = bsNum(m1[1]);   // col B
  const gameNum  = bsNum(m1[5]);   // col F
  const phase    = bsStr(m1[9]);   // col J
  const homeTeam = bsStr(m1[18]);  // col S
  const awayTeam = bsStr(m1[21]);  // col V

  const countsForStats = weekNum > 0 && gameNum > 0;
  if (!weekNum) return null;

  const recorder  = bsStr(m2[14]);
  const homeScore = parseInt(m2[18]) || null;
  const awayScore = parseInt(m2[21]) || null;
  const hasScores = homeScore !== null && awayScore !== null;

  // 合計列
  const totRow  = block[BS_TOTALS_ROW] || [];
  const homeTot = parseStatCols(totRow, BS_HOME);
  const awayTot = parseStatCols(totRow, BS_AWAY);

  // 球員列
  const homePlayers = [];
  const awayPlayers = [];

  for (let r = BS_PLAYER_START; r <= BS_PLAYER_END; r++) {
    const row = block[r] || [];

    const homeRaw = bsStr(row[BS_HOME.NAME]);
    if (homeRaw) {
      const { name, team } = parseSheetsName(homeRaw + ')');
      const played = !!bsStr(row[BS_HOME.PLAYED]);
      const stats = parseStatCols(row, BS_HOME);
      homePlayers.push({ name, team, played: countsForStats && played, ...stats });
    }

    const awayRaw = bsStr(row[BS_AWAY.NAME]);
    if (awayRaw) {
      const { name, team } = parseSheetsName(awayRaw + ')');
      const played = !!bsStr(row[BS_AWAY.PLAYED]);
      const stats = parseStatCols(row, BS_AWAY);
      awayPlayers.push({ name, team, played: countsForStats && played, ...stats });
    }
  }

  return {
    weekNum, gameNum, phase, homeTeam, awayTeam,
    homeScore, awayScore, recorder, hasScores, countsForStats,
    homePlayers, awayPlayers, homeTot, awayTot,
  };
}

/** 將解析後的比賽依 (phase, weekNum) 分組並排序 */
function groupGamesByWeek(games) {
  const PHASE_ORDER = { '熱身賽': 0, '例行賽': 1, '季後賽': 2 };
  const groupMap = {};
  games.forEach(g => {
    const key = `${g.phase}_${g.weekNum}`;
    if (!groupMap[key]) {
      groupMap[key] = { phase: g.phase, weekNum: g.weekNum, games: [] };
    }
    groupMap[key].games.push(g);
  });

  return Object.values(groupMap).sort((a, b) => {
    const po = (PHASE_ORDER[a.phase] ?? 9) - (PHASE_ORDER[b.phase] ?? 9);
    return po !== 0 ? po : a.weekNum - b.weekNum;
  });
}

function transformBoxscore(rows) {
  const games = [];

  for (let i = 0; i + BS_BLOCK_SIZE <= rows.length; i += BS_BLOCK_SIZE) {
    const game = parseGameBlock(rows.slice(i, i + BS_BLOCK_SIZE));
    if (game) games.push(game);
  }

  const weeks = groupGamesByWeek(games);

  // 預設顯示最新有比分資料的週次
  let defaultIdx = weeks.length - 1;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].games.some(g => g.hasScores)) { defaultIdx = i; break; }
  }

  return { weeks, defaultIdx, season: ApiConfig.currentSeason };
}

/* ═══════════════════════════════════════
   公開 API
   ═══════════════════════════════════════ */

const api = {
  /** 戰績榜 */
  async getStandings() {
    if (!USE_SHEETS) {
      // For mock/static data, also compute matrix from schedule
      const data = await fetchStatic('standings');
      try {
        const schedData = await fetchStatic('schedule');
        if (schedData && schedData.allWeeks) {
          const { history, h2h } = computeResultsFromSchedule(schedData.allWeeks, '例行賽');
          data.matrix.results = buildH2HMatrix(data.matrix.teams, h2h);
          data.teams.forEach(t => {
            t.history = buildTeamHistory(history[t.team]);
          });
        }
      } catch (_) { /* schedule unavailable, keep existing data */ }
      return data;
    }
    const cached = getCached('ep:standings');
    if (cached) return cached;

    try {
      const batch = await fetchSheetsBatch(['home', 'standings', 'allSchedule', 'allRotation', 'allMatchups']);
      const meta = extractMeta(batch.home);
      const schedData = transformAllSchedule(batch.allSchedule, batch.allRotation || [], batch.allMatchups || []);
      const data = transformStandings(batch.standings, meta, schedData.allWeeks);
      setCache('ep:standings', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得戰績失敗，回退靜態 JSON:', err.message);
      return fetchStatic('standings');
    }
  },

  /** 積分龍虎榜 */
  async getDragon() {
    if (!USE_SHEETS) return fetchStatic('dragon');
    const cached = getCached('ep:dragon');
    if (cached) return cached;

    try {
      const rows = await fetchSheetsRange(ApiConfig.sheetsRanges.dragon);
      const data = transformDragon(rows);
      setCache('ep:dragon', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得龍虎榜失敗，回退靜態 JSON:', err.message);
      return fetchStatic('dragon');
    }
  },

  /** 球員名單（出席紀錄） */
  async getRoster() {
    if (!USE_SHEETS) return fetchStatic('roster');
    const cached = getCached('ep:roster');
    if (cached) return cached;

    try {
      const batch = await fetchSheetsBatch(['roster', 'dates']);
      const data = transformRoster(batch.roster, batch.dates);
      setCache('ep:roster', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得名單失敗，回退靜態 JSON:', err.message);
      return fetchStatic('roster');
    }
  },

  /** 賽程（全季） */
  async getSchedule() {
    if (!USE_SHEETS) return fetchStatic('schedule');
    const cached = getCached('ep:schedule');
    if (cached) return cached;

    try {
      const batch = await fetchSheetsBatch(['allSchedule', 'allRotation', 'allMatchups']);
      const data = transformAllSchedule(batch.allSchedule, batch.allRotation, batch.allMatchups || []);
      setCache('ep:schedule', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得賽程失敗，回退靜態 JSON:', err.message);
      return fetchStatic('schedule');
    }
  },

  /** 首頁摘要 */
  async getHome() {
    if (!USE_SHEETS) {
      const data = await fetchStatic('home');
      // Compute history from schedule data
      try {
        const schedData = await fetchStatic('schedule');
        if (schedData && schedData.allWeeks) {
          const { history } = computeResultsFromSchedule(schedData.allWeeks, null);
          data.standings.forEach(t => {
            t.history = buildTeamHistory(history[t.team]);
          });
        }
      } catch (_) { /* schedule unavailable */ }
      return data;
    }
    const cached = getCached('ep:home');
    if (cached) return cached;

    try {
      const batch = await fetchSheetsBatch(['home', 'standings', 'dragon', 'allSchedule', 'allMatchups']);
      const schedData = transformAllSchedule(batch.allSchedule, [], batch.allMatchups || []);
      const data = transformHome(batch.home, batch.standings, batch.dragon, schedData.allWeeks);
      setCache('ep:home', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得首頁資料失敗，回退靜態 JSON:', err.message);
      return fetchStatic('home');
    }
  },

  /** 對戰數據（boxscore） */
  async getBoxscore() {
    if (!USE_SHEETS) return fetchStatic('boxscore');
    const cached = getCached('ep:boxscore');
    if (cached) return cached;
    try {
      const rows = await fetchSheetsRange(ApiConfig.sheetsRanges.boxscore);
      const data = transformBoxscore(rows);
      setCache('ep:boxscore', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得 boxscore 失敗，回退靜態 JSON:', err.message);
      return fetchStatic('boxscore');
    }
  },

  /** 領先榜 */
  async getLeaders() {
    if (!USE_SHEETS) return fetchStatic('leaders');
    const cached = getCached('ep:leaders');
    if (cached) return cached;
    try {
      const [tableRows, offRows, defRows, netRows] = await Promise.all([
        fetchSheetsRange(ApiConfig.sheetsRanges.leadersTable),
        fetchSheetsRange(ApiConfig.sheetsRanges.teamOffense),
        fetchSheetsRange(ApiConfig.sheetsRanges.teamDefense),
        fetchSheetsRange(ApiConfig.sheetsRanges.teamNet),
      ]);
      const data = transformLeaders(tableRows, offRows, defRows, netRows);
      setCache('ep:leaders', data);
      return data;
    } catch (err) {
      console.warn('[api] Sheets 取得領先榜失敗，回退靜態 JSON:', err.message);
      return fetchStatic('leaders');
    }
  },

  /** 數據統計（靜態 JSON） */
  getStats() { return fetchStatic('stats'); },

  /** 輪值排班（靜態 JSON） */
  getRotation() { return fetchStatic('rotation'); },

  /** 名人堂（靜態 JSON） */
  getHof() { return fetchStatic('hof'); },
};
