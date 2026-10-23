(function() {
  'use strict';

  let schedule = null;
  let weekIndex = 0;
  let scheduleMode = 'order';
  const categories = ['pts', 'reb', 'ast', 'stl', 'blk'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const teamStyle = team => `--team-color:${TEAM_CONFIG[team]?.color || 'var(--n500)'}`;
  const jersey = '<svg viewBox="0 0 64 72" aria-hidden="true"><path d="m20 4 12 6 12-6 16 14-10 12-6-5v43H20V25l-6 5L4 18Z"/></svg>';

  function panelHead(eyebrow, title, link, label) {
    return `<div class="panel-heading"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${link ? `<a class="text-link" href="${link}">${label} ↗</a>` : ''}</div>`;
  }

  function renderStandings(data) {
    const rows = (data.standings || []).map(t => `<tr${t.rank === 1 ? ' class="leading"' : ''}><td>${esc(t.rank)}</td><td><span class="team-name" style="${teamStyle(t.team)}"><span class="team-dot"></span>${esc(t.name)}</span></td><td>${esc(t.record)}</td><td>${esc(t.pct)}</td></tr>`).join('');
    document.getElementById('home-standings').innerHTML = panelHead('TEAM STANDINGS', '球隊戰績') +
      `<table><caption class="sr-only">第 ${esc(data.season)} 屆球隊戰績</caption><colgroup><col class="rank-col"><col class="team-col"><col class="record-col"><col class="pct-col"></colgroup><thead><tr><th scope="col">#</th><th scope="col">球隊</th><th scope="col">戰績</th><th scope="col">勝率</th></tr></thead><tbody>${rows || '<tr><td colspan="4">尚無戰績資料</td></tr>'}</tbody></table><a class="panel-link" href="standings.html">查看完整戰績、近況與連勝敗 <span>↗</span></a>`;
  }

  function renderDragon(data) {
    const rows = (data.dragonTop10 || []).slice(0, 3).map(p => `<div class="player-row"><span class="player-rank">${esc(p.rank)}</span><span class="player-info">${esc(p.name)}<small>${esc(p.team)}隊 · 出席 ${esc(p.att)} / 輪值 ${esc(p.duty)}</small></span><span class="player-value">${esc(p.total)}<small>分</small></span></div>`).join('');
    document.getElementById('home-dragon').innerHTML = panelHead('BEYOND THE SCORE', '積分龍虎榜') + `<p class="dragon-desc">每一次出席、每一份付出，都算數。</p><div class="dragon-list">${rows || '<p class="home-message">尚無積分資料</p>'}</div><a class="panel-link" href="dragon.html">查看完整排名 <span>↗</span></a>`;
  }

  function renderStats(data) {
    const container = document.getElementById('home-stats');
    const stats = data.miniStats || {};
    const available = categories.filter(cat => stats[cat]);
    const tabs = available.map((cat, i) => `<button class="mtab${i === 0 ? ' active-mtab' : ''}" id="tab-${cat}" role="tab" aria-selected="${i === 0}" aria-controls="ms-${cat}" tabindex="${i === 0 ? 0 : -1}" data-panel="ms-${cat}">${esc(stats[cat].label)}</button>`).join('');
    const panels = available.map((cat, i) => {
      const s = stats[cat];
      const [first, ...others] = s.players || [];
      const featured = first ? `<div class="featured-player" style="${teamStyle(first.team)}"><div class="jersey">${jersey}</div><div><span class="player-kicker">${esc(first.team)}隊 · ${esc(s.label)}領先者</span><h3>${esc(first.name)}</h3><div class="featured-value">${Number(first.val).toFixed(2)}<small>${esc(s.unit)}</small></div></div></div>` : '';
      const rows = others.map(p => `<div class="player-row"><span class="player-rank">${esc(p.rank)}</span><span class="player-info">${esc(p.name)}<small>${esc(p.team)}隊</small></span><span class="player-value">${Number(p.val).toFixed(2)}<small>${esc(s.unit)}</small></span></div>`).join('');
      return `<div class="stat-content" id="ms-${cat}" role="tabpanel" aria-labelledby="tab-${cat}"${i ? ' hidden' : ''}>${featured || '<p class="home-message">本項尚無個人數據</p>'}<div class="player-list">${rows}</div></div>`;
    }).join('');
    container.innerHTML = panelHead('SEASON LEADERS', '場上的焦點', 'leaders.html', '全部數據') + `<div class="stat-tabs" role="tablist" aria-label="個人數據項目">${tabs}</div>${panels || '<p class="home-message">尚無個人數據</p>'}`;
  }

  async function loadMiniStats(data) {
    if (data.miniStats) {
      renderStats(data);
      return;
    }
    try {
      const source = await api.getLeaders();
      const fields = {pts: ['得分', 'PPG'], reb: ['籃板', 'RPG'], ast: ['助攻', 'APG'], stl: ['抄截', 'SPG'], blk: ['阻攻', 'BPG']};
      const miniStats = {};
      Object.entries(fields).forEach(([cat, [label, unit]]) => {
        const row = (source.leaders?.rows || []).find(row => String(row[0] || '').trim() === '平均' + label);
        const players = (row || []).slice(1, 5).map((cell, i) => {
          const [nameTeam, value] = String(cell || '').trim().split('\n');
          const val = Number.parseFloat(String(value || '').replace(/,/g, ''));
          if (!nameTeam || !Number.isFinite(val)) return null;
          return {rank: i + 1, name: nameTeam.replace(/\(.*$/, '').trim(), team: detectTeam(nameTeam) || '', val};
        }).filter(Boolean);
        miniStats[cat] = {label, unit, players};
      });
      renderStats({miniStats});
    } catch (err) {
      console.error('載入個人領先榜失敗:', err);
      renderStats({});
    }
  }

  function selectStat(button) {
    document.querySelectorAll('#home-stats .mtab').forEach(tab => {
      const selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle('active-mtab', selected);
      document.getElementById(tab.dataset.panel).hidden = !selected;
    });
  }

  function gameCard(game, entry, isOrder) {
    const finished = ['finished', 'live'].includes(game.status);
    const relWeek = getPhaseRelativeWeekNum(entry, schedule.allWeeks);
    const hasTeams = game.home && game.away;
    const href = finished && isOrder && game.num ? `boxscore.html?phase=${encodeURIComponent(entry.phase)}&relweek=${relWeek}&game=${game.num}` : 'schedule.html';
    const team = (name, score) => `<div class="game-team"><span class="team-badge" style="${teamStyle(name)}">${jersey}</span><span>${name ? esc(name) + '隊' : '尚未安排'}</span><span class="game-score${finished ? '' : ' empty'}">${finished ? esc(score) : '—'}</span></div>`;
    return `<a class="game" href="${href}"><div class="game-top"><span>${isOrder ? '場次' : '組合'} ${esc(isOrder ? game.num : game.combo)}${game.time ? ' · ' + esc(game.time) : ''}</span><span class="game-state${finished ? ' finished' : ''}">${finished ? (game.status === 'live' ? '進行中' : '已完賽') : hasTeams ? '即將開打' : '待公告'}</span></div>${team(game.home, game.homeScore)}${team(game.away, game.awayScore)}<div class="game-bottom"><span>${finished && isOrder ? '查看對戰數據' : '查看完整賽程'}</span><span aria-hidden="true">↗</span></div></a>`;
  }

  function renderWeek(resetMode = false) {
    const entry = schedule.allWeeks[weekIndex];
    if (resetMode) scheduleMode = entry.games?.some(game => game.home && game.away) ? 'order' : 'matchup';
    const header = document.getElementById('home-sched-header');
    const suspended = entry.type === 'suspended';
    const phase = entry.phase === '例行賽' ? '例行賽程' : `${esc(entry.phase || '')}賽程`;
    header.innerHTML = `<div class="schedule-toolbar"><div class="week-control"><button class="icon-button" id="home-prev-week" aria-label="上一週"${weekIndex === 0 ? ' disabled' : ''}>‹</button><span id="home-week-label">${suspended ? '停賽' : phase + ' · 第 ' + getPhaseRelativeWeekNum(entry, schedule.allWeeks) + ' 週'}<small>${esc(entry.date)}</small></span><button class="icon-button" id="home-next-week" aria-label="下一週"${weekIndex === schedule.allWeeks.length - 1 ? ' disabled' : ''}>›</button></div><div class="venue">${esc(entry.venue || '')}</div>${suspended ? '' : `<div class="home-schedule-tabs"><button id="btn-matchup" class="sched-toggle-btn${scheduleMode === 'matchup' ? ' active-toggle' : ''}" aria-pressed="${scheduleMode === 'matchup'}">對戰組合</button><button id="btn-order" class="sched-toggle-btn${scheduleMode === 'order' ? ' active-toggle' : ''}" aria-pressed="${scheduleMode === 'order'}">賽程順序</button></div>`}</div>`;
    const content = document.getElementById('home-schedule-content');
    if (suspended) {
      content.innerHTML = `<div class="home-message home-suspended"><strong>本週停賽</strong><p>${esc(entry.reason || '')}</p></div>`;
      return;
    }
    const games = scheduleMode === 'order' ? entry.games : entry.matchups;
    content.innerHTML = games?.length ? `<div class="games" tabindex="0" aria-label="本週賽程，可左右滑動">${games.map(g => gameCard(g, entry, scheduleMode === 'order')).join('')}</div>${scheduleMode === 'order' ? '<p class="home-order-hint">每場間隔 30 分鐘 · 開賽時間依場地公告為準 · 賽程順序每週四公告</p>' : ''}` : '<p class="home-message">本週尚無賽程資料</p>';
  }

  async function loadHomeSchedule() {
    try {
      schedule = await api.getSchedule();
      if (!schedule.allWeeks?.length) {
        document.getElementById('home-sched-header').innerHTML = '<p class="home-message">目前尚無賽程資料</p>';
        return;
      }
      weekIndex = getScheduleWeekIndex(schedule.allWeeks, schedule.currentWeek);
      renderWeek(true);
    } catch (err) {
      console.error('載入賽程資料失敗:', err);
      showError(document.getElementById('home-sched-header'), '賽程資料載入失敗', loadHomeSchedule);
    }
  }

  async function loadHome() {
    try {
      const data = await api.getHome();
      renderStandings(data);
      renderDragon(data);
      loadMiniStats(data);
      document.getElementById('home-season-index').textContent = data.season;
    } catch (err) {
      console.error('載入首頁資料失敗:', err);
      ['home-standings', 'home-dragon', 'home-stats'].forEach(id => showError(document.getElementById(id), '首頁資料載入失敗', loadHome));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.home-page');
    main.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) return;
      if (button.matches('.mtab')) selectStat(button);
      if (button.id === 'home-prev-week' || button.id === 'home-next-week') {
        weekIndex += button.id === 'home-prev-week' ? -1 : 1;
        renderWeek(true);
      }
      if (button.id === 'btn-matchup' || button.id === 'btn-order') {
        scheduleMode = button.id === 'btn-matchup' ? 'matchup' : 'order';
        renderWeek();
      }
    });
    main.addEventListener('keydown', e => {
      if (!e.target.matches('.mtab') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const tabs = [...main.querySelectorAll('.mtab')];
      const index = tabs.indexOf(e.target);
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      selectStat(tabs[next]);
    });
    loadHome().then(loadHomeSchedule);
  });
})();
