# Fitness Member Management MVP

A full-stack member management system built with **React**, **Node.js**, **TypeScript**, and **PostgreSQL**.

## 📋 Prerequisites

- **Docker Desktop** (Required for Database)
- **Node.js** (v20.20.0 or higher)
- **npm** (v10.2.4 or higher)

---

## 🚀 active Development & Running

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

**Port Conflicts?**
Ensure ports `3000`, `5173`, and `5432` are free on your machine.
