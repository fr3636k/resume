# 專案工作規則

- 這是部署到 GitHub Pages `/resume/` 的繁體中文個人履歷。
- 唯一履歷資料來源為 `content/resume.json`；不得虛構任職狀態、學位、日期、成果數字、客戶或專案連結。
- 維持白底、深灰文字與少量藍色，首頁使用乾淨彩色大頭照，內容採連續生涯時間線並清楚標示目前階段，支援 320 px 起的手機版。避免過多漸層、浮動裝飾與廣告式文案。
- 版面在 `src/style.css`、互動在 `src/app.js`、HTML 產生器在 `scripts/build.mjs`。
- 靜態資源使用相對路徑。不要引入伺服器需求、CDN、追蹤工具或前端金鑰。
- 保持零第三方套件，除非新需求有具體必要。
- 修改後執行 `npm run build`、`npm run check`。涉及互動時做瀏覽器驗證；無法執行時據實標註。
- 只有 `dist/` 發布到 Pages；不要提交建置產出。
- 需要發布時沿用現有 repository 與預設分支；不要強制推送或改寫歷史。
- Git commit 一律使用 Conventional Commits：`<type>(<scope>): <繁體中文摘要>`。
- 常用類型為 `feat`、`fix`、`docs`、`test`、`refactor`；scope 使用簡短英文，例如 `resume`、`editor`、`deploy`。
- 範例：`feat(resume): 新增工作經歷時間軸`、`fix(editor): 修正專案排序`、`docs(readme): 更新內容維護流程`。
