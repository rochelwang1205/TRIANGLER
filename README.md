# Triangle English

## Screenshot


## Table of contents

- [Overview](#overview)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [The following goals](#the-following-goals)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview
- 在當代的數位化浪潮下，線上課程已經成為現代學習者追求專業知識和技能的重要渠道。PressPlay Academy問卷調查結果發現，線上影音課程是熱門學習媒介前三名，且每週至少投入1至3小時進行線上學習的學習者佔47%，學習時間則是在學校課後、工作結束或假日，而語言學習是各年齡層主要學習的焦點。這個線上英文學習平台主要面向想要在工作後、課後等閒暇時間精進英語能力的學習者，他們有不同的英文學習程度、可投入時間和想要學習的面向。因此平台設計目標是讓使用者能夠快速評估各階段課程內容、根據學習需求規劃個人學習進度。這個介面包括清晰的課程內容和評價概覽，還包括進度追蹤介面，讓學習者能瞭解自己的學習進度和模式。


### Links

- Solution URL: [repo](https://github.com/rochelwang1205/TRIANGLER)
- Live Site URL: [pages](https://rochelwang1205.github.io/TRIANGLER/)

## My process

專案採 **feature-based 目錄結構**（`features/auth`、`courses`、`cart` 等）搭配共用 `components/`、`lib/` 分層，API 層以 `static` / `server` 雙模式運作：本機開發可串接 json-server，GitHub Pages 部署則讀取靜態 `db.json`。前端資料流使用 **TanStack React Query** 管理 server state，表單驗證以 **react-hook-form + Zod** 集中定義 schema，並以 **Vitest** 覆蓋核心 utils 與驗證邏輯。

### Built with

**Frontend**
- React 18、Vite 6、React Router 6
- Bootstrap 5、SASS/SCSS（自訂 BEM 元件樣式）
- TanStack React Query、react-hook-form、Zod
- react-icons

**API & Mock Server**
- Express + json-server（本機 mock API）
- OpenAPI 3.0（Swagger UI）
- 靜態 API 模式（GitHub Pages 部署用）

**Testing & Tooling**
- Vitest、Testing Library
- API smoke test（`npm run test:api`）
- gh-pages 部署至 GitHub Pages

**Architecture**
- Feature modules（auth / courses / cart / profile / recommend…）
- Error Boundary 全域錯誤處理
- Git、Node.js

### The following goals

- ✅ 2026/08/01 Bootstrap 4 → 5 遷移、Vitest 單元測試、Error Boundary
- ✅ 2026/08/01 Feature 目錄重構、React Query 整合、表單驗證
- ✅ 2026/08/01 Explore 進階篩選串接、GitHub Pages base path 對齊
- ✅ 2026/07/30 收藏 API、結帳訂單、課程詳情獨立資料、Swagger 補齊
- ✅ 2026/07/17 CRA → Vite 遷移、靜態/伺服器雙模式 API
- 🖋️ 2025/01/18 layout — navbar、footer、login modal（4hrs）
- 🔥 2024/12/28 本機 client + server 測試、BrowserRouter（3.5hrs）
- ⛓️ 2024/12/25 環境建置 — Swagger mock API
- 🎈 2024/11/29 專案環境初始化


### Useful resources
好用的資源：
- 1. 

## Author
- Website - [Rochel Wang](https://github.com/rochelwang1205)
- Frontend Mentor - [@Rochel Wang](https://www.frontendmentor.io/profile/rochelwang1205)
- Twitter - [@RochelWang4](https://twitter.com/RochelWang4)

## run up in local commend
- client (static API mode)
`npm run dev`
- client + server
`npm run dev:all`
- mock API only
`npm run server`
- deploy GitHub Pages
`npm run deploy`