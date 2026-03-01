/* ══════════════════════════════════
   PAGE: HOF — 名人堂
   依賴：shared-app.js (TEAM_CONFIG, renderPodium, showLoading, showError, showEmpty, switchHof)
   依賴：js/api.js (api.getHof)
   資料：data/hof.json
══════════════════════════════════ */

(function() {
  'use strict';

  /* ── 渲染場均數據 ── */
  function renderAvg(avg) {
    // Podium
    const podiumHtml = `
      <div class="label">${avg.podium.label}</div>
      <div class="podium" id="hof-pod-avg"></div>`;

    // Table
    const rows = avg.players.map((p, i) => {
      const isFirst = i === 0;
      return `<tr>
        <td><span class="srank${isFirst ? ' gold' : ''}">${i + 1}</span></td>
        <td>${isFirst ? '<strong>' : ''}${p.name}${isFirst ? '</strong>' : ''}</td>
        <td><span class="sval">${p.ppg}</span></td>
        <td>${p.rpg}</td><td>${p.apg}</td><td>${p.bpg}</td><td>${p.spg}</td><td>${p.eff}</td>
      </tr>`;
    }).join('');

    const tableHtml = `
      <div class="card" style="overflow-x:auto">
        <table class="stat-table">
          <thead><tr><th>#</th><th>球員</th><th>PPG</th><th>RPG</th><th>APG</th><th>BPG</th><th>SPG</th><th>EFF</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    return podiumHtml + tableHtml;
  }

  /* ── 渲染生涯累計 ── */
  function renderTotal(total) {
    const rows = total.players.map((p, i) => {
      const isFirst = i === 0;
      return `<tr>
        <td><span class="srank${isFirst ? ' gold' : ''}">${i + 1}</span></td>
        <td>${isFirst ? '<strong>' : ''}${p.name}${isFirst ? '</strong>' : ''}</td>
        <td><span class="sval">${p.pts}</span></td>
        <td>${p.reb}</td><td>${p.ast}</td><td>${p.games}</td>
      </tr>`;
    }).join('');

    return `<div class="card" style="overflow-x:auto">
      <table class="stat-table">
        <thead><tr><th>#</th><th>球員</th><th>總得分</th><th>總籃板</th><th>總助攻</th><th>總出賽</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  /* ── 渲染鐵人榜 ── */
  function renderIron(iron) {
    const rows = iron.players.map((p, i) => {
      const isFirst = i === 0;
      return `<tr>
        <td><span class="srank${isFirst ? ' gold' : ''}">${i + 1}</span></td>
        <td>${isFirst ? '<strong>' : ''}${p.name}${isFirst ? '</strong>' : ''}</td>
        <td><span class="sval">${p.total}</span></td>
        <td>${p.p2}</td><td>${p.p3}</td><td>${p.ft}</td>
      </tr>`;
    }).join('');

    return `<div class="card" style="overflow-x:auto">
      <table class="stat-table">
        <thead><tr><th>#</th><th>球員</th><th>三鐵霸主</th><th>2P鐵</th><th>3P鐵</th><th>FT鐵</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  /* ── 渲染奪冠榜 ── */
  function renderChamp(champ) {
    if (champ.status === 'preparing') {
      return `<div class="card" style="padding:3rem;text-align:center;color:var(--txt-light)">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🏆</div>
        <div class="cond" style="letter-spacing:.08em;font-size:.85rem">${champ.message}</div>
      </div>`;
    }
    return '';
  }

  /* ── 主渲染 ── */
  function renderHof(data) {
    const container = document.getElementById('hof-content');
    if (!data) { showEmpty(container, '目前無名人堂資料'); return; }

    container.innerHTML = `
      <div class="hof-tabs">
        <div class="htab active" data-panel="h-avg">場均數據</div>
        <div class="htab" data-panel="h-total">生涯累計</div>
        <div class="htab" data-panel="h-iron">鐵人榜</div>
        <div class="htab" data-panel="h-champ">奪冠榜</div>
      </div>
      <div id="h-avg">${renderAvg(data.avgStats)}</div>
      <div id="h-total" style="display:none">${renderTotal(data.totalStats)}</div>
      <div id="h-iron" style="display:none">${renderIron(data.ironStats)}</div>
      <div id="h-champ" style="display:none">${renderChamp(data.champStats)}</div>`;

    // 渲染 podium（需要在 DOM 插入後執行）
    if (data.avgStats.podium.top3 && data.avgStats.podium.top3.length >= 3) {
      renderPodium('hof-pod-avg', data.avgStats.podium.top3, data.avgStats.podium.unit);
    }

  }

  /* ── Fetch & Init ── */
  async function loadHof() {
    const container = document.getElementById('hof-content');
    showLoading(container);

    try {
      const data = await api.getHof();
      renderHero('hero-container', {
        title: '名人堂',
        subtitle: '生涯數據榜 · 場均數據 · 鐵人榜 · 奪冠紀錄',
        eyebrow: data.description,
        heroClass: 'hof-hero',
        heroType: 'layered'
      });
      renderHof(data);
    } catch (err) {
      console.error('載入名人堂資料失敗:', err);
      showError(container, '名人堂資料載入失敗，請稍後再試', loadHof);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // HoF tab 事件委派（綁定一次，避免 retry 累積）
    const container = document.getElementById('hof-content');
    if (container) {
      container.addEventListener('click', (e) => {
        const tab = e.target.closest('.htab');
        if (!tab) return;
        const panelId = tab.dataset.panel;
        if (panelId) switchHof(tab, panelId);
      });
    }
    loadHof();
  });
})();
