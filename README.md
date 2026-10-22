# 李冠廷｜個人履歷與專案作品集

以白色、深灰與低飽和藍色為主的響應式履歷網站，整理李冠廷的系統開發、醫療資訊、數據自動化、電腦視覺與研究經歷。網站從 320 px 手機螢幕到桌面皆可使用，個人照片保留自然彩色。

正式網址：<https://fr3636k.github.io/resume/>

## 技術與部署

- 原生 HTML、現代 CSS、JavaScript 與 Node.js 靜態建置。
- 零第三方前端套件、無資料庫、無 API 金鑰。
- GitHub Actions 自動建置並部署 `dist/` 到 GitHub Pages。
- canonical、Open Graph、Person 結構化資料、sitemap、404 與舊網址轉址。
- 鍵盤焦點、狀態播報、減少動畫偏好與 A4 列印樣式。

此網站適合繼續使用 GitHub Pages。內容完全是靜態資料，GitHub 可同時提供版本控制、自動部署和公開原始碼，不需要另建 OpenAI 或其他應用伺服器。

## 本機預覽

需要 Node.js 22 或更新版本，不需要執行 `npm install`。

```sh
npm run build
npm run check
npm run dev
```

開啟 <http://127.0.0.1:4173/resume/>。建置結果位於 `dist/`，請勿直接修改該資料夾，因為下次建置會覆寫。

## 內容管理子頁

開啟正式網站的 <https://fr3636k.github.io/resume/editor/>，或本機預覽的 <http://127.0.0.1:4173/resume/editor/>。

編輯器可維護基本資料、工作經歷、專案、技能、學歷、研究方向、活動與證照，並支援：

- 自動將草稿保存在目前瀏覽器的 `localStorage`。
- 新增、刪除及調整工作經歷、專案與技能順序。
- 匯入既有 JSON，或下載格式化的 `resume.json`。
- 手機版操作，不會把內容傳到外部服務。

GitHub Pages 無法安全地直接寫回 repository，因此發布流程是：

1. 在編輯器完成修改並下載 `resume.json`。
2. 用下載檔取代 `content/resume.json`。
3. 執行 `npm run build` 與 `npm run check`。
4. 依下方提交規範 commit 並 push；GitHub Actions 會自動部署。

## 平常要改哪裡

| 需求 | 檔案 |
| --- | --- |
| 姓名、聯絡方式、經歷、專案、證照 | `content/resume.json` |
| 內容管理子頁 | `src/editor.html`、`src/editor.css`、`src/editor.js` |
| 個人照片 | `src/portrait.jpg` |
| 可公開閱讀的論文 | `src/papers/` |
| 履歷色彩、排版、手機版、列印樣式 | `src/style.css` |
| 履歷導覽、專案篩選、複製信箱 | `src/app.js` |
| 網頁結構、SEO、建置規則 | `scripts/build.mjs` |
| GitHub 自動部署 | `.github/workflows/deploy.yml` |

`showPhone` 預設為 `false`。公開 repository 仍能看到 JSON 原始內容；若不希望電話存在於原始碼，請直接清空 `phone`。

## 網站內容

- 現況：國立臺北教育大學資訊科學系碩士班在學。
- 學士：國立臺中科技大學智慧生產工程系，2025 年 6 月畢業。
- 實務：醫療 App、會員網站、線上掛號、Kiosk、GCP 後端及部署。
- 產業：友達光電超過一年校外實習，涵蓋物料系統、ERP／MES 自動化、資料分析與人因危害辨識。
- 研究：釣魚網站偵測、文獻證據整理與學術寫作。
- 專題：可從專案卡片直接開啟「車用避震器彈簧產品的品質水準評估」完整 PDF。
- 工作經歷以響應式時間軸呈現；手機版會改為單欄閱讀。

公司專案僅公開去識別化的工作內容與個人備審報告所載成果，不上傳內部系統截圖。公開的學術專題 PDF 保留共同作者與指導教授資訊。

## Commit 提交規範

所有提交必須使用 Conventional Commits，格式為：

```text
<type>(<scope>): <繁體中文摘要>
```

可使用的主要類型：

| 類型 | 用途 | 範例 |
| --- | --- | --- |
| `feat` | 新功能或新內容 | `feat(resume): 新增工作經歷時間軸` |
| `fix` | 修正錯誤 | `fix(editor): 修正專案排序功能` |
| `docs` | 文件更新 | `docs(readme): 更新內容維護流程` |
| `test` | 測試新增或調整 | `test(build): 增加論文連結檢查` |
| `refactor` | 不改變功能的程式整理 | `refactor(build): 簡化專案分類產生方式` |

scope 使用簡短英文，例如 `resume`、`editor`、`build`、`deploy`、`readme`。摘要使用繁體中文、動詞開頭，單次提交聚焦同一目的。禁止使用無法辨識內容的訊息，例如 `update`、`fix` 或數字。

## 文件

- [部署文件](docs/DEPLOYMENT.md)
- [維護指南](docs/MAINTENANCE.md)
- [內容核對說明](docs/CONTENT_REVIEW.md)
- [設計參考](docs/DESIGN.md)

## 舊版整理

新版取代重複 HTML、未使用的 logo、重複照片、Notebook 和一次性轉檔腳本。已追蹤的舊版仍可從 Git 歷史找回；正式網站保留舊 HTML 名稱的輕量轉址，避免以前分享的連結直接失效。
