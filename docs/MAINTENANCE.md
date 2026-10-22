# 日常維護指南

## 更新內容

1. 修改 `content/resume.json`，將 `updatedAt` 改為這次實際更新日期。
2. 以 `npm run build` 建置、`npm run check` 檢查。
3. 使用 `npm run dev` 預覽；確認文字、圖片與連結。
4. 將修改提交並推送到 GitHub，檢查 Actions。

`updatedAt` 是網站資料編修時間，不表示舊履歷記載的職務或成果都已在當日重新核實。

## 新增專案

複製 `projects` 裡的一筆資料，修改下列欄位：

- `id`：唯一英文代號，例如 `inventory-dashboard`。
- `number`：顯示順序，例如 `04`。
- `category`：目前為 `system`（系統開發）或 `data`（數據與自動化）。
- `categoryLabel`、`name`、`description`：專案類型、名稱與摘要。
- `outcome`、`outcomeDetail`：有根據的成果，沒有數據時用具體描述。
- `tags`：實際使用的工具或流程特點。
- `details`：可展開的工作內容。

新版以專案名稱、摘要與成果文字呈現，不需要製作裝飾示意圖。不必為更新經歷新增框架或套件。

## 研究所資料

`education.graduate` 包含 `school`（校名）、`department`（系所）、`period`（在學期間）、`status`（目前狀態）及 `research`（研究方向或成果陣列）。尚未提供的欄位使用空字串或空陣列，不顯示假資料。若要移除這筆學歷，將 `graduate` 設為 `null`。

## 每次發布前檢查

- 資料：姓名、email、任職起訖、學歷及成果數字正確。
- 手機：測試 320、375、390、430 px 寬，檢查無橫向捲動，選單可開關且點選後收合。
- 互動：全部／系統／數據篩選分別符合預期，專案說明可展開，email 與 GitHub 可開啟。
- 列印：篩選任一類別後列印仍包含全部專案，結束列印後恢復篩選狀態。
- 可用性：以 Tab、Enter 與 Escape 操作，檢查焦點、文字對比及縮放至 200% 的可讀性。
- 部署：確認預設分支的 Actions 成功，正式網址可開啟。

自動檢查涵蓋資料、頁面內錨點、靜態資源及 SEO 結構；不取代實機的視覺、觸控、列印或螢幕閱讀器驗證。改版執行環境若無瀏覽器，不應宣稱這些人工驗證已完成。

## 智慧輔助維護

可把以下指令交給程式助理，並附上真實新增的資料：

> 請依 AGENTS.md 更新 content/resume.json。我新增的經歷如下：……。維持白底、深灰與藍色的簡約風格，個人照片保持彩色，保留手機版與 GitHub Pages 相對路徑。不要推測職稱、日期、成果或工具。更新後執行 npm run build 與 npm run check，回報改動與未完成驗證。

網站本身不需要 AI 金鑰或聊天機器人。之後若要加入真正的 AI 功能，應先確定用途與後端部署方案；不要把金鑰寫進 GitHub 或前端。

## 技術整理

- CSS：Grid、Flexbox、clamp、cascade layers、reduced-motion、print media。
- 互動：原生 DOM、IntersectionObserver、Clipboard API；內容在沒有 JS 時仍存在。
- 建置：Node.js 標準函式庫，產出靜態 HTML 與資源。
- 部署：GitHub Actions 建置與 GitHub Pages 發布。
- 無執行期第三方依賴、追蹤工具、外部字型或 CDN。

每半年檢查一次 Node.js 的支援狀態與 GitHub Actions 官方版本，必要時更新。保持零相依，不代表永遠不需要維護。
