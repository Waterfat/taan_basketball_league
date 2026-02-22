/* ══════════════════════════════════
   PAGE: ROTATION — 輪值排班
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showEmpty)
   依賴：js/api.js (api.getRotation)
   資料：data/rotation.json
══════════════════════════════════ */

(function() {
  'use strict';

  /* ── 渲染出席狀況 + 請假名單 ── */
  function renderAttendance(data) {
    const absent = data.absentees || [];
    const chipsHtml = absent.map(n => `<span class="abs-chip">${n}</span>`).join('');

    return `
      <div class="card mb" style="padding:1.1rem 1.3rem">
        <div class="row between mb-sm" style="margin-bottom:.65rem">
          <div class="label" style="margin:0">本週出席狀況</div>
          <div class="cond fs-sm"><span style="color:var(--green)">✅ 出席 ${data.attendance.present} 人</span> <span class="txt3">/ 請假 ${data.attendance.absent} 人</span></div>
        </div>
        <div class="label" style="margin-bottom:.45rem">請假名單</div>
        <div class="abs-row">${chipsHtml}</div>
      </div>`;
  }

  /* ── 渲染輪值分配卡片 ── */
  function renderAssignments(assignments) {
    return `
      <div class="label">本週輪值分配</div>
      <div class="rot-grid mb">
        ${assignments.map(a => {
          const bonusHtml = a.bonus
            ? ` <span style="color:var(--orange);font-size:.6rem">✦${a.bonus}</span>`
            : '';
          const staffHtml = a.staff.map(s => {
            const tc = TEAM_CONFIG[s.team] || {};
            return `<div class="rot-p"><span class="dot ${tc.dot}"></span><span class="rot-p-name">${s.name}(${s.team})</span><span class="badge bk">${s.count}次</span></div>`;
          }).join('');

          return `<div class="rot-card"><div class="rot-role">${a.icon} ${a.role}${bonusHtml}</div>${staffHtml}</div>`;
        }).join('')}
      </div>`;
  }

  /* ── 渲染累積輪值排行 ── */
  function renderCumulativeRanking(ranking) {
    const rows = ranking.map(r => {
      const tc = TEAM_CONFIG[r.team] || {};
      const isFirst = r.rank === 1;
      return `<tr>
        <td><span class="srank${isFirst ? ' gold' : ''}">${r.rank}</span></td>
        <td>${isFirst ? '<strong>' : ''}${r.name}${isFirst ? '</strong>' : ''}</td>
        <td><span class="${tc.cls}">${r.team}</span></td>
        <td>${r.referee}</td><td>${r.court}</td><td>${r.photo}</td><td>${r.equip}</td><td>${r.data}</td>
        <td><span class="sval">${r.total}</span></td>
      </tr>`;
    }).join('');

    return `
      <div class="label">累積輪值次數排行</div>
      <div class="card" style="overflow-x:auto">
        <table class="stat-table">
          <thead><tr><th>#</th><th>球員</th><th>隊伍</th><th>裁判</th><th>場務</th><th>攝影</th><th>器材</th><th>數據</th><th>合計</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  /* ── 主渲染 ── */
  function renderRotation(data) {
    const container = document.getElementById('rotation-content');
    if (!data) { showEmpty(container, '目前無輪值資料'); return; }

    container.innerHTML =
      renderAttendance(data) +
      renderAssignments(data.assignments) +
      renderCumulativeRanking(data.cumulativeRanking);
  }

  /* ── Fetch & Init ── */
  async function loadRotation() {
    const container = document.getElementById('rotation-content');
    showLoading(container);

    try {
      const data = await api.getRotation();
      renderHero('hero-container', {
        title: '輪值排班',
        subtitle: '系統依累積次數自動分配 · 領隊標注請假後每週五產出',
        heroClass: 'rot-hero',
        heroType: 'simple'
      });
      renderRotation(data);
    } catch (err) {
      console.error('載入輪值資料失敗:', err);
      showError(container, '輪值資料載入失敗，請稍後再試', 'loadRotation');
    }
  }

  window.loadRotation = loadRotation;

  document.addEventListener('DOMContentLoaded', loadRotation);
})();
