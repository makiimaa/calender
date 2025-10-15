# 🧾 Lịch Công Tác UBND Xã Toàn Lưu

## 🌟 Giới thiệu

Hệ thống hiển thị lịch công tác hàng ngày và hàng tuần của UBND xã Toàn Lưu.  
Dữ liệu được tự động đồng bộ mỗi 8 giờ từ cổng thông tin điện tử tỉnh Hà Tĩnh.

**Gồm hai phần chính:**

- 🖥 **Frontend**: Giao diện hiển thị lịch (Next.js)
- ⚙️ **Backend**: API FastAPI thu thập & lưu dữ liệu vào MongoDB

---

## ⚙️ Yêu cầu hệ thống

| Thành phần               | Phiên bản khuyến nghị |
| ------------------------ | --------------------- |
| Python                   | ≥ 3.10                |
| Node.js + npm            | ≥ 18.x                |
| MongoDB Community Server | ≥ 7.x                 |

---

## 🐍 1. Cài đặt Backend (FastAPI)

### 📁 Cấu trúc thư mục

```
backend/
├── main.py
├── models.py
├── scraper.py
└── requirements.txt
```

### 📦 File `requirements.txt`

```txt
fastapi
uvicorn
pymongo
requests
beautifulsoup4
urllib3
```

### 🧱 Bước 1: Tạo môi trường ảo

**💻 macOS / Linux:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

**🪟 Windows (PowerShell):**

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
```

### 🧩 Bước 2: Cài đặt thư viện

```bash
pip install -r requirements.txt
```

### 🍃 Bước 3: Cài đặt MongoDB

**👉 Tải về từ:** https://www.mongodb.com/try/download/community

**macOS:** Tải `.tgz` hoặc cài qua Homebrew:

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Windows:** Chạy file `.msi` → chọn **Run as service**

Sau khi cài, MongoDB sẽ tự chạy ở `mongodb://localhost:27017`

### 🚀 Bước 4: Chạy Backend Server

```bash
uvicorn main:app --reload
```

**Kiểm tra:** Mở trình duyệt tại http://127.0.0.1:8000/docs  
→ Sẽ thấy API docs (Swagger UI)

---

## 🖥 2. Cài đặt Frontend (Next.js)

### 📁 Cấu trúc thư mục

```
frontend/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── logo.svg
└── package.json
```

### 🪄 Bước 1: Cài Node.js

**Tải tại:** https://nodejs.org/en/download  
Chọn bản **LTS (Long Term Support)**

**Kiểm tra:**

```bash
node -v
npm -v
```

### 📦 Bước 2: Cài các package

```bash
cd frontend
npm install
```

### 🚀 Bước 3: Chạy giao diện

```bash
npm run dev
```

**Truy cập:** http://localhost:3000

---

## 🔁 3. Luồng hoạt động

| Thành phần            | Mô tả                                                |
| --------------------- | ---------------------------------------------------- |
| `scraper.py`          | Thu thập lịch từ trang UBND xã                       |
| `main.py`             | Cung cấp API `/daily`, `/weekly`, `/available_dates` |
| `auto_sync()`         | Tự động cập nhật dữ liệu mỗi 8 giờ                   |
| `frontend/page.tsx`   | Hiển thị giao diện chính                             |
| `frontend/layout.tsx` | Cấu trúc layout + favicon + tiêu đề trang            |

---

## 📌 Ghi chú

- Backend mặc định chạy trên port **8000**
- Frontend mặc định chạy trên port **3000**
- Dữ liệu được lưu trong database `lich_toanluu` trên MongoDB
- Hệ thống tự động đồng bộ dữ liệu mỗi 8 giờ
