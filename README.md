# 李冠廷｜個人履歷與專案作品集

以暖白、深灰與藍紫橘漸層構成的響應式履歷網站。版面採產品發表式敘事，從核心定位沿著一條會隨滾動推進的時間線，依序呈現研究所、醫療與研究專案、友達經歷、大學成果，最後收束到聯絡行動。

網站慣用英文名為 **Chandlar Lee**；中文姓名的護照拼音參考為 **Kuan-Ting Li**。外交部領事事務局對照表中，威妥瑪拼音的「冠」為 `KUAN`、「廷」為 `TING`、「李」為 `LI`。實際證件仍應以既有護照登載為準。

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
- 匯入既有 JSON，或下載 `resume.json` 作為備份。
- 按「儲存並發布」直接提交資料並觸發 GitHub Pages 部署。
- 支援手機版操作；GitHub token 只存在目前分頁的 `sessionStorage`。

第一次直接儲存需要建立只限 `fr3636k/resume` 的 GitHub fine-grained token，repository permission 僅開啟 `Contents: Read and write`。之後的流程為：

1. 在編輯器完成修改。
2. 按「儲存並發布」。
3. 第一次輸入 token；同一分頁後續不必重複輸入。
4. 編輯器使用 GitHub Contents API 建立 `feat(resume): 更新履歷內容` commit。
5. 等待 GitHub Actions 約 1–2 分鐘重新部署。

## 平常要改哪裡

| 需求 | 檔案 |
| --- | --- |
| 姓名、聯絡方式、經歷、專案、證照 | `content/resume.json` |
| 內容管理子頁 | `src/editor.html`、`src/editor.css`、`src/editor.js` |
| 個人照片 | `src/portrait.jpg` |
| 可公開閱讀的論文 | `src/papers/` |
| 履歷色彩、排版、手機版、列印樣式 | `src/style.css` |
| 履歷導覽、時間線進度、複製信箱 | `src/app.js` |
| 網頁結構、SEO、建置規則 | `scripts/build.mjs` |
| GitHub 自動部署 | `.github/workflows/deploy.yml` |

`showPhone` 預設為 `false`。`lineUrl` 填入 LINE 官方加好友網址後，聯絡章節才會顯示「加入我的 LINE」。公開 repository 仍能看到 JSON 原始內容；若不希望電話存在於原始碼，請直接清空 `phone`。

## 網站內容

- 現況：國立臺北教育大學資訊科學系碩士班在學。
- 學士：國立臺中科技大學智慧生產工程系，2025 年 6 月畢業。
- 實務：醫療 App、會員網站、線上掛號、Kiosk、GCP 後端及部署。
- 產業：友達光電超過一年校外實習，涵蓋物料系統、ERP／MES 自動化、資料分析與人因危害辨識。
- 研究：釣魚網站偵測、文獻證據整理與學術寫作。
- 專題：可從大學階段直接開啟「車用避震器彈簧產品的品質水準評估」完整 PDF。
- 所有學歷、經歷與專案整合在同一條響應式時間線，手機版會轉為單欄閱讀。

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
