/* ══════════════════════════════════
   PAGE: STANDINGS — 戰績榜
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showEmpty)
   依賴：js/api.js (api.getStandings)
   資料：data/standings.json
══════════════════════════════════ */

(function() {
  'use strict';

  /* ── 渲染排名總表 ── */
  function renderRankTable(teams) {
    const tbody = teams.map(t => {
      const tc = TEAM_CONFIG[t.team] || {};
      const pctCls = parseFloat(t.pct) >= 60 ? ' class="pct-g"' : (parseFloat(t.pct) < 30 ? ' class="pct-b"' : '');
      const badgeCls = t.streakType === 'win' ? 'bw' : 'bl';

      // 近況 W/L dots
      const histHtml = (t.history || []).map((h, i) => {
        const isLast = i === t.history.length - 1;
        const cls = h === 'W' ? 'wl-dot wl-w' : 'wl-dot wl-l';
        return `<span class="${cls}${isLast ? ' wl-latest' : ''}">${h === 'W' ? '○' : '✕'}</span>`;
      }).join('');

      return `<tr>
        <td><div class="st-team"><span class="st-rank">${t.rank}</span><span class="dot ${tc.dot}"></span><span class="${tc.cls}">${t.name}</span></div></td>
        <td>${t.wins}</td><td>${t.losses}</td>
        <td${pctCls}>${t.pct}</td>
        <td><div class="st-hist">${histHtml}</div></td>
        <td><span class="badge ${badgeCls}">${t.streak}</span></td>
      </tr>`;
    }).join('');

    return `<table class="st-table">
      <thead><tr><th>名次</th><th>勝</th><th>敗</th><th>勝率</th><th>近況</th><th>連</th></tr></thead>
      <tbody>${tbody}</tbody>
    </table>`;
  }

  /* ── 渲染對戰矩陣 ── */
  function renderMatrix(matrix) {
    const { teams, results } = matrix;
    const thead = '<tr><th></th>' + teams.map(t => `<th>${t}</th>`).join('') + '</tr>';
    const tbody = teams.map((t, ri) => {
      const tc = TEAM_CONFIG[t] || {};
      const cells = results[ri].map((val, ci) => {
        if (val === null) return '<td class="self">—</td>';
        if (val > 0) return `<td class="tg">+${val}</td>`;
        if (val < 0) return `<td class="tb">${val}</td>`;
        return `<td>0</td>`;
      }).join('');
      return `<tr><td class="fw7 ${tc.cls}">${t}</td>${cells}</tr>`;
    }).join('');

    return `<table class="matrix" style="min-width:380px">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>`;
  }

  /* ── 主渲染 ── */
  function renderStandings(data) {
    const container = document.getElementById('standings-content');
    if (!data || !data.teams || !data.teams.length) {
      showEmpty(container, '目前無戰績資料');
      return;
    }

    container.innerHTML = `
      <div class="card mb">
        <div style="padding:1rem 1.2rem .4rem"><div class="label">排名總表</div></div>
        ${renderRankTable(data.teams)}
      </div>
      <div class="mb">
        <div class="label">對戰勝敗矩陣</div>
        <div class="card" style="overflow-x:auto">
          ${renderMatrix(data.matrix)}
        </div>
      </div>`;
  }

  /* ── Fetch & Init ── */
  async function loadStandings() {
    const container = document.getElementById('standings-content');
    showLoading(container);

    try {
      const data = await api.getStandings();
      renderHero('hero-container', {
        title: '戰績榜',
        subtitle: `第 ${data.season} 屆 · ${data.phase}第 ${data.currentWeek} 週現況`,
        heroClass: 'standings-hero',
        heroType: 'simple'
      });
      renderStandings(data);
    } catch (err) {
      console.error('載入戰績資料失敗:', err);
      showError(container, '戰績資料載入失敗，請稍後再試', 'loadStandings');
    }
  }

  // 暴露全域（供 retry 按鈕呼叫）
  window.loadStandings = loadStandings;

  document.addEventListener('DOMContentLoaded', loadStandings);
})();
