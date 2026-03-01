/* ══════════════════════════════════
   PAGE: DRAGON — 積分龍虎榜
   依賴：shared-app.js (TEAM_CONFIG, showLoading, showError, showEmpty)
   依賴：js/api.js (api.getDragon)
   資料：data/dragon.json
══════════════════════════════════ */

(function() {
  'use strict';

  /* ── 渲染單列球員 ── */
  function renderPlayerRow(p, threshold) {
    const tc = TEAM_CONFIG[p.team] || {};
    const isTop3 = p.rank <= 3;
    const rankCls = isTop3 ? 'dt-rank hot' : 'dt-rank';
    const tagHtml = p.tag
      ? ` <span style="font-family:var(--font-cond);font-size:.68rem;font-weight:800;color:var(--orange);letter-spacing:.02em">(${p.tag})</span>`
      : '';
    const bg = getTeamBg(p.team, isTop3 ? '.16' : '.10');

    return `<tr style="background:${bg}">
      <td><span class="${rankCls}">${p.rank}</span></td>
      <td><span class="${tc.cls}">${p.name}</span>${tagHtml}</td>
      <td><span class="${tc.cls}">${p.team}</span></td>
      <td>${p.att}</td><td>${p.duty}</td><td>${p.mop}</td>
      <td>${p.playoff !== null ? p.playoff : '—'}</td>
      <td><span class="dt-score">${p.total}</span></td>
    </tr>`;
  }

  /* ── 主渲染 ── */
  function renderDragon(data) {
    const container = document.getElementById('dragon-content');
    if (!data || !data.players || !data.players.length) {
      showEmpty(container, '目前無龍虎榜資料');
      return;
    }

    const threshold = data.civilianThreshold || 36;
    const civilians = data.players.filter(p => p.rank <= threshold);
    const slaves = data.players.filter(p => p.rank > threshold);

    let tbodyHtml = '';
    tbodyHtml += `<tr class="dt-divider"><td colspan="8">🧑 平民區（前 ${threshold} 名 · 可優先自由選擇加入隊伍）</td></tr>`;
    tbodyHtml += civilians.map(p => renderPlayerRow(p, threshold)).join('');

    if (slaves.length) {
      tbodyHtml += `<tr class="dt-divider"><td colspan="8">⛓️ 奴隸區（第 ${threshold + 1} 名起 · 為聯盟貢獻過低淪為奴隸，只能任由大小腿發賣、競標）</td></tr>`;
      tbodyHtml += slaves.map(p => renderPlayerRow(p, threshold)).join('');
    }

    container.innerHTML = `
      <div class="card" style="overflow-x:auto">
        <table class="dt-table">
          <thead><tr>
            <th>#</th><th>球員</th><th>隊伍</th>
            <th>出席</th><th>輪值</th><th>拖地</th><th>季後賽</th><th>總分</th>
          </tr></thead>
          <tbody>${tbodyHtml}</tbody>
        </table>
      </div>
      ${data.rulesLink ? `<div class="mt-sm" style="text-align:center"><a href="${data.rulesLink}" target="_blank" style="font-family:var(--font-cond);font-size:.82rem;color:var(--orange);text-decoration:none;letter-spacing:.04em">📋 查看完整選秀規則公告 →</a></div>` : ''}`;
  }

  /* ── Fetch & Init ── */
  async function loadDragon() {
    const container = document.getElementById('dragon-content');
    showLoading(container);

    try {
      const data = await api.getDragon();
      renderHero('hero-container', {
        title: '積分<span>龍虎</span>榜',
        subtitle: '活躍度積分累計 · 決定下賽季選秀順位',
        eyebrow: `第 ${data.season} 屆 · ${data.phase}`,
        heroClass: 'dt-hero',
        heroType: 'layered'
      });

      // 渲染 hero 下方的 chips
      const heroContent = document.querySelector('.dt-hero-content');
      if (heroContent) {
        const chipsDiv = document.createElement('div');
        chipsDiv.className = 'dt-chips';
        chipsDiv.innerHTML = `
          <span class="badge bn">🧑 平民區 前 ${data.civilianThreshold} 名</span>
          <span class="badge br">⛓️ 奴隸區 ${data.civilianThreshold + 1}+</span>
          <span class="dt-warn">⚠ 季後賽加分於賽季結束後計入</span>`;
        heroContent.appendChild(chipsDiv);
      }

      renderDragon(data);
    } catch (err) {
      console.error('載入龍虎榜資料失敗:', err);
      showError(container, '龍虎榜資料載入失敗，請稍後再試', loadDragon);
    }
  }

  document.addEventListener('DOMContentLoaded', loadDragon);
})();
