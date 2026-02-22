/* ══════════════════════════════════
   PAGE: SCHEDULE — 賽程
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showEmpty, toggleCard)
   依賴：js/api.js (api.getSchedule)
   資料：data/schedule.json
══════════════════════════════════ */

(function() {
  'use strict';

  let _schedule = null;

  /* ── Status helpers ── */
  function gameStatusBadge(game) {
    if (game.status === 'finished') {
      const winner = game.homeScore > game.awayScore ? game.home : game.away;
      return `<span class="badge bw" style="font-size:.62rem">${winner}隊勝</span>`;
    }
    if (game.status === 'live') return '<span class="badge bs" style="font-size:.62rem;animation:pulse 2s infinite">🔴 LIVE</span>';
    return '';
  }

  function gameScoreHtml(game) {
    if (game.status === 'finished' || game.status === 'live') {
      const hc = TEAM_CONFIG[game.home] || {};
      const ac = TEAM_CONFIG[game.away] || {};
      return `<span class="${hc.cls}">${game.homeScore}</span> <span style="color:var(--txt-light);font-size:.8rem">:</span> <span class="${ac.cls}">${game.awayScore}</span>`;
    }
    return '';
  }

  /* ── Build home page game cards (compact) ── */
  function buildHomeGameCard(game) {
    const hc = TEAM_CONFIG[game.home] || {};
    const ac = TEAM_CONFIG[game.away] || {};
    const isUpcoming = game.status === 'upcoming';

    let scoreHtml;
    if (game.status === 'finished' || game.status === 'live') {
      scoreHtml = `<div class="hgc-score-row"><span class="hgc-s ${hc.cls}">${game.homeScore}</span><span class="hgc-colon">:</span><span class="hgc-s ${ac.cls}">${game.awayScore}</span></div>${gameStatusBadge(game)}`;
    } else {
      scoreHtml = '<div class="hgc-pending">即將開打</div>';
    }

    return `
      <div class="hgc${isUpcoming ? ' hgc-upcoming' : ''}">
        <span class="hgc-num">GAME ${game.num}&nbsp;·&nbsp;${game.time}</span>
        <div class="hgc-matchup">
          <span class="hgc-team ${hc.cls}">${game.home}隊</span>
          <span class="hgc-vs">VS</span>
          <span class="hgc-team ${ac.cls}">${game.away}隊</span>
        </div>
        ${scoreHtml}
      </div>`;
  }

  /* ── Build home page matchup cards ── */
  function buildHomeMatchupCard(m) {
    const hc = TEAM_CONFIG[m.home] || {};
    const ac = TEAM_CONFIG[m.away] || {};
    return `
      <div class="hgc">
        <span class="hgc-num">組合 ${m.combo}</span>
        <div class="hgc-matchup">
          <span class="hgc-team ${hc.cls}">${m.home}隊</span>
          <span class="hgc-vs">VS</span>
          <span class="hgc-team ${ac.cls}">${m.away}隊</span>
        </div>
      </div>`;
  }

  /* ── Render home page schedule section (if containers exist) ── */
  function renderHomeSchedule(weekData) {
    const matchupGrid = document.getElementById('home-matchup-grid');
    const orderGrid = document.getElementById('home-order-grid');

    if (matchupGrid && weekData.matchups) {
      matchupGrid.innerHTML = weekData.matchups.map(buildHomeMatchupCard).join('');
    }
    if (orderGrid && weekData.games) {
      orderGrid.innerHTML = weekData.games.map(buildHomeGameCard).join('');
      // 加入提示文字
      const hint = document.getElementById('home-order-hint');
      if (hint) hint.style.display = 'block';
    }
  }

  /* ── Build schedule page game card (expandable) ── */
  function buildSchedGameCard(game, isFirst) {
    const hc = TEAM_CONFIG[game.home] || {};
    const ac = TEAM_CONFIG[game.away] || {};

    let scoreSection;
    if (game.status === 'finished' || game.status === 'live') {
      scoreSection = `<div class="gc-score">${gameScoreHtml(game)}</div>`;
    } else {
      scoreSection = '<div class="gc-score pending">尚未開打</div>';
    }

    let staffHtml = '';
    if (game.staff && Object.keys(game.staff).length) {
      staffHtml = Object.entries(game.staff).map(([role, people]) =>
        `<div class="gc-staff"><span class="gc-role">${role}</span><span class="gc-name">${people.join('・')}</span></div>`
      ).join('');
    }

    return `
      <div class="game-card${isFirst ? ' open' : ''}" onclick="toggleCard(this)">
        <div class="gc-head">
          <div class="gc-stripe"></div>
          <div class="gc-num">GAME ${game.num} · ${game.time}</div>
          <div class="gc-teams">
            <span class="dot ${hc.dot}"></span><span class="${hc.cls}">${game.home}</span>
            <span class="gc-sep">VS</span>
            <span class="dot ${ac.dot}"></span><span class="${ac.cls}">${game.away}</span>
          </div>
          ${scoreSection}
          <div class="gc-arr">▼</div>
        </div>
        <div class="gc-body">${staffHtml}</div>
      </div>`;
  }

  /* ── Render full schedule page ── */
  function renderSchedulePage(weekData) {
    const container = document.getElementById('sched-games');
    if (!container) return;
    if (!weekData || !weekData.games || !weekData.games.length) {
      showEmpty(container, '本週尚無賽程資料');
      return;
    }
    container.innerHTML = weekData.games.map((g, i) => buildSchedGameCard(g, i === 0)).join('');
  }

  /* ── Render schedule page matchups ── */
  function renderScheduleMatchups(weekData) {
    const container = document.getElementById('sched-matchup-grid');
    if (!container || !weekData.matchups) return;

    const hc = (t) => TEAM_CONFIG[t] || {};
    container.innerHTML = weekData.matchups.map(m =>
      `<div class="mup-card"><div class="mup-num">組合 ${m.combo}</div><div class="mup-matchup"><span class="${hc(m.home).cls}">${m.home}隊</span><span class="mup-vs">VS</span><span class="${hc(m.away).cls}">${m.away}隊</span></div></div>`
    ).join('');
  }

  /* ── Fetch & Init ── */
  async function loadSchedule() {
    try {
      const data = await api.getSchedule();
      _schedule = data;

      const currentWeek = data.currentWeek;
      const weekData = data.weeks[String(currentWeek)];

      if (!weekData) return;

      // Update hero info if elements exist
      const heroDate = document.getElementById('sched-hero-date');
      if (heroDate) heroDate.textContent = `${weekData.date} ${weekData.time} · ${weekData.venue}`;

      // Render depending on which page we're on
      renderHomeSchedule(weekData);
      renderSchedulePage(weekData);
      renderScheduleMatchups(weekData);
    } catch (err) {
      console.error('載入賽程資料失敗:', err);
      const container = document.getElementById('sched-games');
      if (container) {
        showError(container, '賽程資料載入失敗', 'loadSchedule');
      }
    }
  }

  // 暴露全域
  window.loadSchedule = loadSchedule;

  // 注意：不在這裡自動呼叫 loadSchedule
  // 由各頁面的 HTML 或 page-home.js 決定何時呼叫
})();
