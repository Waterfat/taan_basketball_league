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

      const histHtml = renderHistoryDots(t.history);

      const badgeCls = t.streakType === 'win' ? 'bw' : 'bl';
      const pctCls = getPctClass(t.pct);
      const pctAttr = pctCls ? ` class="${pctCls}"` : '';

      return `<div class="team-rank-row" style="--tc-bg:${tc.bg}${lastBorder}">
        <div class="trr-rank"${rankColor}>${t.rank}</div>
        <div class="trr-bar" style="background:${tc.barColor}"></div>
        <div class="trr-name" style="color:${tc.textColor}">${t.name}</div>
        <div class="trr-record">${t.record}</div>
        <div class="trr-pct"${pctAttr}>${t.pct}</div>
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
      const bg = getTeamBg(p.team, isTop3 ? '.14' : '.10');
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
    if (!container || !data.miniStats) return;

    const categories = ['pts', 'reb', 'ast', 'stl', 'blk'];

    const tabsHtml = categories.map((cat, i) => {
      const cls = i === 0 ? 'mtab active-mtab' : 'mtab';
      return `<button class="${cls}" data-panel="ms-${cat}">${data.miniStats[cat].label}</button>`;
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
    // miniStats tab 事件委派
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.mtab');
      if (!btn) return;
      const panelId = btn.dataset.panel;
      if (panelId) switchMS(btn, panelId);
    });
  }

  /* ═══════════════════════════════
     首頁：賽程卡片渲染
     ═══════════════════════════════ */
  function buildHomeGameCard(game, phase, weekNum) {
    if (!game.home && !game.away) {
      return `
        <div class="hgc hgc-upcoming">
          <span class="hgc-num">GAME ${game.num}</span>
          <div class="hgc-pending">尚未安排</div>
        </div>`;
    }

    const hc = TEAM_CONFIG[game.home] || {};
    const ac = TEAM_CONFIG[game.away] || {};
    const isUpcoming = game.status === 'upcoming';
    const isFinished = game.status === 'finished' || game.status === 'live';

    let scoreHtml;
    if (isFinished) {
      const winner = game.homeScore > game.awayScore ? game.home : game.away;
      const winnerTc = TEAM_CONFIG[winner] || {};
      const badge = `<span class="badge bw ${winnerTc.cls || ''}" style="font-size:.62rem">${winner}隊勝</span>`;
      scoreHtml = `<div class="hgc-score-row"><span class="hgc-s ${hc.cls}">${game.homeScore}</span><span class="hgc-colon">:</span><span class="hgc-s ${ac.cls}">${game.awayScore}</span></div>${badge}`;
    } else {
      scoreHtml = '<div class="hgc-pending">即將開打</div>';
    }

    const bsLink = (isFinished && phase && weekNum && game.num)
      ? `<a href="boxscore.html?phase=${encodeURIComponent(phase)}&relweek=${weekNum}&game=${game.num}" class="bs-link-btn">📊 查看對戰數據</a>`
      : '';

    return `
      <div class="hgc${isUpcoming ? ' hgc-upcoming' : ''}">
        <span class="hgc-num">GAME ${game.num}${game.time ? '&nbsp;·&nbsp;' + game.time : ''}</span>
        <div class="hgc-matchup">
          <span class="hgc-team ${hc.cls}">${game.home}隊</span>
          <span class="hgc-vs">VS</span>
          <span class="hgc-team ${ac.cls}">${game.away}隊</span>
        </div>
        ${scoreHtml}
        ${bsLink}
      </div>`;
  }

  function renderHomeSchedule(weekData, allWeeks) {
    const matchupGrid = document.getElementById('home-matchup-grid');
    const orderGrid = document.getElementById('home-order-grid');

    if (matchupGrid && weekData.matchups) {
      matchupGrid.innerHTML = weekData.matchups.map(buildMatchupCard).join('');
    }
    if (orderGrid && weekData.games) {
      const relWeek = getPhaseRelativeWeekNum(weekData, allWeeks);
      orderGrid.innerHTML = weekData.games.map(g => buildHomeGameCard(g, weekData.phase, relWeek)).join('');
      const hint = document.getElementById('home-order-hint');
      if (hint) hint.style.display = 'block';
    }

    const hasGames = weekData.games && weekData.games.length > 0 && weekData.games[0].home;
    showSched(hasGames ? 'order' : 'matchup');
  }

  function updateHomeSchedHeader(entry, allWeeks) {
    const container = document.getElementById('home-sched-header');
    if (!container) return;
    const label = getPhaseWeekLabel(entry, allWeeks);
    const dateEl = container.querySelector('.stb-date');
    const locEl = container.querySelector('.stb-loc');
    const weekEl = container.querySelector('.stb-week');
    if (dateEl) dateEl.textContent = '📅 ' + entry.date;
    if (locEl) locEl.textContent = '📍 ' + entry.venue;
    if (weekEl) weekEl.textContent = `第 ${ApiConfig.currentSeason} 屆・` + label;
  }

  // 接收賽程模組資料（跨模組通訊）
  AppEvents.on('scheduleReady', (weekData, allWeeks) => {
    renderHomeSchedule(weekData, allWeeks);
    updateHomeSchedHeader(weekData, allWeeks);
  });

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
        <button id="btn-matchup" class="sched-toggle-btn active-toggle">對戰組合</button>
        <button id="btn-order" class="sched-toggle-btn">賽程順序</button>
      </div>`;
    // 首頁 toggle 事件綁定
    const btnM = container.querySelector('#btn-matchup');
    const btnO = container.querySelector('#btn-order');
    if (btnM) btnM.addEventListener('click', () => showSched('matchup'));
    if (btnO) btnO.addEventListener('click', () => showSched('order'));
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
    // 首頁賽程區塊由 loadSchedule 負責渲染，等 home 資料快取填充後再呼叫
    if (typeof loadSchedule === 'function') loadSchedule();
  }

  document.addEventListener('DOMContentLoaded', loadHome);
})();
