/* ══════════════════════════════════════
   大安ㄍㄤㄍㄤ好籃球聯盟 — 共用 JS
   ══════════════════════════════════════ */

/* ── 隊伍色統一配置 ──
   所有頁面的隊伍色、背景色、CSS class 均從此取得，
   禁止在各頁面 JS 中自行重複定義。
   ─────────────────── */
const TEAM_CONFIG = {
  '紅': { id:'red',    cls:'c-red',    dot:'d-red',    color:'#e53935', barColor:'#e53935', textColor:'#e53935', bg:'rgba(229,57,53,.14)',  rowClass:'team-row-red' },
  '黑': { id:'black',  cls:'c-black',  dot:'d-black',  color:'#4a4a4a', barColor:'#4a4a4a', textColor:'#4a4a4a', bg:'rgba(40,40,40,.12)',   rowClass:'team-row-black' },
  '藍': { id:'blue',   cls:'c-blue',   dot:'d-blue',   color:'#1976d2', barColor:'#1976d2', textColor:'#1976d2', bg:'rgba(25,118,210,.12)', rowClass:'team-row-blue' },
  '綠': { id:'green',  cls:'c-green',  dot:'d-green',  color:'#2e7d32', barColor:'#2e7d32', textColor:'#2e7d32', bg:'rgba(46,125,50,.16)',  rowClass:'team-row-green' },
  '黃': { id:'yellow', cls:'c-yellow', dot:'d-yellow', color:'#b38f00', barColor:'#e6b800', textColor:'#b38f00', bg:'rgba(230,184,0,.14)',  rowClass:'team-row-yellow', nameStyle:'color:#b38f00' },
  '白': { id:'white',  cls:'c-white',  dot:'d-white',  color:'#757575', barColor:'#9e9e9e', textColor:'#757575', bg:'rgba(158,158,158,.07)',rowClass:'team-row-white',  nameStyle:'color:#757575' },
};

/* 以 id 反查的快捷 map（roster 等頁面以 id 作 key） */
const TEAM_BY_ID = {};
Object.values(TEAM_CONFIG).forEach(t => { TEAM_BY_ID[t.id] = t; });

/* ── Navigation config ── */
const NAV_ITEMS = [
  { id: 'home',     label: '首頁',       icon: '🏠', file: 'index.html' },
  { id: 'schedule', label: '賽程',       icon: '📅', file: 'schedule.html' },
  { id: 'standings',label: '戰績榜',     icon: '🏆', file: 'standings.html' },
  { id: 'boxscore', label: '數據',       icon: '📊', file: 'boxscore.html' },
  { id: 'leaders',  label: '領先榜',     icon: '🏅', file: 'leaders.html' },
  { id: 'roster',   label: '球員名單',   icon: '👥', file: 'roster.html' },
  { id: 'dragon',   label: '龍虎榜',     icon: '🐉', file: 'dragon.html' },
  // 以下功能暫不開放，待後續版本製作
  // { id: 'stats',    label: '數據',       icon: '📊', file: 'stats.html' },
  // { id: 'rotation', label: '輪值',       icon: '📋', file: 'rotation.html' },
  // { id: 'history',  label: '歷史',       icon: '📜', file: 'history.html' },
  // { id: 'hof',      label: '名人堂',     icon: '🏛', file: 'hof.html' },
  // { id: 'announce', label: '公告',       icon: '📢', file: 'announce.html' },
];

/* ── Detect current page ── */
function getCurrentPageId() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  const item = NAV_ITEMS.find(n => n.file === filename);
  return item ? item.id : 'home';
}

/* ── Build and inject navigation ── */
function initNavigation() {
  const currentId = getCurrentPageId();

  // Top nav (desktop)
  const topNav = document.getElementById('top-nav');
  if (topNav) {
    let html = '<div class="nav-logo">🏀 大安聯盟</div><ul class="nav-links">';
    NAV_ITEMS.forEach(item => {
      const cls = item.id === currentId ? ' class="active"' : '';
      html += `<li><a href="${item.file}"${cls}>${item.label}</a></li>`;
    });
    html += '</ul>';
    topNav.innerHTML = html;
  }

  // Bottom nav (mobile)
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    let html = '<div class="bottom-nav-inner">';
    NAV_ITEMS.forEach(item => {
      const cls = item.id === currentId ? ' class="active"' : '';
      html += `<a href="${item.file}"${cls} data-page="${item.id}"><span class="bn-icon">${item.icon}</span>${item.label}</a>`;
    });
    html += '</div>';
    bottomNav.innerHTML = html;

    // 捲動到目前頁面的按鈕位置，避免重置到最左方
    const activeBtn = bottomNav.querySelector('a.active');
    if (activeBtn) {
      requestAnimationFrame(() => {
        activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
      });
    }
  }
}

