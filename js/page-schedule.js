/* ══════════════════════════════════
   PAGE: SCHEDULE — 賽程（含週次導航）
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showEmpty, toggleCard, showSchedView)
   依賴：js/api.js (api.getSchedule)
   資料：datas!D87:N113 + datas!Q88:AC177
══════════════════════════════════ */

(function() {
  'use strict';

  let _schedule = null;
  let _viewIndex = -1;

  /* ═══════════════════════════════
     Status helpers
     ═══════════════════════════════ */
  function gameScoreHtml(game) {
    if (game.status === 'finished' || game.status === 'live') {
      const hc = TEAM_CONFIG[game.home] || {};
      const ac = TEAM_CONFIG[game.away] || {};
      return `<span class="${hc.cls}">${game.homeScore}</span> <span style="color:var(--txt-light);font-size:.8rem">:</span> <span class="${ac.cls}">${game.awayScore}</span>`;
    }
    return '';
  }

  /* ═══════════════════════════════
     Schedule page — game cards
     ═══════════════════════════════ */
  function buildSchedGameCard(game, phase, weekNum) {
    // 賽程順序尚未排定 → 簡化顯示
    if (!game.home && !game.away) {
      return `
        <div class="game-card">
          <div class="gc-head">
            <div class="gc-stripe"></div>
            <div class="gc-num">GAME ${game.num}</div>
            <div class="gc-teams" style="justify-content:center;color:var(--txt-light);font-size:.85rem">尚未安排</div>
          </div>
        </div>`;
    }

    const hc = TEAM_CONFIG[game.home] || {};
    const ac = TEAM_CONFIG[game.away] || {};

    const isFinished = game.status === 'finished' || game.status === 'live';
    const homeWin = isFinished && game.homeScore > game.awayScore;
    const awayWin = isFinished && game.awayScore > game.homeScore;

    const scoreMidHtml = isFinished ? gameScoreHtml(game) : '';

    let staffHtml = '';
    if (game.staff && Object.keys(game.staff).length) {
      staffHtml = Object.entries(game.staff).map(([role, people]) => {
        const coloredNames = people.map(p => {
          const team = detectTeam(p);
          if (team) {
            const tc = TEAM_CONFIG[team] || {};
            return `<span class="${tc.cls || ''}">${p}</span>`;
          }
          return p;
        }).join('<span class="gc-name-sep">・</span>');
        return `<div class="gc-staff"><span class="gc-role">${role}</span><span class="gc-name">${coloredNames}</span></div>`;
      }).join('');
    }

    const bsBtn = (isFinished && phase && weekNum && game.num)
      ? `<a href="boxscore.html?phase=${encodeURIComponent(phase)}&relweek=${weekNum}&game=${game.num}" class="gc-bs-btn">📊</a>`
      : '';

    // 有比分(finished) → 全部收合；沒比分(upcoming) → 全部展開
    return `
      <div class="game-card${!isFinished ? ' open' : ''}">
        <div class="gc-head">
          <div class="gc-stripe"></div>
          <div class="gc-num">GAME ${game.num}${game.time ? ' · ' + game.time : ''}</div>
          <div class="gc-teams">
            <span class="${hc.cls} gc-tname-h">${homeWin ? '👑 ' : ''}${game.home}</span>
            <div class="gc-score-mid">${scoreMidHtml}</div>
            <span class="${ac.cls} gc-tname-a">${game.away}${awayWin ? ' 👑' : ''}</span>
          </div>
          ${bsBtn}
          <div class="gc-arr">▼</div>
        </div>
        <div class="gc-body">${staffHtml}</div>
      </div>`;
  }

  /* ═══════════════════════════════
     Schedule page — render functions
     ═══════════════════════════════ */
  function renderSchedulePage(weekData) {
    const container = document.getElementById('sched-games');
    if (!container) return;
    if (!weekData || !weekData.games || !weekData.games.length) {
      showEmpty(container, '本週尚無賽程資料');
      return;
    }
    const relWeek = getPhaseRelativeWeekNum(weekData, _schedule ? _schedule.allWeeks : null);
    container.innerHTML = weekData.games.map(g => buildSchedGameCard(g, weekData.phase, relWeek)).join('');
  }

  function renderScheduleMatchups(weekData) {
    const container = document.getElementById('sched-matchup-grid');
    if (!container) return;

    if (!weekData.matchups || !weekData.matchups.length) {
      container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:var(--txt-light)">本週尚無對戰組合</div>';
      return;
    }

    container.innerHTML = weekData.matchups.map(buildMatchupCard).join('');
  }

  /* ═══════════════════════════════
     Week navigation
     ═══════════════════════════════ */
  function parseGameDate(dateStr) {
    if (!dateStr) return null;
    // Handle formats like "2026/2/7", "2026/2/14（六）07:30", "2026 / 2 / 14（六）07:30"
    const clean = dateStr.replace(/\s/g, '').replace(/（.*$/, '');
    const parts = clean.split('/');
    if (parts.length >= 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return null;
  }

  function findCurrentIndex(allWeeks, currentWeek) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find the latest finished game week whose date has passed (after 23:59:59)
    // Then default to the NEXT game week after it
    let latestPassedIdx = -1;
    for (let i = 0; i < allWeeks.length; i++) {
      const entry = allWeeks[i];
      if (!entry.date) continue;
      const gameDate = parseGameDate(entry.date);
      if (!gameDate) continue;
      // If today > game date (i.e. game day has fully passed)
      if (todayStart > gameDate) {
        latestPassedIdx = i;
      }
    }

    if (latestPassedIdx >= 0) {
      // Find the next game week (skip suspended weeks)
      for (let i = latestPassedIdx + 1; i < allWeeks.length; i++) {
        if (allWeeks[i].type === 'game') return i;
      }
      // No future game week found — stay on the latest passed
      return latestPassedIdx;
    }

    // Fallback: find by currentWeek
    for (let i = 0; i < allWeeks.length; i++) {
      if (allWeeks[i].type === 'game' && allWeeks[i].week === currentWeek) return i;
    }
    return 0;
  }

  function updateHero(entry) {
    const heroContent = document.getElementById('sched-hero-content');
    if (!heroContent) return;

    if (entry.type === 'suspended') {
      heroContent.innerHTML = `
        <div class="sched-hero-left">
          <div class="eyebrow" style="color:var(--orange2);margin-bottom:.4rem">第 ${ApiConfig.currentSeason} 屆</div>
          <h2 style="font-size:1.8rem;margin-bottom:0">停賽</h2>
        </div>
        <div class="sched-hero-right">
          <div class="sched-hero-date">${entry.date}</div>
          <div class="sched-hero-venue">${entry.venue}</div>
        </div>`;
    } else {
      const label = getPhaseWeekLabel(entry, _schedule ? _schedule.allWeeks : null);
      heroContent.innerHTML = `
        <div class="sched-hero-left">
          <div class="eyebrow" style="color:var(--orange2);margin-bottom:.4rem">第 ${ApiConfig.currentSeason} 屆</div>
          <h2 style="font-size:1.8rem;margin-bottom:0">${label}</h2>
        </div>
        <div class="sched-hero-right">
          <div class="sched-hero-date">${entry.date}</div>
          <div class="sched-hero-venue">${entry.venue}</div>
        </div>`;
    }
  }

  function updateNavButtons() {
    const allWeeks = _schedule.allWeeks;
    const prevBtn = document.getElementById('btn-prev-week');
    const nextBtn = document.getElementById('btn-next-week');
    const wkLabel = document.getElementById('wk-label');

    if (prevBtn) prevBtn.style.visibility = (_viewIndex <= 0) ? 'hidden' : '';
    if (nextBtn) nextBtn.style.visibility = (_viewIndex >= allWeeks.length - 1) ? 'hidden' : '';

    const entry = allWeeks[_viewIndex];
    if (wkLabel) {
      if (entry.type === 'suspended') {
        wkLabel.textContent = `停賽 · ${entry.date}`;
      } else {
        wkLabel.textContent = getPhaseWeekLabel(entry, _schedule ? _schedule.allWeeks : null);
      }
    }
  }

  function renderWeekView() {
    if (!_schedule || _viewIndex < 0) return;
    const entry = _schedule.allWeeks[_viewIndex];

    updateHero(entry);
    updateNavButtons();

    const viewToggle = document.getElementById('sched-view-toggle');
    const viewMatchup = document.getElementById('view-matchup');
    const viewOrder = document.getElementById('view-order');
    const suspended = document.getElementById('sched-suspended');

    if (entry.type === 'suspended') {
      // 停賽週
      if (viewToggle) viewToggle.style.display = 'none';
      if (viewMatchup) viewMatchup.style.display = 'none';
      if (viewOrder) viewOrder.style.display = 'none';

      if (suspended) {
        suspended.style.display = '';
        suspended.innerHTML = `
          <div class="card" style="text-align:center;padding:2.5rem 1rem">
            <div style="font-size:2rem;margin-bottom:.6rem">🏖️</div>
            <div style="font-weight:700;font-size:1.1rem;margin-bottom:.4rem">本週停賽</div>
            <div style="color:var(--txt-light);font-size:.9rem">${entry.reason || ''}</div>
          </div>`;
      }
    } else {
      // 比賽週
      if (suspended) suspended.style.display = 'none';
      if (viewToggle) viewToggle.style.display = '';

      // 有賽程順序（且已排定隊伍）時預設顯示賽程順序，否則顯示對戰組合
      const hasGames = entry.games && entry.games.length > 0 && entry.games[0].home;
      showSchedView(hasGames ? 'order' : 'matchup');

      renderScheduleMatchups(entry);
      renderSchedulePage(entry);
    }
  }

  function navigateWeek(dir) {
    if (!_schedule) return;
    const newIdx = _viewIndex + (dir === 'prev' ? -1 : 1);
    if (newIdx < 0 || newIdx >= _schedule.allWeeks.length) return;
    _viewIndex = newIdx;
    renderWeekView();
  }

  /* ═══════════════════════════════
     Fetch & Init
     ═══════════════════════════════ */
  async function loadSchedule() {
    try {
      const data = await api.getSchedule();
      _schedule = data;

      const currentWeek = data.currentWeek;

      // Schedule page: initialize navigation
      if (document.getElementById('btn-prev-week')) {
        _viewIndex = findCurrentIndex(data.allWeeks, currentWeek);
        renderWeekView();
      }

      // Home page: emit schedule data for cross-module rendering
      const homeIdx = findCurrentIndex(data.allWeeks, currentWeek);
      const homeEntry = data.allWeeks[homeIdx];
      if (homeEntry && homeEntry.type === 'game') {
        AppEvents.emit('scheduleReady', homeEntry, data.allWeeks);
      } else {
        const weekData = data.weeks[String(currentWeek)];
        if (weekData) AppEvents.emit('scheduleReady', weekData, data.allWeeks);
      }
    } catch (err) {
      console.error('載入賽程資料失敗:', err);
      const container = document.getElementById('sched-games');
      if (container) {
        showError(container, '賽程資料載入失敗', loadSchedule);
      }
    }
  }

  window.loadSchedule = loadSchedule;

  // 事件綁定（取代 inline onclick）
  document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('btn-prev-week');
    const nextBtn = document.getElementById('btn-next-week');
    if (prevBtn) prevBtn.addEventListener('click', () => navigateWeek('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateWeek('next'));

    // 賽程頁 toggle（只在賽程頁綁定）
    if (document.getElementById('sched-hero')) {
      const btnM = document.getElementById('btn-matchup');
      const btnO = document.getElementById('btn-order');
      if (btnM) btnM.addEventListener('click', () => showSchedView('matchup'));
      if (btnO) btnO.addEventListener('click', () => showSchedView('order'));
    }

    // Game card toggle 事件委派
    const schedGames = document.getElementById('sched-games');
    if (schedGames) {
      schedGames.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const card = e.target.closest('.game-card');
        if (card) toggleCard(card);
      });
    }
  });
})();
