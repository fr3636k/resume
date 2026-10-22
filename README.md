# 李冠廷｜個人履歷與專案作品集

白底、深灰文字與少量藍色的簡約履歷網站，重點呈現系統開發、數據分析與製造流程改善，個人照片保持原本彩色。採用現代 CSS、原生 JavaScript、Node.js 靜態建置，不需安裝第三方套件，不需資料庫或 API 金鑰。

預定正式網址：<https://fr3636k.github.io/resume/>。是否已部署成功，請以 repository 的 Actions 與 Settings → Pages 狀態為準。

## 本機預覽

安裝 Node.js 22 或更新版本，於此專案目錄執行：

```sh
npm run dev
```

開啟 <http://127.0.0.1:4173/resume/>。更新檔案後，另開終端執行 `npm run build`，再重新整理瀏覽器。預覽服務用 `Ctrl+C` 關閉。不需要 `npm install`。

```sh
npm run build
npm run check
```

建置結果在 `dist/`。請勿直接修改產出檔案，下次建置會覆寫。

## 平常要改哪裡？

| 需求 | 檔案 |
| --- | --- |
| 姓名、聯絡方式、經歷、專案、證照 | `content/resume.json` |
| 個人照片 | `src/portrait.jpg` |
| 色彩、排版、手機版、列印樣式 | `src/style.css` |
| 導覽、專案篩選、複製信箱 | `src/app.js` |
| 網頁結構、SEO、網址轉址 | `scripts/build.mjs` |
| GitHub 自動部署 | `.github/workflows/deploy.yml` |

JSON 的文字用雙引號，最後一個欄位後方不要加逗號。`showPhone` 預設為 `false`，公開網站先以 email 聯絡；若改為 `true`，聯絡區會顯示電話。原始碼中的電話仍屬公開 repository 內容，若不想保留，請直接清空 `phone`。

## 網站功能

- 響應式版面：小螢幕單欄、收合導覽、適合觸控的按鈕。
- 專案分類篩選與可展開的專案說明。
- 點擊 email 寄信、一鍵複製 email。
- 「履歷 PDF」會開啟瀏覽器列印視窗；目的地選「另存為 PDF」。建議 A4、關閉頁首與頁尾。這不是預先上傳的 PDF 檔案。
- 列印時會包含全部專案與展開的說明，結束後恢復原本篩選狀態。
- 直接產出完整 HTML，主要內容不依賴 JavaScript、CDN 或外部字型。
- 鍵盤焦點、跳至內容、狀態播報與減少動畫偏好支援。
- canonical、Open Graph、Person 結構化資料、sitemap、404 與舊網址轉址。

40% 的數字沿用舊履歷。研究所在學由本人於改版對話確認，校名、系所與日期尚待補充；網站未新增未經提供的工作成果、職歷或學歷時間。

## 部署與維護

完整操作見 [部署文件](docs/DEPLOYMENT.md)、[維護指南](docs/MAINTENANCE.md)、[待核對資料](docs/CONTENT_REVIEW.md) 與 [設計參考](docs/DESIGN.md)。

選用 GitHub Pages：此履歷只有靜態內容，直接沿用 GitHub 版本控制與部署，維護路徑較短。OpenAI Sites 也可建置及託管網站，但目前這份作品集不需要額外的應用服務。相關資料：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[OpenAI Sites 官方說明](https://learn.chatgpt.com/docs/sites?surface=web)。

## 舊版整理

新版取代多份重複 HTML、未使用的學校與公司 logo、重複照片、Notebook 和一次性轉檔腳本。已追蹤的舊版仍可從 Git 歷史找回；未曾提交的草稿不在 Git 歷史內。正式網站保留舊 HTML 名稱的輕量轉址，避免以前寄出的連結失效。
