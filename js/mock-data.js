/* ══════════════════════════════════════
   Mock Data — 本地開發用假資料
   ══════════════════════════════════════
   用途：以 file:// 直接開啟 HTML 時，fetch 會因 CORS 失敗。
   此檔提供內嵌資料讓頁面仍可正常渲染，方便調版型。
   當 api.js 偵測到 file:// 協定時，會自動使用這些資料。
   ══════════════════════════════════════ */

const MOCK_DATA = {

  /* ── 首頁 home ── */
  home: {
    season: 25,
    currentWeek: 3,
    phase: "例行賽",
    scheduleInfo: {
      date: "2026 / 2 / 14（六）07:30",
      venue: "三重體育館"
    },
    standings: [
      { rank: 1, name: "綠隊", team: "綠", record: "4勝 2敗", pct: "66.7%", history: ["L","W","W","L","W","W"], streak: "2連勝", streakType: "win" },
      { rank: 2, name: "紅隊", team: "紅", record: "4勝 2敗", pct: "66.7%", history: ["W","L","W","W","W","L"], streak: "1連敗", streakType: "lose" },
      { rank: 3, name: "黑隊", team: "黑", record: "3勝 3敗", pct: "50.0%", history: ["L","W","L","W","W","W"], streak: "2連勝", streakType: "win" },
      { rank: 4, name: "黃隊", team: "黃", record: "3勝 3敗", pct: "50.0%", history: ["W","W","L","L","L","W"], streak: "1連勝", streakType: "win" },
      { rank: 5, name: "白隊", team: "白", record: "3勝 3敗", pct: "50.0%", history: ["L","W","W","W","L","L"], streak: "2連敗", streakType: "lose" },
      { rank: 6, name: "藍隊", team: "藍", record: "1勝 5敗", pct: "16.7%", history: ["L","L","W","L","L","L"], streak: "3連敗", streakType: "lose" }
    ],
    dragonTop10: [
      { rank: 1,  name: "韋承志", team: "紅", att: 8, duty: 8, total: 16 },
      { rank: 2,  name: "吳家豪", team: "綠", att: 6, duty: 6, total: 12 },
      { rank: 3,  name: "李昊明", team: "黑", att: 8, duty: 3, total: 11 },
      { rank: 4,  name: "趙尹旋", team: "紅", att: 7, duty: 3, total: 10 },
      { rank: 5,  name: "李政軒", team: "黑", att: 8, duty: 1, total: 9 },
      { rank: 6,  name: "楊承達", team: "黑", att: 5, duty: 3, total: 8 },
      { rank: 7,  name: "陳鈞銘", team: "黃", att: 5, duty: 2, total: 7 },
      { rank: 8,  name: "吳軒宇", team: "紅", att: 4, duty: 2, total: 6 },
      { rank: 9,  name: "林志柏", team: "黑", att: 4, duty: 2, total: 6 },
      { rank: 10, name: "江錒哲", team: "黃", att: 4, duty: 1, total: 5 }
    ],
    miniStats: {
      pts: {
        label: "得分", unit: "PPG",
        players: [
          { rank: 1, name: "黃偉訓", team: "綠", val: 9.55 },
          { rank: 2, name: "吳軒宇", team: "紅", val: 7.62 },
          { rank: 3, name: "吳家豪", team: "綠", val: 7.00 },
          { rank: 4, name: "陳彥汗", team: "白", val: 6.68 }
        ]
      },
      reb: {
        label: "籃板", unit: "RPG",
        players: [
          { rank: 1, name: "陳曉川", team: "白", val: 4.90 },
          { rank: 2, name: "江浩仲", team: "藍", val: 4.84 },
          { rank: 3, name: "林毅豐", team: "黑", val: 4.08 },
          { rank: 4, name: "李政軒", team: "黑", val: 4.04 }
        ]
      },
      ast: {
        label: "助攻", unit: "APG",
        players: [
          { rank: 1, name: "梁修綸", team: "黑", val: 1.61 },
          { rank: 2, name: "陳彥廷", team: "黃", val: 1.15 },
          { rank: 3, name: "吳家豪", team: "綠", val: 1.11 },
          { rank: 4, name: "連育樟", team: "綠", val: 1.09 }
        ]
      },
      stl: {
        label: "抄截", unit: "SPG",
        players: [
          { rank: 1, name: "謝明澄", team: "藍", val: 1.50 },
          { rank: 2, name: "錢威遠", team: "綠", val: 1.44 },
          { rank: 3, name: "李世昌", team: "黃", val: 1.36 },
          { rank: 4, name: "楊承達", team: "黑", val: 1.15 }
        ]
      },
      blk: {
        label: "阻攻", unit: "BPG",
        players: [
          { rank: 1, name: "許勝傑", team: "紅", val: 0.84 },
          { rank: 2, name: "韋承志", team: "紅", val: 0.62 },
          { rank: 3, name: "林志偉", team: "黃", val: 0.57 },
          { rank: 4, name: "王昶竣", team: "白", val: 0.45 }
        ]
      }
    }
  },

  /* ── 球員名單 roster ── */
  roster: {
    weeks: [
      { wk: 1, label: "第1週", date: "1/10" },
      { wk: 2, label: "第2週", date: "1/17" },
      { wk: 3, label: "第3週", date: "1/24" },
      { wk: 4, label: "第4週", date: "1/31" },
      { wk: 5, label: "第5週", date: "2/7"  },
      { wk: 6, label: "第6週", date: "2/14" },
      { wk: 7, label: "第7週", date: "2/21" },
      { wk: 8, label: "第8週", date: "2/28" },
      { wk: 9, label: "第9週", date: "3/7"  },
      { wk: 10, label: "第10週", date: "3/14" }
    ],
    teams: [
      {
        id: "red", name: "紅隊",
        players: [
          { name: "韋承志", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "吳軒宇", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "趙尹旋", att: [1,1,0,1,1,1,"?","?","?","?"] },
          { name: "周昱丞", att: [1,1,1,0,0,0,"?","?","?","?"] },
          { name: "蔡一聲", att: [0,1,1,1,0,"x","?","?","?","?"] },
          { name: "林顥軒", att: [1,1,0,1,0,1,"?","?","?","?"] },
          { name: "李艾恩", att: [1,0,1,0,0,1,"?","?","?","?"] },
          { name: "許勝傑", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "阮柏翰", att: [0,1,1,1,1,0,"?","?","?","?"] },
          { name: "余芑滌", att: [1,1,0,0,1,1,"?","?","?","?"] }
        ]
      },
      {
        id: "black", name: "黑隊",
        players: [
          { name: "李昊明", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "李政軒", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "楊承達", att: [1,0,1,1,0,1,"?","?","?","?"] },
          { name: "林毅豐", att: [1,1,1,0,1,1,"?","?","?","?"] },
          { name: "喻柏淵", att: [1,1,0,1,1,1,"?","?","?","?"] },
          { name: "梁修綸", att: [1,1,1,0,0,0,"?","?","?","?"] },
          { name: "李子昂", att: [0,1,1,1,0,0,"?","?","?","?"] },
          { name: "陳國弘", att: [1,1,0,1,0,0,"?","?","?","?"] },
          { name: "陳彥仰", att: [1,0,1,1,0,0,"?","?","?","?"] },
          { name: "林志柏", att: [0,1,1,1,1,0,"?","?","?","?"] }
        ]
      },
      {
        id: "blue", name: "藍隊",
        players: [
          { name: "謝明澄", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "江浩仲", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "馮是翔", att: [1,1,0,0,1,1,"?","?","?","?"] },
          { name: "王建翔", att: [0,1,1,1,0,1,"?","?","?","?"] },
          { name: "陳宥竹", att: [1,1,1,0,1,0,"?","?","?","?"] },
          { name: "楊志達", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "吳冠德", att: [1,1,0,1,0,1,"?","?","?","?"] },
          { name: "黃聖哲", att: [0,"x",1,1,1,0,"?","?","?","?"] }
        ]
      },
      {
        id: "green", name: "綠隊",
        players: [
          { name: "黃偉訓", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "吳家豪", att: [1,1,1,0,1,1,"?","?","?","?"] },
          { name: "連育樟", att: [1,1,0,1,1,1,"?","?","?","?"] },
          { name: "錢威遠", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "趙伯熙", att: [0,1,1,1,0,1,"?","?","?","?"] },
          { name: "林光偉", att: [1,1,1,0,1,1,"?","?","?","?"] },
          { name: "朱裕熙", att: [0,0,0,0,0,0,"?","?","?","?"] },
          { name: "陳威宇", att: [1,1,1,1,0,1,"?","?","?","?"] }
        ]
      },
      {
        id: "yellow", name: "黃隊",
        players: [
          { name: "陳鈞銘", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "江錒哲", att: [1,1,0,1,1,1,"?","?","?","?"] },
          { name: "李世昌", att: [1,1,1,1,0,1,"?","?","?","?"] },
          { name: "陳彥廷", att: [0,1,1,0,1,1,"?","?","?","?"] },
          { name: "林志偉", att: [1,1,1,1,1,0,"?","?","?","?"] },
          { name: "黃凱傑", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "張書豪", att: [0,1,0,1,1,0,"?","?","?","?"] },
          { name: "鄭書銘", att: [1,1,1,0,0,1,"?","?","?","?"] }
        ]
      },
      {
        id: "white", name: "白隊",
        players: [
          { name: "陳曉川", att: [1,1,1,1,1,1,"?","?","?","?"] },
          { name: "陳彥汗", att: [1,1,0,1,1,1,"?","?","?","?"] },
          { name: "陳怡舟", att: [1,0,1,1,1,1,"?","?","?","?"] },
          { name: "王昶竣", att: [0,1,1,0,1,1,"?","?","?","?"] },
          { name: "王子峻", att: [1,1,1,1,0,0,"?","?","?","?"] },
          { name: "高嘉揚", att: [1,1,0,1,1,1,"?","?","?","?"] },
          { name: "陳冠宇", att: [1,0,1,0,1,1,"?","?","?","?"] },
          { name: "林晉章", att: [0,1,1,1,0,1,"?","?","?","?"] }
        ]
      }
    ]
  },

  /* ── 賽程 schedule（全季） ── */
  schedule: {
    season: 25,
    currentWeek: 5,
    allWeeks: [
      /* 第 1 週 — 熱身賽（已完成） */
      {
        type: "game", week: 1, date: "2026/1/10", phase: "熱身賽", venue: "中正",
        matchups: [
          { combo: 1, home: "白", away: "紅", homeScore: 22, awayScore: 34, status: "finished" },
          { combo: 2, home: "黃", away: "黑", homeScore: 22, awayScore: 23, status: "finished" },
          { combo: 3, home: "藍", away: "綠", homeScore: 20, awayScore: 28, status: "finished" },
          { combo: 4, home: "黑", away: "白", homeScore: 17, awayScore: 21, status: "finished" },
          { combo: 5, home: "紅", away: "藍", homeScore: 14, awayScore: 20, status: "finished" },
          { combo: 6, home: "綠", away: "黃", homeScore: 21, awayScore: 22, status: "finished" }
        ],
        games: [
          { num: 1, time: "", home: "白", away: "紅", homeScore: 22, awayScore: 34, status: "finished", staff: { "場務": ["李子昂(黑)","盧以朋(黃)","連育樟(綠)"], "攝影": ["楊承達(黑)"], "器材": ["陳曉川(白)","韋承志(紅)"] } },
          { num: 2, time: "", home: "黃", away: "黑", homeScore: 22, awayScore: 23, status: "finished", staff: { "場務": ["余芑滌(紅)","竺立梵(白)","王昶竣(白)"], "攝影": ["林浚鑫(白)"], "器材": ["陳彥汗(白)","李子昂(黑)"] } },
          { num: 3, time: "", home: "藍", away: "綠", homeScore: 20, awayScore: 28, status: "finished", staff: { "場務": ["陳泓瑋(白)","林志柏(黑)","張裕棠(黑)"], "攝影": ["楊凱翔(紅)"], "器材": ["吳家豪(綠)"] } },
          { num: 4, time: "", home: "黑", away: "白", homeScore: 17, awayScore: 21, status: "finished", staff: { "場務": ["吳軒宇(紅)","黃偉訓(綠)","王進興(藍)"], "攝影": ["涂意証(綠)"], "器材": ["李昊明(黑)"] } },
          { num: 5, time: "", home: "紅", away: "藍", homeScore: 14, awayScore: 20, status: "finished", staff: { "場務": ["張仁豪(綠)","曾昱嘉(綠)","吳冠德(黃)"], "攝影": ["陳鈞銘(黃)"], "器材": ["趙尹旋(紅)"] } },
          { num: 6, time: "", home: "綠", away: "黃", homeScore: 21, awayScore: 22, status: "finished", staff: { "場務": ["周昱丞(紅)","董鎧維(藍)","胡展綸(藍)"], "攝影": ["陳頤(藍)"], "器材": ["林光偉(綠)"] } }
        ]
      },
      /* 第 2 週 — 熱身賽（已完成） */
      {
        type: "game", week: 2, date: "2026/1/17", phase: "熱身賽", venue: "中正",
        matchups: [
          { combo: 1, home: "白", away: "藍", homeScore: 17, awayScore: 24, status: "finished" },
          { combo: 2, home: "黑", away: "綠", homeScore: 16, awayScore: 24, status: "finished" },
          { combo: 3, home: "黃", away: "紅", homeScore: 15, awayScore: 21, status: "finished" },
          { combo: 4, home: "綠", away: "白", homeScore: 25, awayScore: 21, status: "finished" },
          { combo: 5, home: "藍", away: "黃", homeScore: 24, awayScore: 19, status: "finished" },
          { combo: 6, home: "紅", away: "黑", homeScore: 19, awayScore: 29, status: "finished" }
        ],
        games: [
          { num: 1, time: "", home: "白", away: "藍", homeScore: 17, awayScore: 24, status: "finished", staff: { "裁判": ["李子昂(黑)","趙伯熙(綠)","陳國弘(黑)"], "場務": ["黃偉訓(綠)","吳家豪(綠)","楊秉諺(綠)"], "攝影": ["李昊明(黑)"], "器材": ["陳曉川(白)","林光偉(綠)"] } },
          { num: 2, time: "", home: "黑", away: "綠", homeScore: 16, awayScore: 24, status: "finished", staff: { "裁判": ["李勁緯(藍)","吳軒宇(紅)","李崢嶸(藍)"], "場務": ["粘智翔(藍)","吳冠德(黃)","王昶竣(白)"], "攝影": ["陳頤(藍)"], "器材": ["陳彥汗(白)","趙尹旋(紅)"] } },
          { num: 3, time: "", home: "黃", away: "紅", homeScore: 15, awayScore: 21, status: "finished", staff: { "裁判": ["陳怡舟(白)","林昇德(白)","趙伯熙(綠)"], "場務": ["陳頤(藍)","馮是翔(藍)","喻柏淵(黑)"], "攝影": ["涂意証(綠)"], "器材": ["韋承志(紅)"] } },
          { num: 4, time: "", home: "綠", away: "白", homeScore: 25, awayScore: 21, status: "finished", staff: { "裁判": ["陳國弘(黑)","粘智翔(藍)","陳鼎煬(黃)"], "場務": ["蔡一聲(紅)","韋承志(紅)","李宗漢(黃)"], "攝影": ["盧以朋(黃)"], "器材": ["吳家豪(綠)"] } },
          { num: 5, time: "", home: "藍", away: "黃", homeScore: 24, awayScore: 19, status: "finished", staff: { "裁判": ["陳怡舟(白)","林昇德(白)","彥榕(白)"], "場務": ["周昱丞(紅)","余芑滌(紅)","李艾恩(紅)"], "攝影": ["楊承達(黑)"], "器材": ["趙尹旋(紅)"] } },
          { num: 6, time: "", home: "紅", away: "黑", homeScore: 19, awayScore: 29, status: "finished", staff: { "裁判": ["李勁緯(藍)","陳鼎煬(黃)","彥榕(白)"], "場務": ["陳彥廷(黃)","董鎧維(藍)","李世昌(黃)"], "攝影": ["盧以朋(黃)"], "器材": ["李昊明(黑)"] } }
        ]
      },
      /* 第 3 週 — 例行賽（已完成） */
      {
        type: "game", week: 3, date: "2026/1/24", phase: "例行賽", venue: "中正",
        matchups: [
          { combo: 1, home: "綠", away: "紅", homeScore: 29, awayScore: 23, status: "finished" },
          { combo: 2, home: "藍", away: "黑", homeScore: 10, awayScore: 15, status: "finished" },
          { combo: 3, home: "黃", away: "白", homeScore: 16, awayScore: 21, status: "finished" },
          { combo: 4, home: "黑", away: "綠", homeScore: 18, awayScore: 31, status: "finished" },
          { combo: 5, home: "紅", away: "黃", homeScore: 21, awayScore: 18, status: "finished" },
          { combo: 6, home: "白", away: "藍", homeScore: 16, awayScore: 10, status: "finished" }
        ],
        games: [
          { num: 1, time: "", home: "綠", away: "紅", homeScore: 29, awayScore: 23, status: "finished", staff: { "裁判": ["胡展綸(藍)","李崢嶸(藍)","林昇德(白)"], "場務": ["林毅豐(黑)","吳佳憲(藍)","陳泓瑋(白)"], "攝影": ["林浚鑫(白)"], "器材": ["陳曉川(白)","趙尹旋(紅)"] } },
          { num: 2, time: "", home: "藍", away: "黑", homeScore: 10, awayScore: 15, status: "finished", staff: { "裁判": ["林昇德(白)","陳鼎煬(黃)","趙伯熙(綠)"], "場務": ["張仁豪(綠)","李艾恩(紅)","李世昌(黃)"], "攝影": ["涂意証(綠)"], "器材": ["陳彥汗(白)","李昊明(黑)"] } },
          { num: 3, time: "", home: "黃", away: "白", homeScore: 16, awayScore: 21, status: "finished", staff: { "裁判": ["李崢嶸(藍)","李勁緯(藍)","李子昂(黑)"], "場務": ["楊秉諺(綠)","張裕棠(黑)","喻柏淵(黑)"], "攝影": ["涂意証(綠)"], "器材": ["林光偉(綠)"] } },
          { num: 4, time: "", home: "黑", away: "綠", homeScore: 18, awayScore: 31, status: "finished", staff: { "裁判": ["江錒哲(黃)","竺立梵(白)","胡展綸(藍)"], "場務": ["李宗漢(黃)","陳彥廷(黃)","王昶竣(白)"], "攝影": ["陳頤(藍)"], "器材": ["吳家豪(綠)"] } },
          { num: 5, time: "", home: "紅", away: "黃", homeScore: 21, awayScore: 18, status: "finished", staff: { "裁判": ["粘智翔(藍)","陳怡舟(白)","竺立梵(白)"], "場務": ["黃偉訓(綠)","董鎧維(藍)","連育樟(綠)"], "攝影": ["林浚鑫(白)"], "器材": ["韋承志(紅)"] } },
          { num: 6, time: "", home: "白", away: "藍", homeScore: 16, awayScore: 10, status: "finished", staff: { "裁判": ["陳國弘(黑)","江錒哲(黃)","陳鼎煬(黃)"], "場務": ["江禮安(黃)","連育樟(綠)","李道頤(綠)"], "攝影": ["陳鈞銘(黃)"], "器材": ["趙尹旋(紅)"] } }
        ]
      },
      /* 第 4 週 — 例行賽（已完成） */
      {
        type: "game", week: 4, date: "2026/1/31", phase: "例行賽", venue: "中正",
        matchups: [
          { combo: 1, home: "黃", away: "黑", homeScore: 19, awayScore: 18, status: "finished" },
          { combo: 2, home: "綠", away: "藍", homeScore: 19, awayScore: 20, status: "finished" },
          { combo: 3, home: "紅", away: "白", homeScore: 24, awayScore: 20, status: "finished" },
          { combo: 4, home: "藍", away: "黃", homeScore: 8, awayScore: 21, status: "finished" },
          { combo: 5, home: "黑", away: "紅", homeScore: 14, awayScore: 16, status: "finished" },
          { combo: 6, home: "白", away: "綠", homeScore: 25, awayScore: 19, status: "finished" }
        ],
        games: [
          { num: 1, time: "", home: "黃", away: "黑", homeScore: 19, awayScore: 18, status: "finished", staff: { "裁判": ["粘智翔(藍)","彥榕(白)","陳怡舟(白)"], "場務": ["韋承志(紅)","趙伯熙(綠)","楊秉諺(綠)"], "攝影": ["陳頤(藍)"], "器材": ["陳曉川(白)","李政軒(黑)"] } },
          { num: 2, time: "", home: "綠", away: "藍", homeScore: 19, awayScore: 20, status: "finished", staff: { "裁判": ["彥榕(白)","李世昌(黃)","林昇德(白)"], "場務": ["阮柏翰(紅)","林顥軒(紅)","盧以朋(黃)"], "攝影": ["楊凱翔(紅)"], "器材": ["陳彥汗(白)","李昊明(黑)"] } },
          { num: 3, time: "", home: "紅", away: "白", homeScore: 24, awayScore: 20, status: "finished", staff: { "裁判": ["胡展綸(藍)","李子昂(黑)","錢威遠(綠)"], "場務": ["江禮安(黃)","李世昌(黃)","陳鈞銘(黃)"], "攝影": ["涂意証(綠)"], "器材": ["徐子超(白)","趙尹旋(紅)"] } },
          { num: 4, time: "", home: "藍", away: "黃", homeScore: 8, awayScore: 21, status: "finished", staff: { "裁判": ["錢威遠(綠)","竺立梵(白)","趙伯熙(綠)"], "場務": ["彥榕(白)","陳泓瑋(白)","林毅豐(黑)"], "攝影": ["楊承達(黑)"], "器材": ["林光偉(綠)"] } },
          { num: 5, time: "", home: "黑", away: "紅", homeScore: 14, awayScore: 16, status: "finished", staff: { "裁判": ["李勁緯(藍)","林昇德(白)","錢威遠(綠)"], "場務": ["陳彥廷(黃)","董鎧維(藍)","吳冠德(黃)"], "攝影": ["王進興(藍)"], "器材": ["韋承志(紅)"] } },
          { num: 6, time: "", home: "白", away: "綠", homeScore: 25, awayScore: 19, status: "finished", staff: { "裁判": ["李昊明(黑)","胡展綸(藍)","粘智翔(藍)"], "場務": ["韋承志(紅)","張裕棠(黑)","喻柏淵(黑)"], "攝影": ["梁修綸(黑)"], "器材": ["陳曉川(白)","吳家豪(綠)"] } }
        ]
      },
      /* 第 5 週 — 例行賽（已完成，最新） */
      {
        type: "game", week: 5, date: "2026/2/7", phase: "例行賽", venue: "三重",
        matchups: [
          { combo: 1, home: "黃", away: "綠", homeScore: 19, awayScore: 21, status: "finished" },
          { combo: 2, home: "黑", away: "白", homeScore: 29, awayScore: 15, status: "finished" },
          { combo: 3, home: "紅", away: "藍", homeScore: 20, awayScore: 9, status: "finished" },
          { combo: 4, home: "白", away: "黃", homeScore: 15, awayScore: 17, status: "finished" },
          { combo: 5, home: "綠", away: "紅", homeScore: 22, awayScore: 21, status: "finished" },
          { combo: 6, home: "藍", away: "黑", homeScore: 14, awayScore: 17, status: "finished" }
        ],
        games: [
          { num: 1, time: "", home: "黃", away: "綠", homeScore: 19, awayScore: 21, status: "finished", staff: { "裁判": ["李昊明(黑)","李政軒(黑)","陳怡舟(白)"], "場務": ["林毅豐(黑)","喻柏淵(黑)","王昶竣(白)"], "攝影": ["陳曉川(白)"], "器材": ["林光偉(綠)"] } },
          { num: 2, time: "", home: "黑", away: "白", homeScore: 29, awayScore: 15, status: "finished", staff: { "裁判": ["吳軒宇(紅)","江錒哲(黃)","趙伯熙(綠)"], "場務": ["阮柏翰(紅)","馮是翔(藍)","余芑滌(紅)"], "攝影": ["林志偉(黃)"], "器材": ["徐子超(白)","李子昂(黑)"] } },
          { num: 3, time: "", home: "紅", away: "藍", homeScore: 20, awayScore: 9, status: "finished", staff: { "裁判": ["梁修綸(黑)","陳鼎煬(黃)","林志柏(黑)"], "場務": ["江禮安(黃)","李宗漢(黃)","李世昌(黃)"], "攝影": ["陳鈞銘(黃)"], "器材": ["韋承志(紅)"] } },
          { num: 4, time: "", home: "白", away: "黃", homeScore: 15, awayScore: 17, status: "finished", staff: { "裁判": ["梁修綸(黑)","粘智翔(藍)","李昊明(黑)"], "場務": ["黃偉訓(綠)","阮柏翰(紅)","馮是翔(藍)"], "攝影": ["楊凱翔(紅)"], "器材": ["吳家豪(綠)"] } },
          { num: 5, time: "", home: "綠", away: "紅", homeScore: 22, awayScore: 21, status: "finished", staff: { "裁判": ["林志柏(黑)","粘智翔(藍)","彥榕(白)"], "場務": ["王進興(藍)","陳泓瑋(白)","吳冠德(黃)"], "攝影": ["楊承達(黑)"], "器材": ["趙尹旋(紅)"] } },
          { num: 6, time: "", home: "藍", away: "黑", homeScore: 14, awayScore: 17, status: "finished", staff: { "裁判": ["陳怡舟(白)","彥榕(白)","林光偉(綠)"], "場務": ["楊秉諺(綠)","連育樟(綠)","張仁豪(綠)"], "攝影": ["涂意証(綠)"], "器材": ["李政軒(黑)"] } }
        ]
      },
      /* 停賽 — 過年連假 */
      { type: "suspended", date: "2026/2/14", venue: "大安", reason: "過年連假" },
      { type: "suspended", date: "2026/2/21", venue: "大安", reason: "過年連假" },
      { type: "suspended", date: "2026/2/28", venue: "大安", reason: "228連假" },
      /* 第 6 週 — 例行賽（未來）— matchups 來自對戰組合表 */
      {
        type: "game", week: 6, date: "2026/3/7", phase: "例行賽", venue: "中正",
        matchups: [
          { combo: 1, home: "黃", away: "藍", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 2, home: "黑", away: "紅", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 3, home: "綠", away: "白", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 4, home: "黑", away: "黃", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 5, home: "藍", away: "綠", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 6, home: "紅", away: "白", homeScore: null, awayScore: null, status: "upcoming" }
        ],
        games: [
          { num: 1, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 2, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 3, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 4, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 5, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 6, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} }
        ]
      },
      /* 第 7 週 — 例行賽（未來）— matchups 來自對戰組合表 */
      {
        type: "game", week: 7, date: "2026/3/14", phase: "例行賽", venue: "中正",
        matchups: [
          { combo: 1, home: "白", away: "黑", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 2, home: "綠", away: "黃", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 3, home: "藍", away: "紅", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 4, home: "黑", away: "綠", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 5, home: "白", away: "藍", homeScore: null, awayScore: null, status: "upcoming" },
          { combo: 6, home: "紅", away: "黃", homeScore: null, awayScore: null, status: "upcoming" }
        ],
        games: [
          { num: 1, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 2, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 3, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 4, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 5, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} },
          { num: 6, time: "", home: "", away: "", homeScore: null, awayScore: null, status: "upcoming", staff: {} }
        ]
      }
    ],
    weeks: {
      "5": { type: "game", week: 5, date: "2026/2/7", phase: "例行賽", venue: "三重", matchups: [
        { combo: 1, home: "黃", away: "綠", homeScore: 19, awayScore: 21, status: "finished" },
        { combo: 2, home: "黑", away: "白", homeScore: 29, awayScore: 15, status: "finished" },
        { combo: 3, home: "紅", away: "藍", homeScore: 20, awayScore: 9, status: "finished" },
        { combo: 4, home: "白", away: "黃", homeScore: 15, awayScore: 17, status: "finished" },
        { combo: 5, home: "綠", away: "紅", homeScore: 22, awayScore: 21, status: "finished" },
        { combo: 6, home: "藍", away: "黑", homeScore: 14, awayScore: 17, status: "finished" }
      ], games: [
        { num: 1, time: "", home: "黃", away: "綠", homeScore: 19, awayScore: 21, status: "finished", staff: { "裁判": ["李昊明(黑)","李政軒(黑)","陳怡舟(白)"], "場務": ["林毅豐(黑)","喻柏淵(黑)","王昶竣(白)"], "攝影": ["陳曉川(白)"], "器材": ["林光偉(綠)"] } },
        { num: 2, time: "", home: "黑", away: "白", homeScore: 29, awayScore: 15, status: "finished", staff: { "裁判": ["吳軒宇(紅)","江錒哲(黃)","趙伯熙(綠)"], "場務": ["阮柏翰(紅)","馮是翔(藍)","余芑滌(紅)"] } },
        { num: 3, time: "", home: "紅", away: "藍", homeScore: 20, awayScore: 9, status: "finished", staff: {} },
        { num: 4, time: "", home: "白", away: "黃", homeScore: 15, awayScore: 17, status: "finished", staff: {} },
        { num: 5, time: "", home: "綠", away: "紅", homeScore: 22, awayScore: 21, status: "finished", staff: {} },
        { num: 6, time: "", home: "藍", away: "黑", homeScore: 14, awayScore: 17, status: "finished", staff: {} }
      ]}
    }
  },

  /* ── 戰績 standings ── */
  standings: {
    season: 25,
    phase: "例行賽",
    currentWeek: 3,
    teams: [
      { rank: 1, name: "綠隊", team: "綠", wins: 4, losses: 2, pct: "66.7%", history: ["L","W","W","L","W","W"], streak: "2連勝", streakType: "win" },
      { rank: 2, name: "紅隊", team: "紅", wins: 4, losses: 2, pct: "66.7%", history: ["W","L","W","W","W","L"], streak: "1連敗", streakType: "lose" },
      { rank: 3, name: "黑隊", team: "黑", wins: 3, losses: 3, pct: "50.0%", history: ["L","W","L","W","W","W"], streak: "2連勝", streakType: "win" },
      { rank: 4, name: "黃隊", team: "黃", wins: 3, losses: 3, pct: "50.0%", history: ["W","W","L","L","L","W"], streak: "1連勝", streakType: "win" },
      { rank: 5, name: "白隊", team: "白", wins: 3, losses: 3, pct: "50.0%", history: ["L","W","W","W","L","L"], streak: "2連敗", streakType: "lose" },
      { rank: 6, name: "藍隊", team: "藍", wins: 1, losses: 5, pct: "16.7%", history: ["L","L","W","L","L","L"], streak: "3連敗", streakType: "lose" }
    ],
    matrix: {
      teams: ["紅","黑","藍","綠","黃","白"],
      results: [
        [null, 1, 1, -1, 1, -1],
        [-1, null, 1, -1, 1, 1],
        [-1, -1, null, -1, -1, -1],
        [1, 1, 1, null, 1, 1],
        [-1, -1, 1, -1, null, 1],
        [1, -1, 1, -1, -1, null]
      ]
    }
  },

  /* ── 積分龍虎榜 dragon ── */
  dragon: {
    season: 25,
    phase: "賽季進行中",
    civilianThreshold: 36,
    columns: ["出席", "輪值", "拖地", "季後賽"],
    players: [
      { rank: 1,  name: "韋承志", team: "紅", tag: "裁", att: 8, duty: 8, mop: 0, playoff: null, total: 16 },
      { rank: 2,  name: "吳家豪", team: "綠", tag: null, att: 6, duty: 6, mop: 0, playoff: null, total: 12 },
      { rank: 3,  name: "李昊明", team: "黑", tag: "裁", att: 8, duty: 3, mop: 1, playoff: null, total: 12 },
      { rank: 4,  name: "趙尹旋", team: "紅", tag: null, att: 7, duty: 3, mop: 0, playoff: null, total: 10 },
      { rank: 5,  name: "李政軒", team: "黑", tag: "裁", att: 8, duty: 1, mop: 0, playoff: null, total: 9 },
      { rank: 6,  name: "楊承達", team: "黑", tag: null, att: 4, duty: 3, mop: 0, playoff: null, total: 7 },
      { rank: 7,  name: "陳鈞銘", team: "黃", tag: null, att: 5, duty: 2, mop: 0, playoff: null, total: 7 },
      { rank: 8,  name: "吳軒宇", team: "紅", tag: null, att: 4, duty: 2, mop: 0, playoff: null, total: 6 },
      { rank: 9,  name: "林志柏", team: "黑", tag: null, att: 4, duty: 2, mop: 0, playoff: null, total: 6 },
      { rank: 10, name: "江錒哲", team: "黃", tag: null, att: 4, duty: 1, mop: 0, playoff: null, total: 5 },
      { rank: 11, name: "謝明澄", team: "藍", tag: null, att: 6, duty: 0, mop: 0, playoff: null, total: 6 },
      { rank: 12, name: "黃偉訓", team: "綠", tag: null, att: 6, duty: 0, mop: 0, playoff: null, total: 6 },
      { rank: 13, name: "陳曉川", team: "白", tag: null, att: 6, duty: 0, mop: 0, playoff: null, total: 6 },
      { rank: 14, name: "連育樟", team: "綠", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 15, name: "錢威遠", team: "綠", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 16, name: "陳彥汗", team: "白", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 17, name: "陳怡舟", team: "白", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 18, name: "江浩仲", team: "藍", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 19, name: "李世昌", team: "黃", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 20, name: "林志偉", team: "黃", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 21, name: "黃凱傑", team: "黃", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 22, name: "林光偉", team: "綠", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 23, name: "陳威宇", team: "綠", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 24, name: "高嘉揚", team: "白", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 25, name: "喻柏淵", team: "黑", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 26, name: "許勝傑", team: "紅", tag: null, att: 6, duty: 0, mop: 0, playoff: null, total: 6 },
      { rank: 27, name: "林毅豐", team: "黑", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 28, name: "楊志達", team: "藍", tag: null, att: 5, duty: 0, mop: 0, playoff: null, total: 5 },
      { rank: 29, name: "余芑滌", team: "紅", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 30, name: "阮柏翰", team: "紅", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 31, name: "馮是翔", team: "藍", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 32, name: "王建翔", team: "藍", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 33, name: "陳宥竹", team: "藍", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 34, name: "吳冠德", team: "藍", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 35, name: "王昶竣", team: "白", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 36, name: "陳彥廷", team: "黃", tag: null, att: 4, duty: 0, mop: 0, playoff: null, total: 4 },
      { rank: 37, name: "朱裕熙", team: "綠", tag: null, att: 0, duty: 0, mop: 0, playoff: null, total: 0 }
    ],
    rulesLink: "https://ink-ulna-616.notion.site/1d4a155d96b6809fa811fbbe61f317dd?source=copy_link"
  },

  /* ── 輪值排班 rotation ── */
  rotation: {
    season: 25,
    currentWeek: 3,
    attendance: { present: 36, absent: 8 },
    absentees: [
      "周昱丞(紅)", "蔡一聲(紅)", "林顥軒(紅)", "李艾恩(紅)",
      "李子昂(黑)", "陳國弘(黑)", "梁修綸(黑)", "陳彥仰(黑)"
    ],
    assignments: [
      { role: "裁判", icon: "⚖️", staff: [
        { name: "李昊明", team: "黑", count: 8 },
        { name: "李政軒", team: "黑", count: 8 },
        { name: "陳怡舟", team: "白", count: 6 }
      ]},
      { role: "場務", icon: "🏃", staff: [
        { name: "林毅豐", team: "黑", count: 3 },
        { name: "喻柏淵", team: "黑", count: 4 },
        { name: "王昶竣", team: "白", count: 4 }
      ]},
      { role: "攝影", icon: "📷", staff: [
        { name: "陳曉川", team: "白", count: 6 }
      ]},
      { role: "器材", icon: "🎒", staff: [
        { name: "林光偉", team: "綠", count: 6 }
      ]},
      { role: "數據", icon: "📊", bonus: "+1積分", staff: [
        { name: "韋承志", team: "紅", count: 8 }
      ]}
    ],
    cumulativeRanking: [
      { rank: 1, name: "韋承志", team: "紅", referee: 0, court: 0, photo: 0, equip: 0, data: 8, total: 8 },
      { rank: 2, name: "吳家豪", team: "綠", referee: 0, court: 0, photo: 0, equip: 0, data: 6, total: 6 },
      { rank: 3, name: "李昊明", team: "黑", referee: 3, court: 0, photo: 0, equip: 0, data: 0, total: 3 }
    ]
  },

  /* ── 數據統計 stats ── */
  stats: {
    "25": {
      label: "第 25 屆 · 本季個人排行榜",
      scoring: [
        { name: "黃偉訓", team: "綠", val: 9.55, p2: "55.6%", p3: "20.0%", ft: "57.5%" },
        { name: "吳軒宇", team: "紅", val: 7.62, p2: "46.5%", p3: "21.2%", ft: "51.3%" },
        { name: "吳家豪", team: "綠", val: 7.00, p2: "48.3%", p3: "25.5%", ft: "53.8%" },
        { name: "陳彥汗", team: "白", val: 6.68, p2: "35.9%", p3: "22.5%", ft: "55.8%" },
        { name: "李世昌", team: "黃", val: 5.14, p2: "42.0%", p3: "14.0%", ft: "52.0%" },
        { name: "韋承志", team: "紅", val: 4.88, p2: "50.2%", p3: "11.5%", ft: "60.0%" },
        { name: "李昊明", team: "黑", val: 4.76, p2: "44.8%", p3: "18.2%", ft: "48.5%" },
        { name: "梁修綸", team: "黑", val: 4.60, p2: "41.3%", p3: "22.0%", ft: "50.0%" },
        { name: "趙尹旋", team: "紅", val: 4.44, p2: "38.5%", p3: "15.8%", ft: "53.3%" },
        { name: "江浩仲", team: "藍", val: 4.20, p2: "36.2%", p3: "10.0%", ft: "46.7%" }
      ],
      rebound: [
        { name: "陳曉川", team: "白", val: 4.90, off: 1.4, def: 3.5 },
        { name: "江浩仲", team: "藍", val: 4.84, off: 1.3, def: 3.5 },
        { name: "林毅豐", team: "黑", val: 4.08, off: 1.1, def: 3.0 },
        { name: "李政軒", team: "黑", val: 4.04, off: 1.2, def: 2.8 },
        { name: "吳家豪", team: "綠", val: 3.48, off: 0.9, def: 2.6 },
        { name: "趙尹旋", team: "紅", val: 3.22, off: 0.8, def: 2.4 },
        { name: "陳彥汗", team: "白", val: 3.10, off: 0.7, def: 2.4 },
        { name: "黃偉訓", team: "綠", val: 3.10, off: 1.0, def: 2.1 },
        { name: "李世昌", team: "黃", val: 2.88, off: 0.6, def: 2.3 },
        { name: "許勝傑", team: "紅", val: 2.70, off: 0.5, def: 2.2 }
      ],
      assist: [
        { name: "梁修綸", team: "黑", val: 1.61 },
        { name: "陳彥廷", team: "黃", val: 1.15 },
        { name: "吳家豪", team: "綠", val: 1.11 },
        { name: "連育樟", team: "綠", val: 1.09 },
        { name: "吳軒宇", team: "紅", val: 0.98 },
        { name: "江浩仲", team: "藍", val: 0.92 },
        { name: "韋承志", team: "紅", val: 0.85 },
        { name: "楊承達", team: "黑", val: 0.78 },
        { name: "趙尹旋", team: "紅", val: 0.72 },
        { name: "李世昌", team: "黃", val: 0.68 }
      ],
      steal: [
        { name: "謝明澄", team: "藍", val: 1.50 },
        { name: "錢威遠", team: "綠", val: 1.44 },
        { name: "李世昌", team: "黃", val: 1.36 },
        { name: "楊承達", team: "黑", val: 1.15 },
        { name: "韋承志", team: "紅", val: 1.08 },
        { name: "吳軒宇", team: "紅", val: 0.96 },
        { name: "吳家豪", team: "綠", val: 0.81 },
        { name: "陳彥汗", team: "白", val: 0.72 },
        { name: "梁修綸", team: "黑", val: 0.68 },
        { name: "江浩仲", team: "藍", val: 0.60 }
      ],
      block: [
        { name: "許勝傑", team: "紅", val: 0.84 },
        { name: "韋承志", team: "紅", val: 0.62 },
        { name: "林志偉", team: "黃", val: 0.57 },
        { name: "王昶竣", team: "白", val: 0.45 },
        { name: "林毅豐", team: "黑", val: 0.42 },
        { name: "江浩仲", team: "藍", val: 0.38 },
        { name: "陳曉川", team: "白", val: 0.35 },
        { name: "黃偉訓", team: "綠", val: 0.33 },
        { name: "李昊明", team: "黑", val: 0.30 },
        { name: "趙伯熙", team: "綠", val: 0.28 }
      ],
      eff: [
        { name: "黃偉訓", team: "綠", val: 7.75 },
        { name: "吳家豪", team: "綠", val: 6.25 },
        { name: "吳軒宇", team: "紅", val: 4.51 },
        { name: "梁修綸", team: "黑", val: 4.20 },
        { name: "陳曉川", team: "白", val: 4.05 },
        { name: "謝明澄", team: "藍", val: 3.88 },
        { name: "李世昌", team: "黃", val: 3.82 },
        { name: "趙尹旋", team: "紅", val: 3.75 },
        { name: "韋承志", team: "紅", val: 3.60 },
        { name: "林毅豐", team: "黑", val: 3.44 }
      ]
    },
    "24": {
      label: "第 24 屆 · 歷史賽季",
      scoring: [
        { name: "吳軒宇", team: "紅", val: 8.40, p2: "52.1%", p3: "18.5%", ft: "60.0%" },
        { name: "陳曉川", team: "白", val: 7.88, p2: "48.3%", p3: "15.2%", ft: "55.4%" },
        { name: "黃偉訓", team: "綠", val: 7.20, p2: "50.0%", p3: "22.0%", ft: "54.0%" }
      ],
      rebound: [
        { name: "陳曉川", team: "白", val: 5.20, off: 1.6, def: 3.6 },
        { name: "林毅豐", team: "黑", val: 4.55, off: 1.2, def: 3.4 },
        { name: "江浩仲", team: "藍", val: 4.40, off: 1.1, def: 3.3 }
      ],
      assist:  [{ name: "梁修綸", team: "黑", val: 1.82 }],
      steal:   [{ name: "錢威遠", team: "綠", val: 1.62 }],
      block:   [{ name: "許勝傑", team: "紅", val: 0.90 }],
      eff:     [{ name: "吳軒宇", team: "紅", val: 8.20 }]
    },
    "19": { "$ref_copy": "19" },
    "18": { "$ref_copy": "19" },
    "17": { "$ref_copy": "19" }
  },

  /* ── 對戰數據 boxscore ── */
  boxscore: {
    season: 25,
    defaultIdx: 0,
    weeks: [
      {
        phase: "例行賽", weekNum: 1,
        games: [
          {
            weekNum: 1, gameNum: 1, phase: "例行賽",
            homeTeam: "綠", awayTeam: "紅",
            homeScore: 29, awayScore: 23,
            recorder: "火", hasScores: true, countsForStats: true,
            homeTot:  { fg2miss:11,fg2made:12,fg3miss:9,fg3made:1,ftmiss:3,ftmade:2,pts:29,oreb:8,dreb:13,treb:21,ast:8,blk:0,stl:4,tov:7,pf:4 },
            awayTot:  { fg2miss:13,fg2made:9,fg3miss:3,fg3made:0,ftmiss:3,ftmade:5,pts:23,oreb:4,dreb:9,treb:13,ast:10,blk:1,stl:4,tov:7,pf:3 },
            homePlayers: [
              { name:"吳家豪",team:"綠",played:true, fg2miss:1,fg2made:3,fg3miss:4,fg3made:0,ftmiss:0,ftmade:0,pts:6, oreb:0,dreb:4,treb:4,ast:2,blk:0,stl:1,tov:3,pf:0 },
              { name:"黃偉訓",team:"綠",played:true, fg2miss:2,fg2made:8,fg3miss:0,fg3made:0,ftmiss:1,ftmade:1,pts:17,oreb:6,dreb:0,treb:6,ast:0,blk:0,stl:2,tov:1,pf:0 },
              { name:"曾昱嘉",team:"綠",played:false,fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 },
              { name:"楊秉諺",team:"綠",played:true, fg2miss:1,fg2made:0,fg3miss:0,fg3made:0,ftmiss:2,ftmade:0,pts:0, oreb:0,dreb:5,treb:5,ast:1,blk:0,stl:0,tov:1,pf:3 },
              { name:"林光偉",team:"綠",played:true, fg2miss:1,fg2made:1,fg3miss:1,fg3made:0,ftmiss:0,ftmade:0,pts:2, oreb:2,dreb:3,treb:5,ast:1,blk:0,stl:0,tov:2,pf:1 },
              { name:"趙伯熙",team:"綠",played:true, fg2miss:1,fg2made:0,fg3miss:2,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:3,blk:0,stl:1,tov:0,pf:0 },
              { name:"連育樟",team:"綠",played:true, fg2miss:2,fg2made:0,fg3miss:1,fg3made:0,ftmiss:0,ftmade:1,pts:1, oreb:0,dreb:1,treb:1,ast:1,blk:0,stl:0,tov:0,pf:0 },
              { name:"張仁豪",team:"綠",played:true, fg2miss:2,fg2made:0,fg3miss:1,fg3made:1,ftmiss:0,ftmade:0,pts:3, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 }
            ],
            awayPlayers: [
              { name:"韋承志",team:"紅",played:true, fg2miss:3,fg2made:2,fg3miss:0,fg3made:0,ftmiss:0,ftmade:2,pts:6, oreb:2,dreb:4,treb:6,ast:1,blk:1,stl:0,tov:5,pf:1 },
              { name:"吳軒宇",team:"紅",played:false,fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 },
              { name:"周昱丞",team:"紅",played:true, fg2miss:3,fg2made:0,fg3miss:1,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:1,dreb:3,treb:4,ast:2,blk:0,stl:0,tov:1,pf:0 },
              { name:"趙尹旋",team:"紅",played:true, fg2miss:3,fg2made:4,fg3miss:0,fg3made:0,ftmiss:0,ftmade:2,pts:10,oreb:0,dreb:0,treb:0,ast:4,blk:0,stl:2,tov:1,pf:0 },
              { name:"陳彥廷",team:"黃",played:true, fg2miss:4,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:1,treb:1,ast:3,blk:0,stl:1,tov:1,pf:1 },
              { name:"陳國弘",team:"黑",played:true, fg2miss:0,fg2made:3,fg3miss:2,fg3made:0,ftmiss:3,ftmade:1,pts:7, oreb:1,dreb:1,treb:2,ast:0,blk:0,stl:1,tov:1,pf:1 }
            ]
          },
          {
            weekNum: 1, gameNum: 2, phase: "例行賽",
            homeTeam: "藍", awayTeam: "黑",
            homeScore: 10, awayScore: 15,
            recorder: "八嘎", hasScores: true, countsForStats: true,
            homeTot:  { fg2miss:12,fg2made:3,fg3miss:8,fg3made:1,ftmiss:2,ftmade:1,pts:10,oreb:6,dreb:11,treb:14,ast:2,blk:0,stl:4,tov:6,pf:9 },
            awayTot:  { fg2miss:12,fg2made:3,fg3miss:3,fg3made:0,ftmiss:2,ftmade:9,pts:15,oreb:6,dreb:16,treb:22,ast:4,blk:1,stl:4,tov:8,pf:4 },
            homePlayers: [
              { name:"李勁緯",team:"藍",played:true, fg2miss:3,fg2made:1,fg3miss:0,fg3made:1,ftmiss:2,ftmade:1,pts:6, oreb:1,dreb:1,treb:2,ast:0,blk:0,stl:1,tov:1,pf:1 },
              { name:"陳頤",  team:"藍",played:true, fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:3,dreb:0,treb:3,ast:1,blk:0,stl:1,tov:0,pf:1 },
              { name:"吳佳憲",team:"藍",played:true, fg2miss:4,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:1,treb:1,ast:0,blk:0,stl:0,tov:2,pf:0 },
              { name:"胡展綸",team:"藍",played:true, fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:1,dreb:4,treb:5,ast:1,blk:0,stl:1,tov:1,pf:1 },
              { name:"粘智翔",team:"藍",played:true, fg2miss:0,fg2made:0,fg3miss:4,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:1,treb:1,ast:0,blk:0,stl:0,tov:0,pf:3 },
              { name:"李崢嶸",team:"藍",played:true, fg2miss:5,fg2made:2,fg3miss:1,fg3made:0,ftmiss:0,ftmade:0,pts:4, oreb:1,dreb:2,treb:3,ast:0,blk:0,stl:1,tov:1,pf:1 },
              { name:"董鎧維",team:"藍",played:true, fg2miss:0,fg2made:0,fg3miss:3,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:2,treb:2,ast:0,blk:0,stl:0,tov:1,pf:2 }
            ],
            awayPlayers: [
              { name:"李昊明",team:"黑",played:true, fg2miss:4,fg2made:1,fg3miss:0,fg3made:0,ftmiss:1,ftmade:1,pts:3, oreb:1,dreb:3,treb:4,ast:1,blk:0,stl:2,tov:1,pf:0 },
              { name:"林毅豐",team:"黑",played:true, fg2miss:2,fg2made:0,fg3miss:0,fg3made:0,ftmiss:1,ftmade:1,pts:1, oreb:2,dreb:6,treb:8,ast:0,blk:1,stl:0,tov:2,pf:1 },
              { name:"林志柏",team:"黑",played:false,fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 },
              { name:"李子昂",team:"黑",played:true, fg2miss:2,fg2made:1,fg3miss:0,fg3made:0,ftmiss:0,ftmade:4,pts:6, oreb:2,dreb:5,treb:7,ast:0,blk:0,stl:1,tov:3,pf:0 },
              { name:"陳國弘",team:"黑",played:true, fg2miss:1,fg2made:1,fg3miss:3,fg3made:0,ftmiss:0,ftmade:1,pts:3, oreb:0,dreb:2,treb:2,ast:1,blk:0,stl:1,tov:1,pf:1 },
              { name:"梁修綸",team:"黑",played:false,fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 },
              { name:"連育樟",team:"綠",played:true, fg2miss:3,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:2,pts:2, oreb:1,dreb:0,treb:1,ast:2,blk:0,stl:1,tov:1,pf:2 }
            ]
          },
          {
            weekNum: 1, gameNum: 3, phase: "例行賽",
            homeTeam: "黃", awayTeam: "白",
            homeScore: 32, awayScore: 18,
            recorder: "昂", hasScores: true, countsForStats: true,
            homeTot:  { fg2miss:8,fg2made:10,fg3miss:5,fg3made:2,ftmiss:1,ftmade:4,pts:32,oreb:5,dreb:8,treb:13,ast:7,blk:1,stl:6,tov:5,pf:5 },
            awayTot:  { fg2miss:14,fg2made:5,fg3miss:4,fg3made:0,ftmiss:2,ftmade:8,pts:18,oreb:6,dreb:11,treb:17,ast:3,blk:0,stl:3,tov:9,pf:6 },
            homePlayers: [
              { name:"李世昌",team:"黃",played:true, fg2miss:1,fg2made:3,fg3miss:1,fg3made:1,ftmiss:0,ftmade:2,pts:11,oreb:0,dreb:2,treb:2,ast:1,blk:1,stl:2,tov:2,pf:1 },
              { name:"陳鼎煬",team:"黃",played:true, fg2miss:2,fg2made:1,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:2, oreb:1,dreb:2,treb:3,ast:2,blk:0,stl:1,tov:1,pf:2 },
              { name:"陳鈞銘",team:"黃",played:true, fg2miss:1,fg2made:2,fg3miss:2,fg3made:1,ftmiss:0,ftmade:0,pts:7, oreb:0,dreb:1,treb:1,ast:2,blk:0,stl:2,tov:0,pf:0 },
              { name:"李宗漢",team:"黃",played:true, fg2miss:1,fg2made:2,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:4, oreb:1,dreb:1,treb:2,ast:1,blk:0,stl:0,tov:1,pf:1 },
              { name:"吳冠德",team:"黃",played:true, fg2miss:2,fg2made:1,fg3miss:1,fg3made:0,ftmiss:0,ftmade:0,pts:2, oreb:2,dreb:1,treb:3,ast:1,blk:0,stl:1,tov:0,pf:0 },
              { name:"盧以朋",team:"黃",played:true, fg2miss:1,fg2made:1,fg3miss:0,fg3made:0,ftmiss:0,ftmade:2,pts:4, oreb:1,dreb:1,treb:2,ast:0,blk:0,stl:0,tov:1,pf:1 },
              { name:"陳彥廷",team:"黃",played:true, fg2miss:0,fg2made:0,fg3miss:1,fg3made:0,ftmiss:1,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 }
            ],
            awayPlayers: [
              { name:"陳曉川",team:"白",played:true, fg2miss:2,fg2made:1,fg3miss:0,fg3made:0,ftmiss:0,ftmade:2,pts:4, oreb:2,dreb:4,treb:6,ast:0,blk:0,stl:0,tov:2,pf:1 },
              { name:"陳彥汗",team:"白",played:false,fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 },
              { name:"徐子超",team:"白",played:true, fg2miss:3,fg2made:1,fg3miss:0,fg3made:0,ftmiss:0,ftmade:1,pts:3, oreb:0,dreb:2,treb:2,ast:1,blk:0,stl:1,tov:2,pf:2 },
              { name:"林昇德",team:"白",played:true, fg2miss:2,fg2made:1,fg3miss:1,fg3made:0,ftmiss:0,ftmade:2,pts:4, oreb:1,dreb:1,treb:2,ast:0,blk:0,stl:1,tov:2,pf:1 },
              { name:"彥榕",  team:"白",played:false,fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0, oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0 },
              { name:"林浚鑫",team:"白",played:true, fg2miss:2,fg2made:0,fg3miss:1,fg3made:0,ftmiss:1,ftmade:1,pts:1, oreb:0,dreb:1,treb:1,ast:1,blk:0,stl:0,tov:1,pf:0 },
              { name:"陳泓瑋",team:"白",played:true, fg2miss:1,fg2made:1,fg3miss:1,fg3made:0,ftmiss:0,ftmade:0,pts:2, oreb:1,dreb:2,treb:3,ast:0,blk:0,stl:1,tov:1,pf:1 },
              { name:"竺立梵",team:"白",played:true, fg2miss:2,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:2,pts:2, oreb:1,dreb:0,treb:1,ast:1,blk:0,stl:0,tov:0,pf:1 },
              { name:"王昶竣",team:"白",played:true, fg2miss:2,fg2made:1,fg3miss:1,fg3made:0,ftmiss:1,ftmade:0,pts:2, oreb:1,dreb:1,treb:2,ast:0,blk:0,stl:0,tov:1,pf:0 }
            ]
          },
          { weekNum:1, gameNum:4, phase:"例行賽", homeTeam:"黑", awayTeam:"綠",
            homeScore:null, awayScore:null, recorder:"", hasScores:false, countsForStats:true,
            homeTot:{fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0,oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0},
            awayTot:{fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0,oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0},
            homePlayers:[], awayPlayers:[] },
          { weekNum:1, gameNum:5, phase:"例行賽", homeTeam:"藍", awayTeam:"黃",
            homeScore:null, awayScore:null, recorder:"", hasScores:false, countsForStats:true,
            homeTot:{fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0,oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0},
            awayTot:{fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0,oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0},
            homePlayers:[], awayPlayers:[] },
          { weekNum:1, gameNum:6, phase:"例行賽", homeTeam:"白", awayTeam:"紅",
            homeScore:null, awayScore:null, recorder:"", hasScores:false, countsForStats:true,
            homeTot:{fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0,oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0},
            awayTot:{fg2miss:0,fg2made:0,fg3miss:0,fg3made:0,ftmiss:0,ftmade:0,pts:0,oreb:0,dreb:0,treb:0,ast:0,blk:0,stl:0,tov:0,pf:0},
            homePlayers:[], awayPlayers:[] }
        ]
      }
    ]
  },

  /* ── 名人堂 hof ── */
  hof: {
    description: "聯盟歷史 · 第11–19屆、第24屆",
    tabs: ["場均數據", "生涯累計", "鐵人榜", "奪冠榜"],
    avgStats: {
      podium: {
        label: "場均得分 TOP 3", unit: "PPG",
        top3: [
          { name: "黃偉訓", team: "綠", val: 9.55 },
          { name: "吳軒宇", team: "紅", val: 7.62 },
          { name: "吳家豪", team: "綠", val: 7.00 }
        ]
      },
      columns: ["#", "球員", "PPG", "RPG", "APG", "BPG", "SPG", "EFF"],
      players: [
        { name: "黃偉訓", ppg: 9.55, rpg: 3.1, apg: 0.6, bpg: 0.13, spg: 0.85, eff: 7.75 },
        { name: "吳軒宇", ppg: 7.62, rpg: 2.4, apg: 0.84, bpg: 0.05, spg: 0.60, eff: 4.51 },
        { name: "吳家豪", ppg: 7.00, rpg: 3.48, apg: 1.11, bpg: 0.13, spg: 0.81, eff: 6.25 },
        { name: "藍提",   ppg: 6.76, rpg: 2.8, apg: 1.03, bpg: 0.05, spg: 0.79, eff: 3.80 },
        { name: "陳彥汗", ppg: 6.68, rpg: 2.5, apg: 0.55, bpg: 0.05, spg: 0.72, eff: 3.12 }
      ]
    },
    totalStats: {
      columns: ["#", "球員", "總得分", "總籃板", "總助攻", "總出賽"],
      players: [
        { name: "吳軒宇", pts: 1418, reb: 524, ast: 157, games: 186 },
        { name: "陳曉川", pts: 1313, reb: 1273, ast: 129, games: 260 },
        { name: "吳家豪", pts: 1232, reb: 613, ast: 195, games: 176 }
      ]
    },
    ironStats: {
      columns: ["#", "球員", "三鐵霸主", "2P鐵", "3P鐵", "FT鐵"],
      players: [
        { name: "陳曉川", total: 1517, p2: 772, p3: 543, ft: 202 },
        { name: "李世昌", total: 1057, p2: 658, p3: 228, ft: 171 },
        { name: "陳國弘", total: 1041, p2: 594, p3: 217, ft: 230 }
      ]
    },
    champStats: { status: "preparing", message: "奪冠榜資料整合中" }
  },

  /* ── 領先榜 leaders ── */
  leaders: {
    leaders: {
      headers: ["", "本季領先榜"],
      rows: [
        ["", "1", "2", "3", "4", "5"],
        ["平均得分", "吳軒宇(紅\n18.5", "陳曉川(黑\n16.2", "吳家豪(綠\n15.8", "韋承志(紅\n14.3", "李昊明(黑\n13.9"],
        ["平均籃板", "李昊明(黑\n9.2", "陳曉川(黑\n8.7", "吳家豪(綠\n5.1", "趙尹旋(紅\n4.5", "吳軒宇(紅\n4.2"],
        ["平均助攻", "吳家豪(綠\n6.3", "韋承志(紅\n5.8", "趙尹旋(紅\n4.7", "李政軒(黑\n3.9", "林子軒(黃\n7.1"],
        ["平均抄截", "李政軒(黑\n2.4", "吳家豪(綠\n2.0", "吳軒宇(紅\n1.8", "韋承志(紅\n1.6", "林子軒(黃\n1.5"]
      ]
    },
    offense: {
      headers: ["隊伍", "得分", "助攻", "進攻籃板", "FG%", "3P%", "FT%", "效率"],
      rows: [
        ["紅隊", "78.3", "18.2", "11.4", "47.5%", "35.2%", "72.1%", "91.2"],
        ["綠隊", "76.1", "19.5", "10.8", "46.3%", "33.8%", "68.7%", "88.5"],
        ["黑隊", "72.4", "16.7", "13.2", "45.8%", "31.4%", "70.3%", "86.9"],
        ["黃隊", "70.8", "17.3", "9.6", "43.2%", "29.7%", "65.4%", "82.7"],
        ["白隊", "68.5", "15.4", "10.1", "42.7%", "28.3%", "67.8%", "80.3"],
        ["藍隊", "63.2", "14.1", "8.9", "39.6%", "25.1%", "63.2%", "74.1"]
      ]
    },
    defense: {
      headers: ["隊伍", "失分", "抄截", "阻攻", "防守籃板", "犯規", "對手FG%", "對手3P%"],
      rows: [
        ["黑隊", "62.1", "8.4", "4.2", "28.7", "18.3", "38.2%", "27.4%"],
        ["紅隊", "64.5", "7.9", "2.8", "25.3", "19.1", "40.1%", "29.3%"],
        ["綠隊", "66.2", "7.2", "3.1", "24.8", "17.6", "41.5%", "30.1%"],
        ["黃隊", "69.3", "6.8", "2.4", "23.1", "20.2", "43.2%", "31.8%"],
        ["白隊", "71.4", "6.1", "2.0", "22.5", "21.7", "44.8%", "33.2%"],
        ["藍隊", "75.8", "5.3", "1.6", "20.9", "23.4", "47.3%", "35.7%"]
      ]
    },
    net: {
      headers: ["隊伍", "得失分差", "助攻差", "籃板差", "抄截差", "效率差"],
      rows: [
        ["紅隊", "+13.8", "+2.1", "+3.8", "+0.4", "+16.7"],
        ["綠隊", "+9.9", "+4.1", "+2.3", "+0.3", "+12.8"],
        ["黑隊", "+10.3", "+0.8", "+8.4", "+1.5", "+14.5"],
        ["黃隊", "+1.5", "+0.5", "+0.4", "-0.1", "+2.1"],
        ["白隊", "-2.9", "-0.9", "-1.4", "-0.8", "-3.7"],
        ["藍隊", "-12.6", "-2.4", "-5.5", "-1.4", "-16.2"]
      ]
    }
  }

};
