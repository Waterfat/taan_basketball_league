# 大安ㄍㄤㄍㄤ好籃球聯盟 — 網站拆分版

基於 `mockup-v5.html` 將單一檔案拆分為獨立頁面，共用元件抽出。

## 檔案結構

```
basketball-league/
├── index.html            ← 首頁
├── schedule.html         ← 本週賽程
├── standings.html        ← 戰績榜
├── roster.html           ← 球員名單（出席紀錄）
├── dragon.html           ← 積分龍虎榜
├── stats.html            ← 數據統計
├── rotation.html         ← 輪值排班
├── history.html          ← 歷史賽季
├── hof.html              ← 名人堂
├── announce.html         ← 公告欄
├── shared-styles.css     ← 所有共用 CSS（變數、元件、各頁樣式）
├── shared-app.js         ← 共用 JS（導覽列、隊伍配置、tab 切換、podium 渲染）
├── homepage-design-notes.md  ← 首頁設計筆記
├── 網站內容規劃書.md          ← 完整內容規劃
├── DEVELOPMENT-GUIDELINES.md ← 開發設計準則（新增）
└── README.md
```

## 共用化說明

| 原本散落在各頁的內容 | 抽出位置 |
|---|---|
| CSS 變數、字型、全局 reset | `shared-styles.css` 頂部 |
| 導覽列 HTML（top nav + bottom nav） | `shared-app.js` → `initNavigation()` 動態生成 |
| **隊伍色統一配置** | `shared-app.js` → `TEAM_CONFIG` / `TEAM_BY_ID` |
| **通用 Tab 切換邏輯** | `shared-app.js` → `genericTabSwitch()` |
| **Podium 渲染** | `shared-app.js` → `renderPodium()` |
| **隊伍色 HTML 輔助** | `shared-app.js` → `teamTdHtml()` / `nameTdHtml()` / `rowBgStyle()` |
| Badge / Card / Team color 等共用 class | `shared-styles.css` |
| 各頁面專屬 hero / 表格樣式 | `shared-styles.css`（依頁面分區段） |
| roster / schedule / stats 頁面的 `<style>` | 已移入 `shared-styles.css` |

## 使用方式

直接用瀏覽器開啟 `index.html` 即可（純靜態，無需 server）。
各頁面間以超連結跳轉，導覽列會自動標注當前所在頁面。

## 重構紀錄（v2）

- 將 schedule.html、roster.html、stats.html 中的 `<style>` 區塊全部移入 `shared-styles.css`
- 將各頁面重複定義的隊伍色 mapping 統一為 `TEAM_CONFIG`（shared-app.js）
- 將 stats.html 中重複的 podium 渲染邏輯抽出為共用 `renderPodium()`
- 將各頁面各自實作的 tab 切換函式統一為 `genericTabSwitch()`
- 將 schedule.html 的 `showSchedView()` 移入 shared-app.js
- 新增 `DEVELOPMENT-GUIDELINES.md` 作為未來開發準則
- 更新 README.md 反映完整檔案結構

## 注意事項

- 樣式與原本 mockup-v5.html **100% 一致**，僅重構架構
- 各頁面 HTML 不再包含 `<style>` 標籤
- 隊伍色請統一透過 `TEAM_CONFIG` 取得，不要自行定義
- 新增頁面請參考 `DEVELOPMENT-GUIDELINES.md`
