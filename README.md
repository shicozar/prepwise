# PrepWise 🎯
### AI-Powered Mock Interview Coach

> Practice interviews with real questions, speak your answers, and get AI-powered coaching — all in one app.

---

## ✨ Features

- 🤖 **AI Question Generation** — Claude generates role-specific questions from real job postings
- 🎙️ **Speech-to-Text** — Record and transcribe your verbal answers
- 📊 **AI Analysis** — Detailed feedback with scores, strengths, and improvements
- 🎨 **Beautiful UI** — Pastel minimalist design built with React + CSS Modules

---

## 🗂️ Project Structure

```
prepwise/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── assets/
│   └── Dockerfile
├── backend/           # Node.js + Express
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── services/      # External API wrappers
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Anthropic API Key → [console.anthropic.com](https://console.anthropic.com)

### Local Development (without Docker)

**Backend:**
```bash
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit → http://localhost:3000

### With Docker
```bash
# At project root
cp backend/.env.example backend/.env
# Add your keys to backend/.env

docker-compose up --build
```

Visit → http://localhost:3000

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/interview/generate` | Generate interview questions |
| POST | `/api/interview/analyze` | Analyze a candidate's answer |
| POST | `/api/speech/transcribe` | Transcribe audio to text |

---

## 📅 Build Log

| Day | What we built |
|-----|--------------|
| ✅ Day 1 | Project setup, Docker, React UI shell, Node backend skeleton |
| 🔜 Day 2 | AI question generation, interview flow |
| 🔜 Day 3 | Speech-to-Text, answer recording, AI analysis |
| 🔜 Day 4 | Polish, deploy to Render |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, CSS Modules |
| Backend | Node.js, Express |
| AI | Anthropic Claude API |
| Speech | Web Speech API + Whisper/AssemblyAI |
| DevOps | Docker, Docker Compose |
| Hosting | Render (free tier) |

---

## 📝 License

MIT
