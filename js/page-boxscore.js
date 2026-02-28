/* ══════════════════════════════════════
   PAGE: BOXSCORE — 對戰數據
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showEmpty)
   依賴：js/api.js (api.getBoxscore)
   資料：boxscore!A1:AO1980（每 22 列一場比賽）
══════════════════════════════════════ */

(function () {
  'use strict';

  let _data   = null; // { weeks, defaultIdx, season }
  let _wkIdx  = -1;   // 目前顯示的 weeks 陣列 index

  /* ════════════════════════════════
     射擊欄位格式化
     ════════════════════════════════ */
  function shotFmt(miss, made) {
    const att = miss + made;
    return att === 0 ? '0/0' : `${made}/${att}`;
  }

  function shotPct(miss, made) {
    const att = miss + made;
    if (att === 0) return '';
    return ` <span class="bs-pct">(${Math.round(made / att * 100)}%)</span>`;
  }

  /* ════════════════════════════════
     賽制相對週次
     ════════════════════════════════ */
  function getPhaseRelativeWeek(wk) {
    const minWeek = _data.weeks
      .filter(w => w.phase === wk.phase)
      .reduce((min, w) => Math.min(min, w.weekNum), wk.weekNum);
    return wk.weekNum - minWeek + 1;
  }

  /* ════════════════════════════════
     球員列 HTML
     ════════════════════════════════ */
  function playerRowHtml(p, tc) {
    const dnpCls = p.played ? '' : ' bs-dnp';
    const namePart = `<span class="${tc.cls || ''}">${p.name}</span>`;
    const dnpTag = !p.played ? '<span class="bs-dnp-tag">(未出賽)</span>' : '';
    return `
      <tr class="bs-pr${dnpCls}">
        <td class="bs-td-name">${namePart}${dnpTag}</td>
        <td>${p.pts}</td>
        <td>${shotFmt(p.fg2miss, p.fg2made)}</td>
        <td>${shotFmt(p.fg3miss, p.fg3made)}</td>
        <td>${shotFmt(p.ftmiss, p.ftmade)}</td>
        <td>${p.treb}<span class="bs-paren"> (${p.oreb}/${p.dreb})</span></td>
        <td>${p.ast}</td>
        <td>${p.stl}</td>
        <td>${p.blk}</td>
        <td>${p.tov}</td>
        <td>${p.pf}</td>
      </tr>`;
  }

  function totalsRowHtml(tot) {
    return `
      <tr class="bs-tot-row">
        <td class="bs-td-name">合計</td>
        <td>${tot.pts}</td>
        <td>${shotFmt(tot.fg2miss, tot.fg2made)}${shotPct(tot.fg2miss, tot.fg2made)}</td>
        <td>${shotFmt(tot.fg3miss, tot.fg3made)}${shotPct(tot.fg3miss, tot.fg3made)}</td>
        <td>${shotFmt(tot.ftmiss, tot.ftmade)}${shotPct(tot.ftmiss, tot.ftmade)}</td>
        <td>${tot.treb}<span class="bs-paren"> (${tot.oreb}/${tot.dreb})</span></td>
        <td>${tot.ast}</td>
        <td>${tot.stl}</td>
        <td>${tot.blk}</td>
        <td>${tot.tov}</td>
        <td>${tot.pf}</td>
      </tr>`;
  }

  /* ════════════════════════════════
     隊伍 boxscore 區塊（上/下）
     ════════════════════════════════ */
  function teamBoxHtml(teamName, players, totals, score, isHome) {
    const tc = TEAM_CONFIG[teamName] || {};
    const side = isHome ? '主隊' : '客隊';
    const scoreStr = score !== null ? `<span class="bs-team-score" style="color:${tc.color || 'inherit'}">${score}</span>` : '';

    const activePlayers = players.filter(p => p.played);
    const dnpPlayers    = players.filter(p => !p.played && p.name);
    const hasPlayerData = players.length > 0;

    let bodyRows = '';
    if (hasPlayerData) {
      bodyRows = activePlayers.map(p => playerRowHtml(p, tc)).join('');
      if (dnpPlayers.length) {
        bodyRows += dnpPlayers.map(p => playerRowHtml(p, tc)).join('');
      }
      bodyRows += totalsRowHtml(totals);
    } else {
      bodyRows = `<tr><td colspan="11" style="text-align:center;padding:1.2rem;color:var(--txt-light)">尚無球員數據</td></tr>`;
    }

    return `
      <div class="bs-team-block">
        <div class="bs-team-header" style="border-left:4px solid ${tc.color || '#ccc'}">
          <span class="bs-team-badge ${tc.cls || ''}">${teamName}</span>
          <span class="bs-team-side">${side}</span>
          ${scoreStr}
        </div>
        <div class="bs-table-wrap">
          <table class="bs-table">
            <thead>
              <tr>
                <th class="bs-th-name">球員</th>
                <th>得分</th>
                <th>兩分球</th>
                <th>三分球</th>
                <th>罰球</th>
                <th>籃板</th>
                <th>助攻</th>
                <th>抄截</th>
                <th>阻攻</th>
                <th>失誤</th>
                <th>犯規</th>
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
      </div>`;
  }

  /* ════════════════════════════════
     單場比賽卡片
     ════════════════════════════════ */
  function buildGameCard(game, idx) {
    const hc = TEAM_CONFIG[game.homeTeam] || {};
    const ac = TEAM_CONFIG[game.awayTeam] || {};

    const hasTeams = game.homeTeam && game.awayTeam;
    const homeWin = game.hasScores && game.homeScore > game.awayScore;
    const awayWin = game.hasScores && game.awayScore > game.homeScore;

    const scoreHtml = game.hasScores
      ? `<span class="bs-gc-s ${hc.cls}">${game.homeScore}</span><span class="bs-gc-colon">:</span><span class="bs-gc-s ${ac.cls}">${game.awayScore}</span>`
      : `<span class="bs-gc-tbd">尚未開打</span>`;

    const teamHtml = hasTeams
      ? `${homeWin ? '<span class="gc-win">👑</span>' : ''}<span class="dot ${hc.dot}"></span><span class="${hc.cls}">${game.homeTeam}</span><span class="bs-gc-vs">VS</span>${awayWin ? '<span class="gc-win">👑</span>' : ''}<span class="dot ${ac.dot}"></span><span class="${ac.cls}">${game.awayTeam}</span>`
      : ``;

    const gameNum = game.gameNum || (idx + 1);
    const bodyId = `bs-body-${idx}`;

    return `
      <div class="bs-gc" data-idx="${idx}">
        <div class="bs-gc-head">
          <div class="bs-gc-stripe" style="background:${hc.color || 'var(--warm2)'}"></div>
          <div class="bs-gc-meta">
            <span class="bs-gc-num">GAME ${gameNum}</span>
          </div>
          <div class="bs-gc-matchup">${teamHtml}</div>
          <div class="bs-gc-score">${scoreHtml}</div>
          <div class="bs-gc-arr">▼</div>
        </div>
        <div class="bs-gc-body" id="${bodyId}"></div>
      </div>`;
  }

  /* ════════════════════════════════
     ESPN-style: Team Stats
     ════════════════════════════════ */
  function fgPctStr(miss, made) {
    const att = miss + made;
    return att > 0 ? Math.round(made / att * 100) + '%' : '—';
  }

  function teamStatsHtml(game) {
    const h = game.homeTot, a = game.awayTot;
    const hc = TEAM_CONFIG[game.homeTeam] || {};
    const ac = TEAM_CONFIG[game.awayTeam] || {};
    const rows = [
      { label: '兩分%',  hv: fgPctStr(h.fg2miss, h.fg2made), av: fgPctStr(a.fg2miss, a.fg2made), hRaw: h.fg2made / (h.fg2miss + h.fg2made || 1), aRaw: a.fg2made / (a.fg2miss + a.fg2made || 1) },
      { label: '三分%',  hv: fgPctStr(h.fg3miss, h.fg3made), av: fgPctStr(a.fg3miss, a.fg3made), hRaw: h.fg3made / (h.fg3miss + h.fg3made || 1), aRaw: a.fg3made / (a.fg3miss + a.fg3made || 1) },
      { label: '罰球%',  hv: fgPctStr(h.ftmiss,  h.ftmade),  av: fgPctStr(a.ftmiss,  a.ftmade),  hRaw: h.ftmade  / (h.ftmiss  + h.ftmade  || 1), aRaw: a.ftmade  / (a.ftmiss  + a.ftmade  || 1) },
      { label: '得分',   hv: h.pts,  av: a.pts,  hRaw: h.pts,  aRaw: a.pts  },
      { label: '籃板',   hv: h.treb, av: a.treb, hRaw: h.treb, aRaw: a.treb },
      { label: '進攻板', hv: h.oreb, av: a.oreb, hRaw: h.oreb, aRaw: a.oreb },
      { label: '防守板', hv: h.dreb, av: a.dreb, hRaw: h.dreb, aRaw: a.dreb },
      { label: '助攻',   hv: h.ast,  av: a.ast,  hRaw: h.ast,  aRaw: a.ast  },
      { label: '抄截',   hv: h.stl,  av: a.stl,  hRaw: h.stl,  aRaw: a.stl  },
      { label: '阻攻',   hv: h.blk,  av: a.blk,  hRaw: h.blk,  aRaw: a.blk  },
      { label: '失誤',   hv: h.tov,  av: a.tov,  hRaw: h.tov,  aRaw: a.tov,  lower: true },
      { label: '犯規',   hv: h.pf,   av: a.pf,   hRaw: h.pf,   aRaw: a.pf,   lower: true },
    ];
    const rowsHtml = rows.map(({ label, hv, av, hRaw, aRaw, lower }) => {
      const hBetter = lower ? hRaw < aRaw : hRaw > aRaw;
      const aBetter = lower ? aRaw < hRaw : aRaw > hRaw;
      return `<tr>
        <td class="bsi-val${hBetter ? ' bsi-win' : ''}">${hv}</td>
        <td class="bsi-label">${label}</td>
        <td class="bsi-val${aBetter ? ' bsi-win' : ''}">${av}</td>
      </tr>`;
    }).join('');
    return `
      <div class="bsi-section">
        <div class="bsi-title">Team Stats</div>
        <table class="bsi-ts-table">
          <thead><tr>
            <th class="${hc.cls} bsi-th">${game.homeTeam}隊</th>
            <th class="bsi-th-mid"></th>
            <th class="${ac.cls} bsi-th">${game.awayTeam}隊</th>
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
  }

  /* ════════════════════════════════
     ESPN-style: Game Leaders
     ════════════════════════════════ */
  function gameLeadersHtml(game) {
    const all = [
      ...game.homePlayers.filter(p => p.played),
      ...game.awayPlayers.filter(p => p.played),
    ];
    if (!all.length) return '';
    const topBy = key => all.reduce((best, p) => (!best || p[key] > best[key]) ? p : best, null);
    const topPts = topBy('pts');
    const topReb = topBy('treb');
    const topAst = topBy('ast');

    const card = (icon, label, player, key, unit) => {
      if (!player) return '';
      const tc = TEAM_CONFIG[player.team] || {};
      const style = tc.nameStyle ? ` style="${tc.nameStyle}"` : '';
      return `
        <div class="bsi-ldr-card">
          <div class="bsi-ldr-cat">${icon} ${label}</div>
          <div class="bsi-ldr-name"><span class="${tc.cls}"${style}>${player.name}</span></div>
          <div class="bsi-ldr-val">${player[key]}<span class="bsi-ldr-unit"> ${unit}</span></div>
        </div>`;
    };

    return `
      <div class="bsi-section">
        <div class="bsi-title">Game Leaders</div>
        <div class="bsi-ldr-grid">
          ${card('🏀', '得分', topPts, 'pts', 'pts')}
          ${card('💪', '籃板', topReb, 'treb', 'reb')}
          ${card('🎯', '助攻', topAst, 'ast', 'ast')}
        </div>
      </div>`;
  }

  /* ════════════════════════════════
     ESPN-style: Season Series
     ════════════════════════════════ */
  function computeH2H(homeTeam, awayTeam) {
    let homeWins = 0, awayWins = 0;
    if (!_data || !_data.weeks) return { homeWins, awayWins };
    for (const wk of _data.weeks) {
      for (const g of wk.games) {
        if (!g.hasScores) continue;
        if (g.homeTeam === homeTeam && g.awayTeam === awayTeam) {
          g.homeScore > g.awayScore ? homeWins++ : awayWins++;
        } else if (g.homeTeam === awayTeam && g.awayTeam === homeTeam) {
          g.homeScore > g.awayScore ? awayWins++ : homeWins++;
        }
      }
    }
    return { homeWins, awayWins };
  }

  function seasonSeriesHtml(homeTeam, awayTeam) {
    const { homeWins, awayWins } = computeH2H(homeTeam, awayTeam);
    if (homeWins + awayWins === 0) return '';
    const hc = TEAM_CONFIG[homeTeam] || {};
    const ac = TEAM_CONFIG[awayTeam] || {};
    const leading = homeWins > awayWins ? homeTeam : awayWins > homeWins ? awayTeam : null;
    const ltc = leading ? (TEAM_CONFIG[leading] || {}) : {};
    const seriesLabel = leading
      ? `<span class="${ltc.cls}">${leading}隊</span>本季領先`
      : '本季平局';
    return `
      <div class="bsi-section">
        <div class="bsi-title">Season Series</div>
        <div class="bsi-series-row">
          <div class="bsi-series-team">
            <div class="bsi-series-wins ${hc.cls}">${homeWins}</div>
            <div class="bsi-series-name ${hc.cls}">${homeTeam}隊</div>
          </div>
          <div class="bsi-series-mid">${seriesLabel}</div>
          <div class="bsi-series-team">
            <div class="bsi-series-wins ${ac.cls}">${awayWins}</div>
            <div class="bsi-series-name ${ac.cls}">${awayTeam}隊</div>
          </div>
        </div>
      </div>`;
  }

  /* ════════════════════════════════
     渲染展開的 boxscore 內容
     ════════════════════════════════ */
  function renderGameBody(game, bodyEl) {
    if (bodyEl.dataset.rendered) return;
    bodyEl.dataset.rendered = '1';

    const recorderHtml = game.recorder
      ? `<div class="bs-recorder">📝 記錄：${game.recorder}</div>`
      : '';

    const insightsHtml = game.hasScores ? `
      <div class="bsi-wrap">
        ${teamStatsHtml(game)}
        ${gameLeadersHtml(game)}
        ${seasonSeriesHtml(game.homeTeam, game.awayTeam)}
      </div>` : '';

    bodyEl.innerHTML = `
      ${recorderHtml}
      ${insightsHtml}
      ${teamBoxHtml(game.homeTeam, game.homePlayers, game.homeTot, game.homeScore, true)}
      <div class="bs-divider"></div>
      ${teamBoxHtml(game.awayTeam, game.awayPlayers, game.awayTot, game.awayScore, false)}`;
  }

  /* ════════════════════════════════
     渲染週次視圖
     ════════════════════════════════ */
  function renderWeekView() {
    if (!_data || _wkIdx < 0) return;
    const wk = _data.weeks[_wkIdx];
    const container = document.getElementById('bs-games');
    if (!container) return;

    updateHero(wk);
    updateNavButtons();

    if (!wk || !wk.games || !wk.games.length) {
      showEmpty(container, '本週尚無對戰數據');
      return;
    }

    // 依 gameNum 排序（未設場次的排後面）
    const sorted = [...wk.games].sort((a, b) => {
      if (!a.gameNum && !b.gameNum) return 0;
      if (!a.gameNum) return 1;
      if (!b.gameNum) return -1;
      return a.gameNum - b.gameNum;
    });

    // 熱身賽警告（若已進入例行賽或季後賽）
    const hasLaterPhase = _data.weeks.some(w => w.phase === '例行賽' || w.phase === '季後賽');
    const warnHtml = (wk.phase === '熱身賽' && hasLaterPhase)
      ? `<div class="bs-warn-banner">⚠️ 熱身賽數據不計入統計</div>`
      : '';

    container.innerHTML = warnHtml + sorted.map((g, i) => buildGameCard(g, i)).join('');

    // 事件委派：點擊卡片頭部展開/收合
    container.querySelectorAll('.bs-gc').forEach((card, i) => {
      const head = card.querySelector('.bs-gc-head');
      head.addEventListener('click', () => {
        const isOpen = card.classList.toggle('open');
        if (isOpen) {
          const bodyEl = card.querySelector('.bs-gc-body');
          renderGameBody(sorted[i], bodyEl);
        }
      });
    });
  }

  /* ════════════════════════════════
     Hero 區塊
     ════════════════════════════════ */
  function updateHero(wk) {
    const el = document.getElementById('bs-hero-content');
    if (!el || !wk) return;
    const relWeek = getPhaseRelativeWeek(wk);
    const label = `${wk.phase} · 第 ${relWeek} 週`;
    el.innerHTML = `
      <div class="sched-hero-left">
        <div class="eyebrow" style="color:var(--orange2);margin-bottom:.4rem">第 ${_data.season} 屆</div>
        <h2 style="font-size:1.8rem;margin-bottom:0">${label}</h2>
      </div>`;
  }

  /* ════════════════════════════════
     導航按鈕
     ════════════════════════════════ */
  function updateNavButtons() {
    const prev = document.getElementById('btn-prev-week');
    const next = document.getElementById('btn-next-week');
    const label = document.getElementById('wk-label');
    const total = _data.weeks.length;

    if (prev) prev.style.visibility = (_wkIdx <= 0) ? 'hidden' : '';
    if (next) next.style.visibility = (_wkIdx >= total - 1) ? 'hidden' : '';

    if (label && _data.weeks[_wkIdx]) {
      const wk = _data.weeks[_wkIdx];
      const relWeek = getPhaseRelativeWeek(wk);
      label.textContent = `${wk.phase} · 第 ${relWeek} 週`;
    }
  }

  function navigateWeek(dir) {
    if (!_data) return;
    const newIdx = _wkIdx + (dir === 'prev' ? -1 : 1);
    if (newIdx < 0 || newIdx >= _data.weeks.length) return;
    _wkIdx = newIdx;
    renderWeekView();
  }

  /* ════════════════════════════════
     載入資料
     ════════════════════════════════ */
  async function loadBoxscore() {
    const container = document.getElementById('bs-games');
    showLoading(container);

    try {
      _data = await api.getBoxscore();
      if (!_data || !_data.weeks || !_data.weeks.length) {
        showEmpty(container, '目前尚無對戰數據');
        return;
      }

      // 檢查 URL 深層連結
      const params = new URLSearchParams(location.search);
      const dlPhase   = params.get('phase');
      const dlRelWeek = parseInt(params.get('relweek')) || 0;
      const dlGame    = parseInt(params.get('game'))    || 0;

      if (dlPhase && dlRelWeek) {
        const idx = _data.weeks.findIndex(w =>
          w.phase === dlPhase && getPhaseRelativeWeek(w) === dlRelWeek
        );
        _wkIdx = idx >= 0 ? idx : _data.defaultIdx;
      } else {
        _wkIdx = _data.defaultIdx;
      }

      renderWeekView();

      // 自動展開指定場次
      if (dlGame && dlPhase && dlRelWeek) {
        requestAnimationFrame(() => {
          const wk = _data.weeks[_wkIdx];
          if (!wk) return;
          const sorted = [...wk.games].sort((a, b) => {
            if (!a.gameNum && !b.gameNum) return 0;
            if (!a.gameNum) return 1;
            if (!b.gameNum) return -1;
            return a.gameNum - b.gameNum;
          });
          const gameIdx = sorted.findIndex(g => g.gameNum === dlGame);
          if (gameIdx < 0) return;
          const cards = document.querySelectorAll('#bs-games .bs-gc');
          if (!cards[gameIdx]) return;
          const card = cards[gameIdx];
          card.classList.add('open');
          renderGameBody(sorted[gameIdx], card.querySelector('.bs-gc-body'));
          setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
        });
      }
    } catch (err) {
      console.error('載入對戰數據失敗:', err);
      showError(container, '數據載入失敗，請稍後重試', 'loadBoxscore');
    }
  }

  /* 暴露全域 */
  window.loadBoxscore = loadBoxscore;

  /* 事件綁定 */
  document.addEventListener('DOMContentLoaded', () => {
    const prev = document.getElementById('btn-prev-week');
    const next = document.getElementById('btn-next-week');
    if (prev) prev.addEventListener('click', () => navigateWeek('prev'));
    if (next) next.addEventListener('click', () => navigateWeek('next'));
  });
})();
