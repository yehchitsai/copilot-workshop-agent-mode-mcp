# 待辦清單 Web App

## 簡介

這是在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，透過簡潔介面練習使用 AI 輔助開發工具建立、修正及維護純前端專案。

## 線上展示

https://yehchitsai.github.io/copilot-workshop-agent-mode-mcp/

> 上述網址為預留格式，部署完成後請換成實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項
- 標記事項為已完成或未完成
- 刪除待辦事項
- 依「全部」、「未完成」及「已完成」篩選事項
- 顯示目前未完成事項數量
- 在篩選結果沒有項目時顯示空狀態提示
- 支援淺色與深色主題，並可依系統設定套用主題
- 使用瀏覽器 localStorage 保存事項與主題偏好
- 支援一般桌面與手機尺寸的響應式版面

## 技術

- HTML：建立待辦清單的頁面結構與表單元件
- CSS：負責版面、主題配色、響應式樣式及互動狀態
- 原生 JavaScript：處理新增、刪除、勾選、篩選、主題切換與畫面更新
- localStorage：在瀏覽器端保存待辦事項及主題偏好
- 純前端實作，不使用框架、套件或外部 CDN

## 開發方式

本專案透過 GitHub Copilot Agent Mode 協助閱讀需求、規劃修改範圍、編寫程式及進行基本驗證。在修正 Issue 的流程中，也使用 MCP 工具讀取 GitHub Issue、建立分支與 Pull Request。

`.github/prompts/fix-issue.prompt.md` 定義了固定的 agentic workflow，將「讀取 Issue、提出計畫、建立分支、修改程式、驗證、提交推送及建立 PR」整理成可重複使用的工作步驟。專案中的 `.github/copilot-instructions.md` 則提供技術限制與程式風格規則，協助開發修改保持在既定範圍內。

## 我學到什麼

- 如何以清楚的 Issue 描述提供需求背景，並確認預期行動與驗證方式。
- 如何在動手修改前先整理計畫、閱讀既有程式及遵循專案規則。
- 如何使用 GitHub Copilot Agent Mode 與 MCP 連結程式修改、Git 分支及 GitHub 工作流程。
- 如何透過提示檔建立可重複的開發流程，而不需要每次重新描述相同步驟。
- 如何從使用者體驗角度處理空狀態，讓篩選後看似消失的資料能得到明確說明。
