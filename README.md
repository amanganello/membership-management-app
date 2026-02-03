# Fitness Member Management MVP

A full-stack member management system built with **React**, **Node.js**, **TypeScript**, and **PostgreSQL**.

## 📋 Prerequisites

- **Docker Desktop** (Required for Database)
- **Node.js** (v20.20.0 or higher)
- **npm** (v10.2.4 or higher)

---

## 🚀 Local development & running

Choose one of the following methods to run the app.

### Option A: Full Stack Docker (Easiest)
Run the entire stack (Frontend + Backend + Database) in containers.

```bash
docker compose up --build
```
- **Frontend:** http://localhost:8080
- **API:** http://localhost:3000
- **Database:** Port 5432

---

### Option B: Hybrid Local Development (Recommended for Coding)
Run the DB in Docker, but run Frontend/Backend locally for hot-reloading.
## ⚙️ Environment variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env
```

- **Backend (Option B – local dev):** You need a `.env`  in `backend/` with `DATABASE_URL`, `PORT` and NODE_ENV See `.env.example`.
---

#### 1. Start Database
```bash
docker compose up db -d
```

#### 2. Install & Start Backend
```bash
cd backend
npm install
npm run dev
```

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠 Troubleshooting

**Database not seeding?**
If you need to reset the database (delete all data and re-seed):
```bash
docker compose down -v
docker compose up db -d
```

### 3. Access the App
- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **Backend:** [http://localhost:3000](http://localhost:3000)

**Port Conflicts?**
Ensure ports `8080`, `3000`, and `5432` are free on your machine.
