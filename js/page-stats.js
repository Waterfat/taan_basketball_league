/* ══════════════════════════════════
   PAGE: STATS — 數據統計
   依賴：shared-app.js (TEAM_CONFIG, teamTdHtml, nameTdHtml, rowBgStyle, renderPodium, showLoading, showError)
   依賴：js/api.js (api.getStats)
   資料：data/stats.json
══════════════════════════════════ */

(function() {
  'use strict';

  let _seasons = {};
  let _statsPanelsHtml = '';

  /* ── 排名 td ── */
  function rankTd(i) {
    const cls = i === 0 ? ' gold' : '';
    return `<td><span class="srank${cls}">${i + 1}</span></td>`;
  }

  /* ── 渲染得分榜（含命中率額外欄位） ── */
  function renderScoring(data) {
    renderPodium('pod-scoring', data.slice(0, 3), '場均得分');
    document.getElementById('tb-scoring').innerHTML = data.map((p, i) =>
      `<tr class="sr"${rowBgStyle(p.team)}>${rankTd(i)}${nameTdHtml(p.name, p.team)}${teamTdHtml(p.team)}<td><span class="sval">${p.val.toFixed(2)}</span></td><td>${p.p2}</td><td>${p.p3}</td><td>${p.ft}</td></tr>`
    ).join('');
  }

  /* ── 渲染籃板榜（含進攻/防守額外欄位） ── */
  function renderRebound(data) {
    renderPodium('pod-rebound', data.slice(0, 3), '場均籃板');
    document.getElementById('tb-rebound').innerHTML = data.map((p, i) =>
      `<tr class="sr"${rowBgStyle(p.team)}>${rankTd(i)}${nameTdHtml(p.name, p.team)}${teamTdHtml(p.team)}<td><span class="sval">${p.val.toFixed(2)}</span></td><td>${p.off.toFixed(1)}</td><td>${p.def.toFixed(1)}</td></tr>`
    ).join('');
  }

  /* ── 渲染簡易榜（助攻/抄截/阻攻/EFF） ── */
  function renderSimple(data, podId, tbId, unit) {
    renderPodium(podId, data.slice(0, 3), unit);
    document.getElementById(tbId).innerHTML = data.map((p, i) =>
      `<tr class="sr"${rowBgStyle(p.team)}>${rankTd(i)}${nameTdHtml(p.name, p.team)}${teamTdHtml(p.team)}<td><span class="sval">${p.val.toFixed(2)}</span></td></tr>`
    ).join('');
  }

  /* ── 渲染全部 ── */
  function stats_renderAll(season) {
    const d = _seasons[season];
    if (!d) return;

    renderScoring(d.scoring);
    renderRebound(d.rebound);
    renderSimple(d.assist, 'pod-assist', 'tb-assist', '場均助攻');
    renderSimple(d.steal, 'pod-steal', 'tb-steal', '場均抄截');
    renderSimple(d.block, 'pod-block', 'tb-block', '場均阻攻');
    renderSimple(d.eff, 'pod-eff', 'tb-eff', 'EFF');

    const heroSub = document.getElementById('hero-sub');
    if (heroSub) heroSub.textContent = d.label || '';
  }

  function onSeasonChange(el) {
    stats_renderAll(el.value);
  }

  /* ── Fetch & Init ── */
  async function loadStats() {
    const contentEl = document.getElementById('stats-content');
    showLoading(contentEl);

    try {
      const data = await api.getStats();

      // Handle $ref_copy for seasons that share data
      Object.keys(data).forEach(key => {
        if (data[key].$ref_copy) {
          const src = data[data[key].$ref_copy];
          data[key] = { ...src, label: `第 ${key} 屆 · 歷史賽季` };
        }
      });

      _seasons = data;

      // Restore stats panel HTML (was replaced by loading state)
      contentEl.innerHTML = _statsPanelsHtml;

      // Populate season selector
      const sel = document.getElementById('season-select');
      if (sel) {
        sel.innerHTML = Object.keys(_seasons)
          .sort((a, b) => Number(b) - Number(a))
          .map((k, i) => `<option value="${k}"${i === 0 ? ' selected' : ''}>${_seasons[k].label || '第 ' + k + ' 屆'}</option>`)
          .join('');
      }

      stats_renderAll(Object.keys(_seasons).sort((a, b) => Number(b) - Number(a))[0]);
    } catch (err) {
      console.error('載入 stats 資料失敗:', err);
      showError(contentEl, '數據資料載入失敗，請稍後再試', 'loadStats');
    }
  }

  // 暴露全域（供 retry 呼叫）
  window.loadStats = loadStats;

  document.addEventListener('DOMContentLoaded', () => {
    _statsPanelsHtml = document.getElementById('stats-content').innerHTML;

    // Stats tab 事件綁定
    const tabsContainer = document.getElementById('stat-tabs');
    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.stab');
        if (!tab) return;
        const panelId = tab.dataset.panel;
        if (panelId) switchTab(tab, panelId);
      });
    }

    // Season selector 事件綁定
    const sel = document.getElementById('season-select');
    if (sel) sel.addEventListener('change', () => onSeasonChange(sel));

    loadStats();
  });
})();