/* ══════════════════════════════════════
   共用：Loading / Error / Empty 狀態
   ══════════════════════════════════════ */

/**
 * 顯示載入中狀態
 * @param {HTMLElement|string} container - DOM 元素或 id
 */
function showLoading(container) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="state-msg">
      <div class="spinner"></div>
      <span>資料載入中…</span>
    </div>`;
}

/**
 * 顯示錯誤狀態（含重試按鈕）
 * @param {HTMLElement|string} container - DOM 元素或 id
 * @param {string} msg - 錯誤訊息
 * @param {Function} [retryFn] - 重試函式，若不傳則不顯示重試按鈕
 */
function showError(container, msg, retryFn) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  const hasRetry = typeof retryFn === 'function';
  el.innerHTML = `
    <div class="state-msg state-error">
      <span>⚠️ ${msg}</span>
      ${hasRetry ? '<button class="retry-btn">重試</button>' : ''}
    </div>`;
  if (hasRetry) {
    el.querySelector('.retry-btn').addEventListener('click', retryFn);
  }
}

/**
 * 顯示空資料狀態
 * @param {HTMLElement|string} container - DOM 元素或 id
 * @param {string} [msg] - 自訂訊息，預設為「目前無資料」
 */
function showEmpty(container, msg) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div class="state-msg">
      <span>📋 ${msg || '目前無資料'}</span>
    </div>`;
}

/* ══════════════════════════════════════
   共用：通用 Tab 切換
   ══════════════════════════════════════ */

/* ── 通用 Tab 切換 ──
   clickedEl : 被點擊的 tab 元素
   tabClass  : 所有 tab 共用的 CSS class（如 'stab', 'htab', 'mtab'）
   panelIds  : 所有面板的 id 陣列（如 ['s-scoring','s-rebound',...]）
   activeCls : active 狀態的 CSS class（如 'active', 'active-mtab'）
   targetId  : 要顯示的面板 id
   scope     : (optional) 搜尋 tab 的範圍容器，預設為 clickedEl 的最近 .wrap 或 .card
   ─────────────────── */
function genericTabSwitch(clickedEl, tabClass, panelIds, activeCls, targetId, scope) {
  const container = scope || clickedEl.closest('.wrap') || clickedEl.closest('.card') || document;
  container.querySelectorAll('.' + tabClass).forEach(t => t.classList.remove(activeCls));
  clickedEl.classList.add(activeCls);
  panelIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(targetId);
  if (target) target.style.display = 'block';
}

/* ── Schedule toggle (通用：首頁 & 賽程頁共用) ── */
function toggleSchedView(mode, matchupId, orderId) {
  const matchup = document.getElementById(matchupId);
  const order = document.getElementById(orderId);
  const btnM = document.getElementById('btn-matchup');
  const btnO = document.getElementById('btn-order');
  if (matchup) matchup.style.display = mode === 'matchup' ? 'block' : 'none';
  if (order) order.style.display = mode === 'order' ? 'block' : 'none';
  if (btnM) btnM.classList.toggle('active-toggle', mode === 'matchup');
  if (btnO) btnO.classList.toggle('active-toggle', mode === 'order');
}
function showSched(mode) { toggleSchedView(mode, 'sched-matchup', 'sched-order'); }

/* ── Mini stat tabs (home page) ── */
function switchMS(el, id) {
  const panelIds = ['ms-pts','ms-reb','ms-ast','ms-stl','ms-blk'];
  genericTabSwitch(el, 'mtab', panelIds, 'active-mtab', id, el.closest('.card'));
}

/* ── Schedule page: game card toggle ── */
function toggleCard(card) { card.classList.toggle('open'); }

/* ── Stats page: tab switch ── */
function switchTab(el, id) {
  const panelIds = ['s-scoring','s-rebound','s-assist','s-block','s-steal','s-eff'];
  genericTabSwitch(el, 'stab', panelIds, 'active', id);
}

/* ── HoF page: tab switch ── */
function switchHof(el, id) {
  const panelIds = ['h-avg','h-total','h-iron','h-champ'];
  genericTabSwitch(el, 'htab', panelIds, 'active', id);
}

/* ── Schedule page: matchup / order view toggle ── */
function showSchedView(mode) { toggleSchedView(mode, 'view-matchup', 'view-order'); }

/* ══════════════════════════════════════
   共用：隊伍色 HTML 輔助函式
   ══════════════════════════════════════ */

