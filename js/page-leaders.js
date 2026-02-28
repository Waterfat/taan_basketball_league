/* ══════════════════════════════════
   PAGE: LEADERS — 領先榜
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, renderHero)
   依賴：js/api.js (api.getLeaders)
   資料：datas!D212:N224, D227:K234, D237:K244, D247:K254
══════════════════════════════════ */

(function () {
  'use strict';

  const MEDALS = ['🥇', '🥈', '🥉'];

  /* 嘗試解析數字 */
  function asNum(val) {
    const n = parseFloat(String(val || '').replace(/,/g, ''));
    return isNaN(n) ? null : n;
  }

  /* 從儲存格辨識隊名（支援 "黃", "黃隊", "黃偉訓(黃)" 格式） */
  function detectTeam(cell) {
    if (!cell) return null;
    const s = String(cell).trim();
    // 直接隊名
    const direct = s.replace(/隊$/, '');
    if (TEAM_CONFIG[direct]) return direct;
    // 括號內隊名：姓名(黃)
    const m = s.match(/\(([^)]+)\)$/);
    if (m) {
      const inner = m[1].trim();
      if (TEAM_CONFIG[inner]) return inner;
    }
    return null;
  }

  /* 套用隊伍色的 span */
  function teamSpan(val) {
    const team = detectTeam(val);
    if (!team) return val;
    const tc = TEAM_CONFIG[team];
    const style = tc.nameStyle ? ` style="${tc.nameStyle}"` : '';
    return `<span class="${tc.cls}"${style}>${val}</span>`;
  }

  /* 找出每欄數值最大的 row index（給 ldr-best 用） */
  function findBestPerCol(rows, skipCols) {
    const best = {};
    const skip = new Set(skipCols);
    const colCount = Math.max(...rows.map(r => r.length));
    for (let c = 0; c < colCount; c++) {
      if (skip.has(c)) continue;
      let bestVal = -Infinity, bestRow = -1;
      rows.forEach((row, ri) => {
        const n = asNum(row[c]);
        if (n !== null && n > bestVal) { bestVal = n; bestRow = ri; }
      });
      if (bestRow >= 0 && bestVal > 0) best[c] = bestRow;
    }
    return best;
  }

  /* ── 個人領先榜 ── */
  function renderIndividualLeaders(section) {
    const { headers, rows } = section;
    if (!rows.length) return '';

    const colCount = Math.max(headers.length, ...rows.map(r => r.length));

    // 自動偵測排名欄（值為 1, 2, 3…）
    let rankCol = -1;
    for (let c = 0; c < colCount && rankCol < 0; c++) {
      const vals = rows.slice(0, Math.min(4, rows.length)).map(r => parseInt(r[c]));
      if (vals.every((v, i) => v === i + 1)) rankCol = c;
    }

    // 自動偵測隊伍欄
    let teamCol = -1;
    for (let c = 0; c < colCount && teamCol < 0; c++) {
      if (rows.some(r => detectTeam(r[c]))) teamCol = c;
    }

    const skipCols = new Set([rankCol, teamCol].filter(c => c >= 0));
    const bestPerCol = findBestPerCol(rows, [...skipCols]);

    // 標題列
    const theadHtml = headers.map((h, i) => {
      if (i === rankCol) return `<th class="ldr-th ldr-th-rank">#</th>`;
      const isNum = i > Math.max(rankCol, teamCol >= 0 ? teamCol : -1);
      return `<th class="ldr-th${isNum ? ' ldr-th-num' : ''}">${h}</th>`;
    }).join('');

    // 資料列
    const tbodyHtml = rows.map((row, ri) => {
      const rankRaw = rankCol >= 0 ? parseInt(row[rankCol]) : ri + 1;
      const rank = isNaN(rankRaw) ? ri + 1 : rankRaw;
      const rankDisplay = rank <= 3 ? MEDALS[rank - 1] : rank;
      const isTop3 = rank <= 3;

      // 隊伍色
      let rowTeam = teamCol >= 0 ? detectTeam(row[teamCol]) : null;
      if (!rowTeam) { for (const c of row) { rowTeam = detectTeam(c); if (rowTeam) break; } }
      const tc = rowTeam ? (TEAM_CONFIG[rowTeam] || {}) : {};

      const borderColor = tc.color || 'transparent';
      const bgColor = isTop3 && tc.bg ? tc.bg : (tc.bg ? tc.bg.replace(/[\d.]+\)$/, '.07)') : '');
      const rowStyle = `border-left:3px solid ${borderColor}${bgColor ? `;background:${bgColor}` : ''}`;

      const cells = Array.from({ length: colCount }, (_, ci) => {
        const val = row[ci] || '';
        if (ci === rankCol) {
          return `<td class="ldr-td ldr-td-rank${isTop3 ? ' ldr-medal' : ''}">${rankDisplay}</td>`;
        }
        if (ci === teamCol) {
          return `<td class="ldr-td ldr-td-team">${teamSpan(val)}</td>`;
        }
        const isBest = bestPerCol[ci] === ri;
        const isNumericCol = ci > Math.max(rankCol, teamCol >= 0 ? teamCol : -1);
        if (isNumericCol) {
          return `<td class="ldr-td ldr-td-num${isBest ? ' ldr-best' : ''}">${val}</td>`;
        }
        return `<td class="ldr-td">${teamSpan(val)}</td>`;
      }).join('');

      return `<tr style="${rowStyle}">${cells}</tr>`;
    }).join('');

    return `
      <div class="label" style="margin-top:1.2rem">🏅 本季個人領先榜</div>
      <div class="card" style="overflow:hidden;padding:0">
        <div class="ldr-table-wrap">
          <table class="ldr-table">
            <thead><tr>${theadHtml}</tr></thead>
            <tbody>${tbodyHtml}</tbody>
          </table>
        </div>
      </div>`;
  }

  /* ── 隊伍統計表 ── */
  function renderTeamTable(emoji, title, section) {
    const { headers, rows } = section;
    if (!rows.length) return '';

    const colCount = Math.max(headers.length, ...rows.map(r => r.length));

    // 找隊伍欄
    let teamCol = 0;
    for (let c = 0; c < colCount; c++) {
      if (rows.some(r => detectTeam(r[c]))) { teamCol = c; break; }
    }

    const bestPerCol = findBestPerCol(rows, [teamCol]);

    const theadHtml = headers.map((h, i) => {
      const isNum = i !== teamCol;
      return `<th class="ldr-th${isNum ? ' ldr-th-num' : ''}">${h}</th>`;
    }).join('');

    const tbodyHtml = rows.map((row, ri) => {
      const team = detectTeam(row[teamCol]);
      const tc = team ? (TEAM_CONFIG[team] || {}) : {};
      const borderColor = tc.color || 'transparent';
      const bgColor = tc.bg ? tc.bg.replace(/[\d.]+\)$/, '.08)') : '';
      const rowStyle = `border-left:3px solid ${borderColor}${bgColor ? `;background:${bgColor}` : ''}`;

      const cells = Array.from({ length: colCount }, (_, ci) => {
        const val = row[ci] || '';
        if (ci === teamCol) {
          return `<td class="ldr-td ldr-td-team">${teamSpan(val)}</td>`;
        }
        const isBest = bestPerCol[ci] === ri;
        return `<td class="ldr-td ldr-td-num${isBest ? ' ldr-best' : ''}">${val}</td>`;
      }).join('');

      return `<tr style="${rowStyle}">${cells}</tr>`;
    }).join('');

    return `
      <div class="label" style="margin-top:1.2rem">${emoji} ${title}</div>
      <div class="card" style="overflow:hidden;padding:0">
        <div class="ldr-table-wrap">
          <table class="ldr-table">
            <thead><tr>${theadHtml}</tr></thead>
            <tbody>${tbodyHtml}</tbody>
          </table>
        </div>
      </div>`;
  }

  /* ── Fetch & Render ── */
  async function loadLeaders() {
    const container = document.getElementById('leaders-content');
    showLoading(container);

    renderHero('leaders-hero', {
      title: '領先榜',
      subtitle: `第 ${ApiConfig.currentSeason} 屆本季數據`,
      heroClass: 'sched-hero',
    });

    try {
      const data = await api.getLeaders();

      let html = '';
      html += renderIndividualLeaders(data.leaders);
      html += renderTeamTable('⚔️', '隊伍進攻數據', data.offense);
      html += renderTeamTable('🛡️', '隊伍防守數據', data.defense);
      html += renderTeamTable('📈', '進攻 − 防守差值', data.net);

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
