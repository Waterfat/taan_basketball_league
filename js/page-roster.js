/* ══════════════════════════════════
   PAGE: ROSTER — 球員名單
   依賴：shared-app.js (TEAM_BY_ID, showLoading, showError, showEmpty)
   依賴：js/api.js (api.getRoster)
   資料：data/roster.json
══════════════════════════════════ */

(function() {
  'use strict';

  let _weeks = [];
  let _teams = [];

  /* ── Attendance cell renderer ── */
  function attCell(val) {
    if (val === 1)   return '<span class="att-cell att-1">1</span>';
    if (val === 0)   return '<span class="att-cell att-0">0</span>';
    if (val === 'x') return '<span class="att-cell att-x">✕</span>';
    return                  '<span class="att-cell att-q">?</span>';
  }

  /* ── Count attendance ── */
  function countAtt(att) {
    const done = att.filter(v => v !== '?').length;
    const present = att.filter(v => v === 1).length;
    return { present, done, pct: done ? Math.round(present / done * 100) : 0 };
  }

  /* ── Build a team block ── */
  function buildTeamBlock(team) {
    const cfg = TEAM_BY_ID[team.id] || {};
    const totalPlayers = team.players.length;

    let thead = `<thead><tr><th rowspan="2" style="text-align:left;padding-left:1rem;min-width:90px;">球員</th>`;
    _weeks.forEach((w, i) => {
      const sepClass = i > 0 ? ' week-sep' : '';
      thead += `<th class="wk-group${sepClass}" colspan="1" style="min-width:34px">
        <div style="font-family:var(--font-cond);font-size:.58rem;font-weight:800;letter-spacing:.05em">${w.date}</div>
      </th>`;
    });
    thead += `<th rowspan="2" class="week-sep" style="min-width:52px;white-space:nowrap">出席</th></tr><tr class="sub-head">`;
    _weeks.forEach((w, i) => {
      const sepClass = i > 0 ? ' class="week-sep"' : '';
      thead += `<td${sepClass} style="font-family:var(--font-cond);font-size:.58rem;color:var(--txt-light);padding:.2rem .4rem;text-align:center;background:var(--warm1);border-bottom:2px solid var(--warm2)">${w.label}</td>`;
    });
    thead += '</tr></thead>';

    let tbody = '<tbody>';
    team.players.forEach(player => {
      const { present, done, pct } = countAtt(player.att);
      tbody += `<tr class="${cfg.rowClass || ''}"><td><span class="pl-name" style="color:${cfg.textColor || ''}">${player.name}</span></td>`;
      player.att.forEach((v, i) => {
        const sepStyle = i > 0 ? ' style="border-left:1px solid var(--warm1)"' : '';
        tbody += `<td${sepStyle}>${attCell(v)}</td>`;
      });
      const pctColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? '#b38f00' : 'var(--red)';
      tbody += `<td class="week-sep"><span class="att-pct" style="color:${pctColor}">${pct}%</span><span class="att-summary">${present}/${done}</span></td></tr>`;
    });
    tbody += '</tbody>';

    const totalPresent = team.players.reduce((acc, p) => acc + p.att.filter(v => v === 1).length, 0);
    const totalDone = team.players.reduce((acc, p) => acc + p.att.filter(v => v !== '?').length, 0);
    const teamPct = totalDone ? Math.round(totalPresent / totalDone * 100) : 0;
    const pctColor = teamPct >= 70 ? 'var(--green)' : teamPct >= 50 ? '#b38f00' : 'var(--red)';
    const displayColor = cfg.color === '#b38f00' ? '#e6b800' : (cfg.color || '');

    return `
      <div class="team-block" data-team="${team.id}">
        <div class="team-block-head">
          <div class="tb-bar" style="background:${cfg.barColor || ''}"></div>
          <div class="tb-name" style="color:${displayColor}">${team.name}</div>
          <div class="tb-count">${totalPlayers} 名球員</div>
          <div class="tb-pct" style="color:${pctColor}">${teamPct}%</div>
        </div>
        <div class="att-wrap">
          <table class="att-table">
            <colgroup><col class="col-name">${_weeks.map(() => '<col>').join('')}<col class="col-sum"></colgroup>
            ${thead}${tbody}
          </table>
        </div>
      </div>`;
  }

  /* ── Render all teams ── */
  function renderRoster(filterTeamId) {
    if (typeof filterTeamId === 'undefined') filterTeamId = 'all';
    const container = document.getElementById('roster-list');
    if (!_teams.length) { showEmpty(container, '目前無球員名單資料'); return; }

    let html = '';
    _teams.forEach(team => {
      if (filterTeamId !== 'all' && team.id !== filterTeamId) return;
      html += buildTeamBlock(team);
    });
    container.innerHTML = html;
  }

  /* ── Team filter ── */
  function filterTeam(el, teamId) {
    document.querySelectorAll('.tf-chip').forEach(c => {
      c.classList.remove('active');
      c.style.borderColor = '';
      c.style.color = '';
      c.style.background = '#fff';
    });
    el.classList.add('active');

    if (teamId === 'all') {
      el.style.background  = 'var(--orange)';
      el.style.color       = '#fff';
      el.style.borderColor = 'var(--orange)';
    } else {
      const cfg = TEAM_BY_ID[teamId];
      if (cfg) {
        el.style.background  = cfg.color;
        el.style.color       = '#fff';
        el.style.borderColor = cfg.color;
      }
    }
    renderRoster(teamId);
  }

  /* ── Fetch & Init ── */
  async function loadRoster() {
    const container = document.getElementById('roster-list');
    showLoading(container);

    try {
      const data = await api.getRoster();
      _weeks = data.weeks || [];
      _teams = data.teams || [];
      renderRoster('all');
    } catch (err) {
      console.error('載入 roster 資料失敗:', err);
      showError(container, '名單資料載入失敗，請稍後再試', 'loadRoster');
    }
  }

  // 暴露全域（供 HTML onclick 和 retry 呼叫）
  window.loadRoster = loadRoster;
  window.filterTeam = filterTeam;

  document.addEventListener('DOMContentLoaded', loadRoster);
})();
