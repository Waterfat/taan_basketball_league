/* ══════════════════════════════════
   PAGE: HOME — 首頁
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showSched, switchMS)
   依賴：js/api.js (api.getHome)
   依賴：js/page-schedule.js (loadSchedule — 賽程區塊)
   資料：data/home.json, data/schedule.json
══════════════════════════════════ */

(function() {
  'use strict';

  /* ── 渲染戰績區塊 ── */
  function renderHomeStandings(data) {
    const container = document.getElementById('home-standings');
    if (!container) return;

    const rankColors = { 1: '#e6b800', 2: '#9e9e9e', 3: '#a1887f' };

    const rows = data.standings.map((t, i) => {
      const tc = TEAM_CONFIG[t.team] || {};
      const rankColor = rankColors[t.rank] ? ` style="color:${rankColors[t.rank]}"` : '';
      const lastBorder = i === data.standings.length - 1 ? ';border-bottom:none' : '';

      const histHtml = t.history.map((h, hi) => {
        const isLast = hi === t.history.length - 1;
        const cls = h === 'W' ? 'wl-dot wl-w' : 'wl-dot wl-l';
        return `<span class="${cls}${isLast ? ' wl-latest' : ''}">${h === 'W' ? '○' : '✕'}</span>`;
      }).join('');

      const badgeCls = t.streakType === 'win' ? 'bw' : 'bl';
      const pctStyle = parseFloat(t.pct) >= 60 ? ` style="color:${tc.color}"` : (parseFloat(t.pct) < 30 ? ' style="color:#e53935"' : '');

      return `<div class="team-rank-row" style="--tc-bg:${tc.bg}${lastBorder}">
        <div class="trr-rank"${rankColor}>${t.rank}</div>
        <div class="trr-bar" style="background:${tc.barColor}"></div>
        <div class="trr-name" style="color:${tc.textColor}">${t.name}</div>
        <div class="trr-record">${t.record}</div>
        <div class="trr-pct"${pctStyle}>${t.pct}</div>
        <div class="trr-hist">${histHtml}</div>
        <div class="trr-streak"><span class="badge ${badgeCls}">${t.streak}</span></div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="home-sec-head">
        <div class="label" style="margin:0">🏆 球隊當前戰績</div>
        <a href="standings.html" class="see-more-link">詳細戰績榜 →</a>
      </div>
      <div class="card" style="overflow:hidden">
        <div class="trr-thead">
          <span class="trr-th-rank">#</span>
          <span class="trr-th-bar"></span>
          <span class="trr-th-name">隊伍</span>
          <span class="trr-th-rec">戰績</span>
          <span class="trr-th-pct">勝率</span>
          <span class="trr-th-hist">近況 <span style="font-weight:400;letter-spacing:0">← 最新</span></span>
          <span class="trr-th-streak">連</span>
        </div>
        ${rows}
      </div>`;
  }

  /* ── 渲染龍虎榜 TOP 10 ── */
  function renderHomeDragon(data) {
    const container = document.getElementById('home-dragon');
    if (!container) return;

    const rows = data.dragonTop10.map((p, i) => {
      const tc = TEAM_CONFIG[p.team] || {};
      const isTop3 = p.rank <= 3;
      const bgAlpha = isTop3 ? '.14' : '.10';
      const bg = tc.bg ? tc.bg.replace(/[\d.]+\)$/, `${bgAlpha})`) : '';
      const lastBorder = i === data.dragonTop10.length - 1 ? ';border-bottom:none' : '';
      const nameStyle = tc.nameStyle ? ` style="${tc.nameStyle}"` : '';

      return `<tr class="tr-h tr-colored" style="--row-bg:${bg}${lastBorder}">
        <td class="trank${isTop3 ? ' torange' : ''}">${p.rank}</td>
        <td class="tname">${isTop3 ? '<strong' : '<span'} class="${tc.cls}"${nameStyle}>${p.name}${isTop3 ? '</strong>' : '</span>'}</td>
        <td class="tn">${p.att}</td>
        <td class="tn">${p.duty}</td>
        <td class="tscore">${p.total}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <div class="home-sec-head">
        <div class="label" style="margin:0">🐉 積分龍虎榜 TOP 10</div>
        <a href="dragon.html" class="see-more-link">完整榜 →</a>
      </div>
      <div class="card" style="overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--warm1)">
            <th class="tth" style="width:30px">#</th>
            <th class="tth" style="text-align:left;padding-left:.9rem">球員</th>
            <th class="tth">出席</th>
            <th class="tth">輪值</th>
            <th class="tth">積分</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  /* ── 渲染迷你數據榜 ── */
  function renderHomeMiniStats(data) {
    const container = document.getElementById('home-stats');
    if (!container) return;

    const categories = ['pts', 'reb', 'ast', 'stl', 'blk'];

    const tabsHtml = categories.map((cat, i) => {
      const cls = i === 0 ? 'mtab active-mtab' : 'mtab';
      return `<button class="${cls}" onclick="switchMS(this,'ms-${cat}')">${data.miniStats[cat].label}</button>`;
    }).join('');

    const panelsHtml = categories.map((cat, i) => {
      const s = data.miniStats[cat];
      const display = i === 0 ? '' : ' style="display:none"';
      const rowsHtml = s.players.map((p, pi) => {
        const tc = TEAM_CONFIG[p.team] || {};
        const isFirst = pi === 0;
        const nameStyle = tc.nameStyle ? ` style="${tc.nameStyle}"` : '';
        const bg = tc.bg ? tc.bg : '';
        const lastBorder = pi === s.players.length - 1 ? ';border-bottom:none' : '';

        if (isFirst) {
          return `<div class="ms-row ms-1st ms-colored" style="--row-bg:${bg}"><span class="ms-medal">🥇</span><span class="ms-p"${nameStyle}><strong>${p.name}</strong></span><span class="ms-v">${p.val.toFixed(2)}</span><span class="ms-u">${s.unit}</span></div>`;
        }
        return `<div class="ms-row ms-colored" style="--row-bg:${bg}${lastBorder}"><span class="ms-rk">${p.rank}</span><span class="ms-p ${tc.cls}"${nameStyle}>${p.name}</span><span class="ms-v">${p.val.toFixed(2)}</span><span class="ms-u">${s.unit}</span></div>`;
      }).join('');

      return `<div id="ms-${cat}"${display}>${rowsHtml}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="home-sec-head">
        <div class="label" style="margin:0">📊 本季數據領先榜</div>
        <a href="stats.html" class="see-more-link">完整榜 →</a>
      </div>
      <div class="card" style="overflow:hidden">
        <div style="display:flex;border-bottom:2px solid var(--warm1)">
          ${tabsHtml}
        </div>
        ${panelsHtml}
      </div>`;
  }

  /* ── 渲染賽程標題區塊 ── */
  function renderScheduleHeader(data) {
    const container = document.getElementById('home-sched-header');
    if (!container) return;

    container.innerHTML = `
      <div class="stb-row1">
        <div class="stb-left">
          <span class="stb-phase">${data.phase}</span>
          <span class="stb-week">第 ${data.season} 屆・第 ${data.currentWeek} 週</span>
        </div>
        <a href="schedule.html" class="see-more-link">全部 →</a>
      </div>
      <div class="stb-row2">
        <div class="stb-date">📅 ${data.scheduleInfo.date}</div>
        <div class="stb-loc">📍 ${data.scheduleInfo.venue}</div>
      </div>
      <div class="stb-row3">
        <button onclick="showSched('matchup')" id="btn-matchup" class="sched-toggle-btn active-toggle">對戰組合</button>
        <button onclick="showSched('order')" id="btn-order" class="sched-toggle-btn">賽程順序</button>
      </div>`;
  }

  /* ── Fetch & Init ── */
  async function loadHome() {
    try {
      const data = await api.getHome();
      renderScheduleHeader(data);
      renderHomeStandings(data);
      renderHomeDragon(data);
      renderHomeMiniStats(data);
    } catch (err) {
      console.error('載入首頁資料失敗:', err);
    }
  }

  window.loadHome = loadHome;

  document.addEventListener('DOMContentLoaded', loadHome);
})();
