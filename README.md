# PrepWise 🎯
### AI-Powered Mock Interview Coach

> Practice interviews with real questions, speak your answers, and get AI-powered coaching.

🌐 **Live Demo:** [[prepwise on Render](https://prepwise-frontend.onrender.com)] 

---

## ✨ Features

- 🤖 **AI Question Generation** — Claude generates role-specific questions
- 🎙️ **Speech-to-Text** — Record and transcribe your verbal answers  
- 📊 **AI Analysis** — Scores, strengths, improvements per answer
- 📈 **History & Progress** — Track all past sessions and improvement
- 🔐 **Auth** — JWT login, guest mode supported
- 🎨 **Pastel minimalist UI** — React + CSS Modules

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, CSS Modules |
| Backend | Node.js, Express |
| AI | Anthropic Claude Haiku |
| Auth | JWT + bcrypt |
| DB (Users) | PostgreSQL |
| DB (Interviews) | MongoDB |
| DevOps | Docker, Docker Compose |
| Hosting | Render (free tier) |

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- Docker Desktop
- Anthropic API Key → [console.anthropic.com](https://console.anthropic.com)

### Setup

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/prepwise.git
cd prepwise

# 2. Start databases
docker-compose up postgres mongo -d

# 3. Backend
cd backend
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and JWT_SECRET
npm install
npm run dev        # → http://localhost:5001

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev        # → http://localhost:3000
```

### Run everything with Docker
```bash
# Create a .env file at project root with:
# ANTHROPIC_API_KEY=your_key
# JWT_SECRET=your_secret

docker-compose up --build
# → http://localhost:3000
```

---

## ☁️ Deploy to Render (Free)

### 1. MongoDB Atlas (free cloud MongoDB)
- Go to [mongodb.com/atlas](https://mongodb.com/atlas) → free M0 cluster
- Create cluster → get connection string
- Save it as `MONGO_URI`

### 2. Deploy on Render
- Go to [render.com](https://render.com) → New → Blueprint
- Connect your GitHub repo
- Render reads `render.yaml` automatically
- Add these environment variables manually:
  - `ANTHROPIC_API_KEY`
  - `JWT_SECRET`  
  - `MONGO_URI` (from Atlas)
  - `CLIENT_URL` (your frontend Render URL)

### 3. Done!
Render gives you a live URL like `https://prepwise-frontend.onrender.com`

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/interview/generate` | Optional | Generate questions |
| POST | `/api/interview/analyze` | Optional | Analyze answer |
| GET | `/api/interview/history` | Yes | Past sessions |
| GET | `/api/interview/:id` | Yes | One session |
| PATCH | `/api/interview/:id/complete` | Yes | Mark complete |

---

## 📅 Build Log

| Day | What we built |
|-----|--------------|
| ✅ Day 1 | Project setup, Docker, React UI shell, Node backend |
| ✅ Day 2 | Auth (JWT), PostgreSQL, MongoDB, Login/Signup UI |
| ✅ Day 3 | AI questions, speech recording, answer analysis |
| ✅ Day 4 | History page, results detail, Docker prod build, Render deploy |
