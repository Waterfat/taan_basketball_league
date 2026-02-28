/* ══════════════════════════════════
   PAGE: LEADERS — 領先榜
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, renderHero)
   依賴：js/api.js (api.getLeaders)
   資料：datas!D212:N224, D227:K234, D237:K244, D247:K254
══════════════════════════════════ */

(function () {
  'use strict';

  /* 嘗試從儲存格值辨識隊名（支援 "黃" 或 "黃隊"） */
  function detectTeam(cell) {
    if (!cell) return null;
    const t = cell.trim().replace(/隊$/, '');
    return TEAM_CONFIG[t] ? t : null;
  }

  /* 單一儲存格 HTML（自動套用隊伍色） */
  function cellHtml(val, isFirst) {
    const team = detectTeam(val);
    if (!team) return `<span>${val}</span>`;
    const tc = TEAM_CONFIG[team];
    const style = tc.nameStyle ? ` style="${tc.nameStyle}"` : '';
    return `<span class="${tc.cls}"${style}>${val}</span>`;
  }

  /* 渲染一個 section 的表格 */
  function renderTable(section) {
    const { headers, rows } = section;
    if (!rows.length && !headers.length) {
      return '<p style="color:var(--txt-light);padding:1rem 1.1rem;font-size:.85rem">尚無資料</p>';
    }

    const colCount = Math.max(headers.length, ...rows.map(r => r.length));

    const theadHtml = `<tr>${headers.map(h => `<th class="ldr-th">${h}</th>`).join('')}</tr>`;

    const tbodyHtml = rows.map(row => {
      // 找出這一列的代表隊伍（首個可辨識的隊名）用於背景色
      let rowTeam = null;
      for (const c of row) {
        rowTeam = detectTeam(c);
        if (rowTeam) break;
      }
      const bg = rowTeam ? ` style="background:${TEAM_CONFIG[rowTeam].bg}"` : '';

      const tds = Array.from({ length: colCount }, (_, i) => {
        const val = row[i] || '';
        return `<td class="ldr-td">${cellHtml(val)}</td>`;
      });
      return `<tr${bg}>${tds.join('')}</tr>`;
    }).join('');

    return `
      <div class="ldr-table-wrap">
        <table class="ldr-table">
          <thead>${theadHtml}</thead>
          <tbody>${tbodyHtml}</tbody>
        </table>
      </div>`;
  }

  /* 渲染一個 section card */
  function renderSection(emoji, title, section) {
    if (!section || (!section.rows.length && !section.headers.length)) return '';
    return `
      <div class="label" style="margin-top:1.2rem">${emoji} ${title}</div>
      <div class="card" style="overflow:hidden;padding:0">
        ${renderTable(section)}
      </div>`;
  }

  /* Fetch & Render */
  async function loadLeaders() {
    const container = document.getElementById('leaders-content');
    showLoading(container);

    // Hero
    renderHero('leaders-hero', {
      title: '領先榜',
      subtitle: `第 ${ApiConfig.currentSeason} 屆本季數據`,
      heroClass: 'sched-hero',
    });

    try {
      const data = await api.getLeaders();

      let html = '';
      html += renderSection('🏅', '本季個人領先榜', data.leaders);
      html += renderSection('⚔️', '隊伍進攻數據', data.offense);
      html += renderSection('🛡️', '隊伍防守數據', data.defense);
      html += renderSection('📈', '進攻 − 防守差值', data.net);

      container.innerHTML = html ||
        '<div class="state-msg"><span>📋 尚無領先榜資料</span></div>';
    } catch (err) {
      console.error('載入領先榜失敗:', err);
      showError(container, '資料載入失敗，請稍後再試', 'loadLeaders');
    }
  }

  window.loadLeaders = loadLeaders;

  document.addEventListener('DOMContentLoaded', loadLeaders);
})();