/** W/L dots 渲染（首頁 & 戰績榜共用） */
function renderHistoryDots(history) {
  if (!Array.isArray(history) || !history.length) return '';
  return history.map((h, i) => {
    const isLast = i === history.length - 1;
    const cls = h === 'W' ? 'wl-dot wl-w' : 'wl-dot wl-l';
    return `<span class="${cls}${isLast ? ' wl-latest' : ''}">${h === 'W' ? '○' : '✕'}</span>`;
  }).join('');
}

/** 取得隊伍背景色（可自訂 alpha） */
function getTeamBg(teamName, alpha) {
  const tc = TEAM_CONFIG[teamName] || {};
  if (!tc.bg) return '';
  return tc.bg.replace(/[\d.]+\)$/, `${alpha})`);
}

/** 勝率顏色 class：>=60% 綠、<30% 紅 */
function getPctClass(pctStr) {
  const val = parseFloat(pctStr);
  if (val >= 60) return 'pct-g';
  if (val < 30) return 'pct-b';
  return '';
}

function teamTdHtml(teamName) {
  const t = TEAM_CONFIG[teamName] || {};
  return `<td><span class="${t.cls || ''}">${teamName}</span></td>`;
}

function nameTdHtml(playerName, teamName) {
  const t = TEAM_CONFIG[teamName] || {};
  const style = t.nameStyle ? ` style="${t.nameStyle}"` : '';
  return `<td><span class="${t.cls || ''}"${style}>${playerName}</span></td>`;
}

function rowBgStyle(teamName) {
  const t = TEAM_CONFIG[teamName] || {};
  return t.bg ? ` style="background:${t.bg}"` : '';
}

/* ══════════════════════════════════════
   共用：Podium 渲染
   ══════════════════════════════════════ */

const MEDALS = ['🥇','🥈','🥉'];
const MEDAL_CLS = ['p1','p2','p3'];
/**
 * 渲染 podium（前三名）到指定容器
 * @param {string} containerId - podium 容器的 id
 * @param {Array} top3 - 前三名資料陣列 [{name, team, val}]
 * @param {string} unit - 單位文字（如 '場均得分'）
 */
