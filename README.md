# Gastador 💸

An AI-powered expense tracker PWA built for Filipinos. Track your spending, get AI-generated insights, and install it on your phone like a native app.

**Live app:** https://gastador.vercel.app

---

## Features

- **AI Categorization** — type an expense and Llama 3 auto-detects the category (Jollibee → Food, Grab → Transport, Meralco → Bills, etc.)
- **AI Insights** — monthly spending analysis with practical money-saving tips powered by Groq
- **Charts** — donut chart by category + daily bar chart
- **Budget tracker** — set a monthly budget with a color-coded progress bar
- **Transaction history** — search, filter by category, grouped by date, swipe to delete
- **Profile page** — spending stats, budget editor, account info
- **PWA** — installable from the browser, works offline
- **Firebase Auth** — email/password login, data synced per user
- **Soft Dark UI** — glassmorphism design with purple accent

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State | Zustand |
| Charts | Recharts |
| Auth + DB | Firebase Auth + Firestore |
| PWA | vite-plugin-pwa + Workbox |
| Backend | Python FastAPI |
| AI | Llama 3 via Groq API (free) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
gastador/
├── src/
│   ├── pages/          # Dashboard, AddExpense, History, Insights, Login, Profile
│   ├── components/     # Navbar, ExpenseCard, SpendingChart, InsightCard, etc.
│   ├── hooks/          # useExpenses, useInsights, useAuth, useInstallPrompt
│   ├── services/       # firebase.ts, ai.ts, categorizer.ts
│   ├── store/          # Zustand expense store
│   └── constants/      # categories, theme
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── categorize.py   # POST /categorize
│   │   └── insights.py     # POST /insights
│   └── requirements.txt
└── public/
    └── icons/          # PWA icons
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Firebase project
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Frontend

```bash
npm install
cp .env.example .env   # fill in Firebase + API values
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in GROQ_API_KEY
uvicorn main:app --reload
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`.

---

## Environment Variables

### Frontend (`.env`)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
GROQ_API_KEY=
ALLOWED_ORIGIN=*
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all `VITE_*` env vars in project settings
4. Disable **Deployment Protection** (Settings → Deployment Protection → off) so the PWA manifest loads correctly
5. Deploy — Vercel auto-detects Vite

### Backend → Render
1. New Web Service → connect repo
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `GROQ_API_KEY` and `ALLOWED_ORIGIN` env vars
6. Set runtime to **Python 3.11** (not 3.14+)

---

## Firebase Setup

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Create a **Firestore** database (production mode)
4. Add these security rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## API Endpoints

### `POST /categorize`
```json
{ "description": "Jollibee lunch", "amount": 150 }
→ { "category": "Food" }
```

### `POST /insights`
```json
{
  "month": "June 2026",
  "expenses": [...],
  "total": 8500,
  "budget": 10000,
  "previousMonth": { "total": 9200 }
}
→ [{ "title": "...", "body": "...", "emoji": "..." }]
```
