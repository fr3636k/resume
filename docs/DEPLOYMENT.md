# 部署到 GitHub Pages

Repository：<https://github.com/fr3636k/resume>

預定網站：<https://fr3636k.github.io/resume/>

## 首次設定

1. 將新版提交並推送到 repository 的預設分支，目前為 `master`。
2. 開啟 repository → **Settings → Pages**。
3. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
4. 開啟 **Actions → Deploy resume to GitHub Pages**，確認執行成功。若先前因 Pages 未啟用而失敗，設定完成後按 **Re-run all jobs**，或透過 **Run workflow** 手動啟動。
5. 開啟部署工作輸出的 `page_url`，以該網址判斷正式發布結果。

工作流程會使用 Node.js 24 執行建置與檢查，只上傳 `dist/`，不會把 Markdown 文件、原始履歷資料檔、建置程式或 repository 內其他資料部署成公開頁面。公開 repository 的原始碼本身仍可由 GitHub 讀取。

## 之後更新

```sh
npm run build
npm run check
git status
git add content/resume.json
git commit -m "Update resume content"
git push origin master
```

若改了照片、樣式或其他檔案，也要將對應檔案加入提交。不要提交 `dist/`。每次推送到預設分支後會重新部署；PR 只執行建置與檢查。非預設的 `main` 或 `master` 分支只建置，不部署。

## 網址與移轉

`content/resume.json` 的 `siteUrl` 必須填正式的 HTTPS 網址，尾端保留 `/`。目前使用 `/resume/` 子路徑，靜態資源均為相對路徑。

舊的 `履歷網頁.html` 與 `履歷網頁2.html` 到 `履歷網頁9.html` 會轉到新版首頁。404 頁的首頁連結使用 `siteUrl`，即使錯誤網址有多層目錄仍可返回。

更換網域時，同步更新 `siteUrl` 與 GitHub Pages 的 Custom domain；若設定 DNS，請依 GitHub 官方文件操作。不要只修改 canonical。

## 常見問題

| 狀況 | 處理方式 |
| --- | --- |
| Configure Pages 失敗、找不到 Pages site | 先在 Settings → Pages 選 GitHub Actions，再重跑工作流程 |
| 網站 404 | 確認 Pages 已啟用、deploy 工作成功、使用輸出的正式網址 |
| 圖片或樣式沒載入 | 確認 build 成功、`dist/assets/` 內容完整，勿更改為以 `/assets/` 開頭的路徑 |
| 文字改了但網站沒更新 | 確認已 commit、push，且最新 Actions 成功；再重新整理瀏覽器 |
| 寫信按鈕沒有反應 | 裝置需要設定郵件程式；也可使用複製信箱 |
| PDF 與畫面不同 | 網站有專用列印樣式；請使用瀏覽器列印，不是螢幕截圖 |

## 回復上一版

在 GitHub 提交歷史找到有問題的提交，以新的 revert commit 回復，推送後重新部署。避免使用強制推送改寫歷史。只需暫時重發上一個版本時，也可從該版本建立修復分支再走正常提交程序。

官方參考：[設定發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 選用：以現有 Git 登入設定檢查 Pages

本機已透過 HTTPS Git 登入 GitHub 時，可使用下列指令。工具從 Git credential helper 取得既有憑證，只存於記憶體，不印出或寫入檔案。

```sh
node scripts/pages.mjs status
node scripts/pages.mjs runs
```

若已決定使用本專案的 Actions 部署，可執行 `node scripts/pages.mjs enable`，將 Pages 建置來源設為 workflow。沒有憑證或權限不足時，回到 Settings → Pages 設定；不需要將 token 放進程式碼。
