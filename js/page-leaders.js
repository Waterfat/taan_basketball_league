/* ══════════════════════════════════
   PAGE: LEADERS — 領先榜
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, renderHero)
   依賴：js/api.js (api.getLeaders)
   資料：datas!D212:N224, D227:K234, D237:K244, D247:K254
══════════════════════════════════ */

(function () {
  'use strict';

  /* ── 工具函式 ── */
  function asNum(val) {
    const n = parseFloat(String(val || '').replace(/,/g, '').replace(/%$/, ''));
    return isNaN(n) ? null : n;
  }

  /* 從儲存格辨識隊名（支援 "黃", "黃隊", "黃偉訓(黃)", "黃偉訓(黃隊)" 格式） */
  function detectTeam(cell) {
    if (!cell) return null;
    const s = String(cell).trim();
    const norm = s.replace(/隊$/, '');
    if (TEAM_CONFIG[norm]) return norm;
    const m = s.match(/\(([^)]+)\)?$/);
    if (m) {
      const raw = m[1].trim();
      const normRaw = raw.replace(/隊$/, '');
      if (TEAM_CONFIG[normRaw]) return normRaw;
      if (TEAM_CONFIG[raw]) return raw;
    }
    return null;
  }

  /* 解析球員姓名 + 隊伍：把 "(" 及右方字串全部去掉 */
  function parsePlayer(cell) {
    if (!cell) return { name: '', team: '' };
    const s = String(cell).trim();
    const name = s.replace(/\(.*$/, '').trim();
    const team = detectTeam(s) || '';
    return { name: name || s, team };
  }

  /* 名字 span（套隊伍色） */
  function nameSpan(name, team) {
    if (!team || !TEAM_CONFIG[team]) return name;
    const tc = TEAM_CONFIG[team];
    const style = tc.nameStyle ? ` style="${tc.nameStyle}"` : '';
    return `<span class="${tc.cls}"${style}>${name}</span>`;
  }

  /* 找出每欄最佳值的 row index */
  function findBestPerCol(rows, skipCols) {
    const skip = new Set(skipCols);
    const best = {};
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

  /* ════════════════════════════════
     個人領先榜 — 每行一種數據類別
     Sheets 格式：
       row[0] = ["", "1", "2", ... "10"]      ← 排名
       row[1] = ["平均得分", "姓名(隊\n數值", ...]
       row[2] = ["平均籃板", "姓名(隊\n數值", ...]
     每格 = "球員名(隊色\n數值"
     ════════════════════════════════ */
  function renderIndividualLeaders(section) {
    const { rows } = section;
    if (!rows || !rows.length) return '';

    /* 跳過排名列（第一列全為數字 1,2,3…） */
    const statRows = rows.filter(row => {
      const label = (row[0] || '').trim();
      if (!label) return false;
      /* 排名列：row[0] 為空，row[1..] 為 1,2,3… */
      return !/^\d+$/.test(label);
    });

    if (!statRows.length) return '';

    /* 解析單一 cell："姓名(隊色\n數值" */
    function parseCell(cell) {
      if (!cell) return null;
      const s = String(cell).trim();
      if (!s) return null;
      const lines = s.split('\n');
      const nameTeam = (lines[0] || '').trim();
      const val = lines.length > 1 ? (lines[1] || '').trim() : '';
      if (!nameTeam) return null;
      const name = nameTeam.replace(/\(.*$/, '').trim();
      const team = detectTeam(nameTeam) || '';
      return { name, team, val };
    }

    const MEDALS = ['🥇', '🥈', '🥉'];

    const cards = statRows.map((row, cardIdx) => {
      const label = (row[0] || '').trim();

      /* 解析排名球員（col 1 起） */
      const players = [];
      for (let c = 1; c < row.length; c++) {
        const p = parseCell(row[c]);
        if (p) players.push(p);
      }
      if (!players.length) return '';

      const top3 = players.slice(0, 3);
      const rest = players.slice(3);

      const makeRow = (p, rank, extraCls) => {
        const tc = TEAM_CONFIG[p.team] || {};
        const borderColor = tc.color || 'transparent';
        const rankLabel = rank < 3 ? MEDALS[rank] : rank + 1;
        return `
          <div class="ldr-cr${extraCls}" style="border-left:3px solid ${borderColor}">
            <span class="ldr-cr-rank${rank < 3 ? ' ldr-cr-medal' : ''}">${rankLabel}</span>
            <span class="ldr-cr-name">${nameSpan(p.name, p.team)}</span>
            <span class="ldr-cr-val">${p.val || '—'}</span>
          </div>`;
      };

      const top3Html = top3.map((p, i) => makeRow(p, i, ' ldr-cr-top')).join('');
      const moreId = `ldr-more-${cardIdx}`;
      const restHtml = rest.length
        ? `<div class="ldr-more" id="${moreId}">${rest.map((p, i) => makeRow(p, i + 3, '')).join('')}</div>
           <button class="ldr-more-btn" data-target="${moreId}">詳細 ▼</button>`
        : '';

      return `
        <div class="ldr-card">
          <div class="ldr-card-title">${label}</div>
          ${top3Html}
          ${restHtml}
        </div>`;
    }).filter(Boolean).join('');

    return `
      <div class="ldr-section">
        <div class="label">🏅 本季個人領先榜</div>
        <div class="ldr-cards-grid">${cards}</div>
      </div>`;
  }

  /* ════════════════════════════════
     隊伍統計表（進攻/防守/差值）
     ════════════════════════════════ */
  function renderTeamTable(emoji, title, section) {
    const { headers, rows } = section;
    if (!rows.length) return '';

    const colCount = Math.max(headers.length, ...rows.map(r => r.length));

    let teamCol = 0;
    for (let c = 0; c < colCount; c++) {
      if (rows.some(r => detectTeam(r[c]))) { teamCol = c; break; }
    }

    const bestPerCol = findBestPerCol(rows, [teamCol]);

    const theadHtml = headers.map((h, i) =>
      `<th class="ldr-th${i !== teamCol ? ' ldr-th-num' : ''}">${h}</th>`
    ).join('');

    const tbodyHtml = rows.map((row, ri) => {
      const team = detectTeam(row[teamCol]);
      const tc = team ? (TEAM_CONFIG[team] || {}) : {};
      const borderColor = tc.color || 'transparent';
      const bg = tc.bg ? tc.bg.replace(/[\d.]+\)$/, '.08)') : '';
      const rowStyle = `border-left:3px solid ${borderColor}${bg ? `;background:${bg}` : ''}`;

      const cells = Array.from({ length: colCount }, (_, ci) => {
        const val = row[ci] || '';
        if (ci === teamCol) {
          const t2 = detectTeam(val);
          const tc2 = t2 ? (TEAM_CONFIG[t2] || {}) : {};
          const style2 = tc2.nameStyle ? ` style="${tc2.nameStyle}"` : '';
          const span = t2 ? `<span class="${tc2.cls}"${style2}>${val}</span>` : val;
          return `<td class="ldr-td ldr-td-team">${span}</td>`;
        }
        const isBest = bestPerCol[ci] === ri;
        return `<td class="ldr-td ldr-td-num${isBest ? ' ldr-best' : ''}">${val}</td>`;
      }).join('');

      return `<tr style="${rowStyle}">${cells}</tr>`;
    }).join('');

    return `
      <div class="ldr-section">
        <div class="label">${emoji} ${title}</div>
        <div class="card" style="overflow:hidden;padding:0">
          <div class="ldr-table-wrap">
            <table class="ldr-table">
              <thead><tr>${theadHtml}</tr></thead>
              <tbody>${tbodyHtml}</tbody>
            </table>
          </div>
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

      // 展開/收合事件
      container.addEventListener('click', e => {
        const btn = e.target.closest('.ldr-more-btn');
        if (!btn) return;
        const moreEl = document.getElementById(btn.dataset.target);
        if (!moreEl) return;
        const isOpen = moreEl.classList.toggle('open');
        btn.textContent = isOpen ? '收起 ▲' : '詳細 ▼';
      });
    } catch (err) {
      console.error('載入領先榜失敗:', err);
      showError(container, '資料載入失敗，請稍後再試', 'loadLeaders');
    }
  }

  window.loadLeaders = loadLeaders;
  document.addEventListener('DOMContentLoaded', loadLeaders);
})();
