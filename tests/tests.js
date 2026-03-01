/* ══════════════════════════════════════
   大安籃球聯盟 — 單元測試
   開啟 tests/test.html 即可在瀏覽器中執行
   ══════════════════════════════════════ */

(function () {
  'use strict';

  const results = document.getElementById('results');
  const summary = document.getElementById('summary');
  let passed = 0, failed = 0, currentSuite = '';

  function suite(name) {
    currentSuite = name;
    const div = document.createElement('div');
    div.className = 'suite';
    div.innerHTML = `<div class="suite-name">${name}</div>`;
    div.id = 'suite-' + name.replace(/\s+/g, '-');
    results.appendChild(div);
  }

  function test(name, fn) {
    const container = document.querySelector(`#suite-${currentSuite.replace(/\s+/g, '-')}`);
    try {
      fn();
      passed++;
      container.innerHTML += `<div class="test pass">✓ ${name}</div>`;
    } catch (err) {
      failed++;
      container.innerHTML += `<div class="test fail">✕ ${name}: ${err.message}</div>`;
      console.error(`FAIL: ${currentSuite} > ${name}`, err);
    }
  }

  function assert(val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  function assertEqual(a, b, msg) {
    if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
  }

  function assertDeepEqual(a, b, msg) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
    }
  }

  /* ══════════════════════════════════════
     parseSheetsName
     ══════════════════════════════════════ */
  suite('parseSheetsName');

  test('基本格式 "姓名(隊色)"', () => {
    const r = parseSheetsName('王小明(紅)');
    assertEqual(r.name, '王小明');
    assertEqual(r.team, '紅');
  });

  test('缺少右括號 "姓名(隊色"', () => {
    const r = parseSheetsName('王小明(紅');
    assertEqual(r.name, '王小明');
    assertEqual(r.team, '紅');
  });

  test('無括號 → name=原值 team=空', () => {
    const r = parseSheetsName('王小明');
    assertEqual(r.name, '王小明');
    assertEqual(r.team, '');
  });

  test('空值 → 空物件', () => {
    const r = parseSheetsName('');
    assertEqual(r.name, '');
    assertEqual(r.team, '');
  });

  test('null → 空物件', () => {
    const r = parseSheetsName(null);
    assertEqual(r.name, '');
    assertEqual(r.team, '');
  });

  /* ══════════════════════════════════════
     detectTeam
     ══════════════════════════════════════ */
  suite('detectTeam');

  test('直接隊名 "紅"', () => {
    assertEqual(detectTeam('紅'), '紅');
  });

  test('帶隊字 "紅隊"', () => {
    assertEqual(detectTeam('紅隊'), '紅');
  });

  test('姓名括號格式 "黃偉訓(黃)"', () => {
    assertEqual(detectTeam('黃偉訓(黃)'), '黃');
  });

  test('姓名括號帶隊字 "黃偉訓(黃隊)"', () => {
    assertEqual(detectTeam('黃偉訓(黃隊)'), '黃');
  });

  test('無法辨識 → null', () => {
    assertEqual(detectTeam('某某某'), null);
  });

  test('空值 → null', () => {
    assertEqual(detectTeam(''), null);
    assertEqual(detectTeam(null), null);
  });

  test('所有六隊都能辨識', () => {
    ['紅', '黑', '藍', '綠', '黃', '白'].forEach(team => {
      assertEqual(detectTeam(team), team, `Failed for ${team}`);
    });
  });

  /* ══════════════════════════════════════
     getPhaseRelativeWeekNum
     ══════════════════════════════════════ */
  suite('getPhaseRelativeWeekNum');

  test('單一賽制 → 從 1 開始', () => {
    const allWeeks = [
      { type: 'game', week: 3, phase: '例行賽' },
      { type: 'game', week: 4, phase: '例行賽' },
      { type: 'game', week: 5, phase: '例行賽' },
    ];
    assertEqual(getPhaseRelativeWeekNum(allWeeks[0], allWeeks), 1);
    assertEqual(getPhaseRelativeWeekNum(allWeeks[1], allWeeks), 2);
    assertEqual(getPhaseRelativeWeekNum(allWeeks[2], allWeeks), 3);
  });

  test('多賽制 → 各自從 1 開始', () => {
    const allWeeks = [
      { type: 'game', week: 1, phase: '熱身賽' },
      { type: 'game', week: 2, phase: '熱身賽' },
      { type: 'game', week: 3, phase: '例行賽' },
      { type: 'game', week: 4, phase: '例行賽' },
    ];
    assertEqual(getPhaseRelativeWeekNum(allWeeks[2], allWeeks), 1);
    assertEqual(getPhaseRelativeWeekNum(allWeeks[3], allWeeks), 2);
  });

  test('跳過停賽週', () => {
    const allWeeks = [
      { type: 'game', week: 1, phase: '例行賽' },
      { type: 'suspended', week: 2, phase: '例行賽' },
      { type: 'game', week: 3, phase: '例行賽' },
    ];
    assertEqual(getPhaseRelativeWeekNum(allWeeks[0], allWeeks), 1);
    assertEqual(getPhaseRelativeWeekNum(allWeeks[2], allWeeks), 3); // week 3 - minWeek 1 + 1 = 3
  });

  test('使用 weekNum 欄位（boxscore 格式）', () => {
    const weeks = [
      { weekNum: 5, phase: '例行賽' },
      { weekNum: 6, phase: '例行賽' },
    ];
    assertEqual(getPhaseRelativeWeekNum(weeks[0], weeks), 1);
    assertEqual(getPhaseRelativeWeekNum(weeks[1], weeks), 2);
  });

  test('無 allEntries → 回傳 1（只有自身）', () => {
    assertEqual(getPhaseRelativeWeekNum({ week: 5, phase: '例行賽' }, null), 1);
  });

  /* ══════════════════════════════════════
     getPhaseWeekLabel
     ══════════════════════════════════════ */
  suite('getPhaseWeekLabel');

  test('正常格式', () => {
    const allWeeks = [
      { type: 'game', week: 3, phase: '例行賽' },
      { type: 'game', week: 4, phase: '例行賽' },
    ];
    assertEqual(getPhaseWeekLabel(allWeeks[0], allWeeks), '例行賽 · 第 1 週');
    assertEqual(getPhaseWeekLabel(allWeeks[1], allWeeks), '例行賽 · 第 2 週');
  });

  test('停賽週 → 空字串', () => {
    const entry = { type: 'suspended', week: 2, phase: '例行賽' };
    assertEqual(getPhaseWeekLabel(entry, []), '');
  });

  test('null entry → 空字串', () => {
    assertEqual(getPhaseWeekLabel(null, []), '');
  });

  /* ══════════════════════════════════════
     parseStatCols (api.js)
     ══════════════════════════════════════ */
  suite('parseStatCols');

  test('正確提取數據', () => {
    const row = [];
    row[BS_HOME.FG2MISS] = '3';
    row[BS_HOME.FG2MADE] = '5';
    row[BS_HOME.FG3MISS] = '2';
    row[BS_HOME.FG3MADE] = '1';
    row[BS_HOME.FTMISS] = '0';
    row[BS_HOME.FTMADE] = '4';
    row[BS_HOME.PTS] = '19';
    row[BS_HOME.OREB] = '2';
    row[BS_HOME.DREB] = '6';
    row[BS_HOME.AST] = '3';
    row[BS_HOME.BLK] = '1';
    row[BS_HOME.STL] = '2';
    row[BS_HOME.TOV] = '1';
    row[BS_HOME.PF] = '3';

    const stats = parseStatCols(row, BS_HOME);
    assertEqual(stats.fg2miss, 3);
    assertEqual(stats.fg2made, 5);
    assertEqual(stats.pts, 19);
    assertEqual(stats.treb, 8); // 2 + 6
  });

  test('處理 #N/A 和空值', () => {
    const row = [];
    row[BS_HOME.PTS] = '#N/A';
    row[BS_HOME.AST] = '';
    const stats = parseStatCols(row, BS_HOME);
    assertEqual(stats.pts, 0);
    assertEqual(stats.ast, 0);
  });

  /* ══════════════════════════════════════
     transformDragon
     ══════════════════════════════════════ */
  suite('transformDragon');

  test('正確解析龍虎榜資料', () => {
    const rows = [
      ['1', '王小明(紅)', '10', '5', '3'],
      ['2', '李大華(藍)', '8', '4', '2'],
    ];
    const data = transformDragon(rows);
    assertEqual(data.players.length, 2);
    assertEqual(data.players[0].name, '王小明');
    assertEqual(data.players[0].team, '紅');
    assertEqual(data.players[0].total, 10);
    assertEqual(data.players[0].att, 5);
    assertEqual(data.players[0].duty, 3);
    assertEqual(data.players[0].mop, 2); // 10 - 5 - 3 = 2
  });

  /* ══════════════════════════════════════
     transformRoster
     ══════════════════════════════════════ */
  suite('transformRoster');

  test('正確解析出席資料', () => {
    const presentRows = [
      ['王小明(紅)', '1', '0', '1'],
      ['李大華(藍)', '1', '1', 'x'],
    ];
    const dateRows = [['2/1', '2/8', '2/15']];
    const data = transformRoster(presentRows, dateRows);
    assertEqual(data.weeks.length, 3);
    assertEqual(data.teams.length, 2); // 紅 and 藍
    // 紅隊
    const red = data.teams.find(t => t.id === 'red');
    assert(red, '應有紅隊');
    assertEqual(red.players[0].name, '王小明');
    assertDeepEqual(red.players[0].att, [1, 0, 1]);
  });

  /* ══════════════════════════════════════
     buildMatchupCard
     ══════════════════════════════════════ */
  suite('buildMatchupCard');

  test('已完成比賽 → 顯示比分', () => {
    const html = buildMatchupCard({
      combo: 1, home: '紅', away: '藍',
      homeScore: 30, awayScore: 25, status: 'finished',
    });
    assert(html.includes('30'), '應包含主隊分數');
    assert(html.includes('25'), '應包含客隊分數');
    assert(html.includes('紅隊勝'), '應顯示勝方');
  });

  test('未開始 → 不顯示分數', () => {
    const html = buildMatchupCard({
      combo: 1, home: '紅', away: '藍',
      status: 'upcoming',
    });
    assert(!html.includes('hgc-score-row'), '不應顯示分數');
    assert(html.includes('hgc-upcoming'), '應標記為 upcoming');
  });

  test('無隊伍 → 顯示尚未公告', () => {
    const html = buildMatchupCard({
      combo: 1, home: '', away: '', status: 'upcoming',
    });
    assert(html.includes('尚未公告'), '應顯示尚未公告');
  });

  /* ══════════════════════════════════════
     AppEvents
     ══════════════════════════════════════ */
  suite('AppEvents');

  test('on + emit 基本流程', () => {
    let received = null;
    AppEvents.on('test-event', (val) => { received = val; });
    AppEvents.emit('test-event', 42);
    assertEqual(received, 42);
    // cleanup
    AppEvents._handlers['test-event'] = [];
  });

  test('off 移除事件', () => {
    let count = 0;
    const handler = () => { count++; };
    AppEvents.on('test-off', handler);
    AppEvents.emit('test-off');
    assertEqual(count, 1);
    AppEvents.off('test-off', handler);
    AppEvents.emit('test-off');
    assertEqual(count, 1); // should not increment
  });

  test('多個 handler', () => {
    let a = 0, b = 0;
    AppEvents.on('test-multi', () => { a++; });
    AppEvents.on('test-multi', () => { b++; });
    AppEvents.emit('test-multi');
    assertEqual(a, 1);
    assertEqual(b, 1);
    AppEvents._handlers['test-multi'] = [];
  });

  /* ══════════════════════════════════════
     ROTATION_ROLES (api.js)
     ══════════════════════════════════════ */
  suite('parseRotationRow');

  test('正確解析輪值', () => {
    const row = [
      '裁判A(紅)', '裁判B(藍)', '', // 裁判 0-2
      '場務A(綠)', '', '',           // 場務 3-5
      '',                             // 攝影 6
      '器材A(白)', '',               // 器材 7-8
      '數據A(黃)',                    // 數據 9
      '', '', '',                     // 其他 10-12
    ];
    const staff = parseRotationRow(row);
    assertEqual(staff['裁判'].length, 2);
    assertEqual(staff['場務'].length, 1);
    assert(!staff['攝影'], '無攝影');
    assertEqual(staff['器材'].length, 1);
    assertEqual(staff['數據'].length, 1);
    assert(!staff['其他'], '無其他');
  });

  test('空列 → 空物件', () => {
    const staff = parseRotationRow([]);
    assertEqual(Object.keys(staff).length, 0);
  });

  /* ══════════════════════════════════════
     Summary
     ══════════════════════════════════════ */
  const total = passed + failed;
  const color = failed === 0 ? '#4caf50' : '#e53935';
  summary.innerHTML = `<span style="color:${color}">${passed}/${total} tests passed</span>` +
    (failed ? ` — <span class="fail">${failed} failed</span>` : ' — All green!');

})();