function renderPodium(containerId, top3, unit) {
  if (!top3 || top3.length < 3) return;
  // podium 排列順序：左=2nd, 中=1st, 右=3rd
  const order = [top3[1], top3[0], top3[2]];
  const podOrder = [1, 0, 2];
  const vCls = ['s', 'g', 'b'];

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = order.map((p, i) => {
    const t = TEAM_CONFIG[p.team] || {};
    const nameStyle = t.nameStyle ? ` style="${t.nameStyle}"` : '';
    const ri = podOrder[i];
    return `<div class="pod-card ${MEDAL_CLS[ri]}">
      <span class="pod-medal">${MEDALS[ri]}</span>
      <div class="pod-name"><span class="${t.cls || ''}"${nameStyle}>${p.name}</span></div>
      <div class="pod-val ${vCls[ri]}">${p.val.toFixed(2)}</div>
      <div class="pod-unit">${unit}</div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   共用：Hero 區塊動態生成
   ══════════════════════════════════════ */

function renderHero(containerId, { title, subtitle, eyebrow, bgImage, heroClass, heroType }) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const type = heroType || 'simple';
  const cls = heroClass || '';
  const eyebrowHtml = eyebrow ? `<div class="eyebrow" style="color:var(--orange2);margin-bottom:.3rem">${eyebrow}</div>` : '';

  if (type === 'layered') {
    el.innerHTML = `
      <div class="${cls}">
        <div class="${cls}-bg" style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(15,27,45,.92) 0%,rgba(15,27,45,.7) 60%,rgba(249,162,37,.2) 100%)${bgImage ? `,url('${bgImage}') center/cover no-repeat` : ''};"></div>
        <div class="${cls}-content" style="position:relative;z-index:2;padding:2rem 2.5rem">
          ${eyebrowHtml}
          <h2>${title}</h2>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
      </div>`;
  } else {
    el.innerHTML = `
      <div class="${cls}" style="${bgImage ? `background:linear-gradient(135deg,rgba(15,27,45,.9) 0%,rgba(15,27,45,.65) 100%),url('${bgImage}') center/cover no-repeat;` : ''}">
        ${eyebrowHtml}
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>`;
  }
}

/* ══════════════════════════════════════
   共用：音效系統
   ══════════════════════════════════════ */

/* ── 按鈕點擊音效 ── */
const _btnClickAudio = new Audio('assets/btn_click.mp3');
_btnClickAudio.volume = 0.5;

function playBtnClick() {
  _btnClickAudio.currentTime = 0;
  _btnClickAudio.play().catch(() => {});
}

document.addEventListener('click', function(e) {
  const el = e.target.closest('button, .tf-chip, .toggle-btn, .active-toggle, a[data-page], .retry-btn, .bottom-nav-inner a');
  if (el) playBtnClick();
}, true);

/* ══════════════════════════════════════
   共用：事件匯流排（跨模組通訊）
   ══════════════════════════════════════ */

const AppEvents = {
  _handlers: {},
  on(event, handler) {
    (this._handlers[event] || (this._handlers[event] = [])).push(handler);
  },
  off(event, handler) {
    const arr = this._handlers[event];
    if (arr) this._handlers[event] = arr.filter(fn => fn !== handler);
  },
  emit(event, ...args) {
    (this._handlers[event] || []).forEach(fn => fn(...args));
  },
};

/* ══════════════════════════════════════
   共用：賽制相對週次計算
   ══════════════════════════════════════ */

/**
 * 計算賽制相對週次（各賽制獨立從 1 開始）
 * @param {Object} entry - { week|weekNum, phase }
 * @param {Array} allEntries - 所有週次資料
 */
function getPhaseRelativeWeekNum(entry, allEntries) {
  const entryWeek = entry.week ?? entry.weekNum;
  let minWeek = entryWeek;
  if (allEntries) {
    for (const w of allEntries) {
      if (w.type && w.type !== 'game') continue;
      if (w.phase !== entry.phase) continue;
      const wk = w.week ?? w.weekNum;
      if (wk < minWeek) minWeek = wk;
    }
  }
  return entryWeek - minWeek + 1;
}

/**
 * 取得賽制週次標籤（如 "例行賽 · 第 3 週"）
 */
function getPhaseWeekLabel(entry, allEntries) {
  if (!entry || (entry.type && entry.type !== 'game')) return '';
  const relativeWeek = getPhaseRelativeWeekNum(entry, allEntries);
  return `${entry.phase} · 第 ${relativeWeek} 週`;
}

/* ══════════════════════════════════════
   共用：隊伍辨識
   ══════════════════════════════════════ */

/**
 * 從儲存格辨識隊名（支援 "黃", "黃隊", "黃偉訓(黃)", "黃偉訓(黃隊)" 等格式）
 */
function detectTeam(cell) {
  if (!cell) return null;
  const s = String(cell).trim();
  const norm = s.replace(/隊$/, '');
  if (TEAM_CONFIG[norm]) return norm;
  const m = s.match(/\(([^)]+)\)?$/);
  if (m) {
    const raw = m[1].trim();
    const normRaw = raw.replace(/隊$/, '');
    if (TEAM_CONFIG[normRaw]) return normRaw;
    if (TEAM_CONFIG[raw]) return raw;
  }
  return null;
}

/* ══════════════════════════════════════
   共用：對戰組合卡片
   ══════════════════════════════════════ */

function buildMatchupCard(m) {
  const hc = TEAM_CONFIG[m.home] || {};
  const ac = TEAM_CONFIG[m.away] || {};
  const hasTeams = m.home && m.away;

  let scoreHtml = '';
  if (m.status === 'finished' && m.homeScore != null && m.awayScore != null) {
    const winner = m.homeScore > m.awayScore ? m.home : m.away;
    scoreHtml = `
      <div class="hgc-score-row">
        <span class="hgc-s ${hc.cls}">${m.homeScore}</span>
        <span class="hgc-colon">:</span>
        <span class="hgc-s ${ac.cls}">${m.awayScore}</span>
      </div>
      <span class="badge bw" style="font-size:.62rem">${winner}隊勝</span>`;
  } else if (!hasTeams) {
    scoreHtml = '<div class="hgc-pending" style="color:var(--txt-light)">尚未公告</div>';
  }

  return `
    <div class="hgc${m.status === 'upcoming' ? ' hgc-upcoming' : ''}">
      <span class="hgc-num">組合 ${m.combo}</span>
      <div class="hgc-matchup">
        <span class="hgc-team ${hc.cls}">${hasTeams ? m.home + '隊' : '—'}</span>
        <span class="hgc-vs">VS</span>
        <span class="hgc-team ${ac.cls}">${hasTeams ? m.away + '隊' : '—'}</span>
      </div>
      ${scoreHtml}
    </div>`;
}

/* ── Init on DOM ready ── */
document.addEventListener('DOMContentLoaded', initNavigation);

/* ── PWA Service Worker 註冊 ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
