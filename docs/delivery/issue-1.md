# Issue 1 — Frontend reskin
開工：2026-10-23 UTC+8；使用者驗收首頁預覽後指示套用整站。
## 進度
- [x] Step 1：Issue 讀取與 worktree。
- [x] Step 2：範圍 12 前台頁；首頁預覽已驗收，延展至全站。
- [x] Step 3：實作。
- [x] Step 4：37/37 unit；12頁×4寬48組無溢出，真實操作與離線資源通過。
- [x] Step 5：conventions/architecture/tests 三道通過；切週finding修復後三道複審綠。
- [x] Step 6 本地交付：commit/push/草稿PR已完成；正式站main自動發布，合併前待上線確認。
- [ ] Step 7：待正式上線確認後執行。
- [ ] Step 8：正式站尚未發布，Issue保留開啟。
## Task
- [x] A：shared-app.js + 新 site-theme.css：統一導覽、全站視覺與響應式。
- [x] B：index.html + js/page-home.js + home.css + assets/court.jpg：照核可稿接回真資料。
- [x] C：其他 11 HTML 與 sw.js/manifest.json：資源引用與快取更新。
驗收：既有 tests/test.html 全套；各頁 375/390/768/1440 寬度；導覽/週切換/名單篩選/頁籤/單場入口；設計區塊逐項核對。
整合：首頁個人數據接既有 api.getLeaders；首頁/賽程共用預設週次判斷，避免兩頁選到不同週；去除首頁重複token。
風險：共用樣式影響寬表、內嵌色值、動態重渲染、既有 PWA 快取。
跨 Issue 決策查證：目前無歷史 Issue/delivery；grep shared-styles.css 確認舊奶油/深藍 token，本次已核可淺灰/橘色預覽取代。
併發閘：BUSY=4，CORES=10，MEMFREE=38%，BATCH=4；本批兩支實作代理。
保留既有 js/page-home.js 文字調整；主 repo 未提交檔不清除。
新增保留測試：0；既有 integration：無套件，tests/test.html 為既有瀏覽器 unit。
## 設計稿區塊
- [x] 桌面/手機導覽
- [x] 賽程與週切換
- [x] 球場主視覺
- [x] 球隊戰績
- [x] 個人數據
- [x] 積分龍虎榜
納入流程缺陷：單場成績把0分當成未填，顯示「尚未開打」；api.js 保留有效0分，缺值維持null（2行改4行）。
修復審查發現：首頁換週重新依該週已公告資料選對戰/順序，避免沿用舊週順序時隱藏新週對戰。
驗證證據：.Codex-output/temp/verify-report.md、review-{conventions,architecture,tests}.md；截圖verify-{page}-{390,1440}-20261023-233000.png。
複審併發閘：BUSY=1，CORES=10，MEMFREE=43%，BATCH=6（slot限制3）；三道均唯讀。
## A1 待裁定（本輪）
無。
本輪交付時間：2026-10-23 22:26 UTC+8（開發驗收完成，非正式上線結案）。
摘要：12頁換皮、真資料接線、48尺寸檢查、37單元測試、三道審查通過；待使用者確認上線，保留worktree與Issue。
## 人名閱讀性追加（2026-10-23）
- [x] 實作／驗證／三道審查；更新草稿 PR：全站人名至少18px，保留原本較大標題；黑隊人名700、白隊較輕。
跨 Issue 決策查證：grep shared-styles.css/site-theme.css/home.css 目前人名約.85–.9rem；本輪使用者明示放大與黑隊加粗，優先於原設計。
風險／驗收：人名欄寬與手機溢出、黑白隊動態資料標記；以375/390/768/1440實際頁面驗證，不新增保留測試；既有integration無套件。
追加審查併發閘：BUSY=0，CORES=10，MEMFREE=54%，BATCH=6；三道唯讀分批使用可用slot。
追加驗收：37/37 unit；受影響頁375/390/768/1440人名至少18px、黑700白500、無整頁溢出；三道APPROVE；證據temp/name-verify.md及name-review-*.md。
歷史隊伍裁定：hof為11–19/24屆，未提供隊伍的人名保持中性500，不依當前roster推定過去隊伍。
追加本地交付時間：2026-10-23 22:41 UTC+8；正式站仍待上線。
## 切頁錯誤追加
- [x] SW修復／獨立驗證／三道複審／更新PR：音效Range回應206被cache.put拒絕；不影響網路回應與靜態離線快取。
根因證據：console-repro.cjs真瀏覽器workerErrors=TypeError: Partial response (status code 206) is unsupported；sw.js:70–72以response.ok涵蓋206且寫入未catch。
同款：rg cache.put/respondWith/Range全站僅sw.js一個寫入點；影響所有載入音效的前台頁。unit既有37項，integration無套件；實際分段請求/換頁/離線回退為本輪驗收，不新增保留測試。
本輪併發閘：BUSY=2、CORES=10、MEMFREE=35%、BATCH=6；受slot限制三道唯讀審查分批。
追加結果：unit37/37、桌手機16次導航、Range206成功且未快取、寫入失敗仍200、離線CSS200/miss明確失敗、pageerrors與workerErrors均空；三道APPROVE。
限制：離頁取消Sheets請求仍有黃色warning，對應ERR_ABORTED；未隱藏日誌。證據temp/console-verify-log.json。
本次修復交付：2026-10-23 22:54 UTC+8；預覽驗收完成，正式站仍待上線。
對戰卡片追加（順序返修完成，併發BUSY=6/CORES=10/MEMFREE=47%/BATCH=2，三審分兩批）：隊伍在外、比分在VS左右（使用者更正），沿用既定Sports Editorial與單樹；查證原bs-gc-matchup與score分離且flex-wrap造成右側擁擠。實作→四寬及0/待賽驗證→三道審→更新PR，風險為展開/深連結；無新增保留測試/integration套件。
對戰驗收：37/37；四寬375/390/768/1440對齊/無溢出，真0/未賽/雙隊未定、展開收合/週切換/深連結皆過；平手無真資料、嚴格>程式審。證據temp/score-layout-verify.md；三審通過。追加交付2026-10-23 23:04 UTC+8，未正式上線。
順序更正交付2026-10-23 23:09 UTC+8：使用者明訂左隊｜左比分｜VS｜右比分｜右隊；四寬DOM/畫面順序、對齊、無溢出與展開通過；證據temp/score-order-verify.md，三審複審通過，正式站未更新。
賽程一致性（完成，併發BUSY=6/CORES=10/MEMFREE=35%/BATCH=2，三審分批）：共用比分列覆蓋賽程順序/組合/對戰卡；查證原三處結構分離，使用者明訂隊-分-VS-分-隊，沿用Sports Editorial/單樹。任務共用實作→四寬/切換/展開/連結驗證→三審；風險資料欄位映射、live/0/未知/平手，新保留測試0，integration無套件。
賽程驗收：首次37/37綠；按測試正典移除3條文案/class測試31行後34/34綠；四寬兩頁兩模式/工作人員/成績深連結/0與狀態通過；三審複審通過，證據temp/shared-matchup-verify.md。追加交付2026-10-23 23:22 UTC+8，正式站未更新。
