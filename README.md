# legal-cloud-platform-ui

`legal-cloud-platform-ui` 是一個基於 Angular 的前端應用程式，與 `legal-cloud-platform-api` 後端 API 結合，提供用戶友好的介面來操作法律雲平台的功能，包括法律文件檢索、帳戶管理、書籤和螢光筆等。旨在建立一個便捷的法律雲平台操作介面。

前端頁面上，本人負責刻畫統計畫面，以及串接會員功能相關 API。專案分工與功能介紹，請參考[`法律雲平台`](https://drive.google.com/file/d/1d-QA9C096Mfpb_jreCERc_OvLr8vXjI0/view?usp=sharing)。

後端 API，詳見於 [`legal-cloud-platform-api`](https://github.com/rikka0823/legal-cloud-platform-api)。

## Key Features

- **案件檢索**：提供多條件的法律案件檢索功能，包括模糊搜尋、裁判字號、裁判日期範圍、案由、案件類型、文件類型、法條和法院等多種篩選條件。
- **全文檢視**：根據案件的裁判字號和法院資訊，獲取裁判書的詳細內容。
- **帳戶管理**：提供用戶註冊、登入、登出、更新個人資料（含個人頭像）、忘記密碼和刪除帳戶等功能。
- **郵件驗證**：在用戶註冊時進行郵件驗證，確保帳戶的有效性。
- **密碼重置**：支援用戶透過郵箱驗證重置遺忘的密碼。
- **用戶資訊**：提供介面獲取用戶的基本資訊和頭像。
- **書籤功能**：允許用戶儲存和管理法律文件的書籤，並提供查詢、新增和刪除單筆書籤的功能。
- **螢光筆功能**：允許用戶在法律文件中標註重點內容，並提供儲存、查詢和刪除單筆螢光筆標註的功能。

## Tech Stack

- **Angular 18.2.9**：前端應用開發框架。
- **HTML、CSS/SCSS、JavaScript/TypeScript**：版面設計、功能撰寫，並以 HttpClient 串接後端 API。
- **Angular Material**：使用官方 UI 元素，便於構建統計頁面等元件。
- **Bootstrap 5**：用於版面設計，便於建立按鈕等元件及美化版面排版。
- **Chart.js**：用於統計數據的圖表化展示。

## Page Display

畫面展示，詳見於 [`法律雲平台`](https://drive.google.com/file/d/1d-QA9C096Mfpb_jreCERc_OvLr8vXjI0/view?usp=drive_link) (第 15 到第 21 頁)。

## API Endpoints

### 案件檢索相關 API

- `POST /case/search`：提交案件檢索條件，獲取案件列表。
- `GET /case/judgmentid`：根據案件 ID 獲取裁判書詳細內容。

### 會員功能相關 API

- `POST /accountSystem/register`：提交註冊資訊，創建新帳戶。
- `GET /accountSystem/verify-email`：驗證用戶的電子郵件。
- `POST /accountSystem/login`：進行用戶登入。
- `POST /accountSystem/update-profile`：提交更新的用戶個人資料。
- `POST /accountSystem/update-profile-picture`：上傳並更新用戶頭像。
- `POST /accountSystem/logout`：請求用戶登出。
- `POST /accountSystem/forgot-password`：請求重置密碼的驗證郵件。
- `GET /accountSystem/verify-password-reset-token`：驗證重置密碼的 token。
- `POST /accountSystem/reset-password`：提交新密碼以重置用戶密碼。
- `POST /accountSystem/get-user-info`：獲取當前用戶的資訊。
- `POST /accountSystem/get-profile-picture`：獲取當前用戶的頭像。
- `POST /accountSystem/delete-user`：請求刪除用戶帳戶。

### 書籤相關 API

- `POST /accountSystem/bookmark`：儲存法律文件書籤。
- `GET /accountSystem/email-all-bookmark`：獲取用戶的所有書籤。
- `POST /accountSystem/delete-bookmark`：刪除指定的書籤。
- `GET /accountSystem/bookmark-already-exists`：檢查書籤是否已存在。

### 螢光筆相關 API

- `POST /accountSystem/seve-highlighte`：儲存判決書上的螢光筆標註。
- `POST /accountSystem/delete-highlighte`：刪除指定的螢光筆標註。
- `GET /accountSystem/email-all-highlighte`：獲取用戶的所有螢光筆標註。
- `GET /accountSystem/highlighte-already-exists`：檢查螢光筆標註是否已存在。

## 後端應用

後端應用負責提供用戶法律查詢與會員等資料庫相關操作功能，並通過 RESTful API 與前端進行串接。

後端專案請參考 [`legal-cloud-platform-api`](https://github.com/rikka0823/legal-cloud-platform-api)。
