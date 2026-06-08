# Gastador 💸

An AI-powered expense tracker PWA built for Filipinos. Track your spending, get AI-generated insights, and install it on your phone like a native app.

**Live app:** https://gastador-git-main-prins-projects1.vercel.app

---

## Features

- **AI Categorization** — type an expense description and Gemini auto-detects the category (Jollibee → Food, Grab → Transport, Meralco → Bills, etc.)
- **AI Insights** — monthly spending analysis with practical money-saving tips
- **Charts** — donut chart by category + daily bar chart
- **Budget tracker** — progress bar with green/amber/red indicators
- **Transaction history** — search, filter by category, grouped by date, swipe to delete
- **PWA** — installable from the browser, works offline
- **Firebase Auth** — email/password login, data synced per user

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
| AI | Google Gemini 1.5 Flash |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
gastador/
├── src/
│   ├── pages/          # Dashboard, AddExpense, History, Insights, Login
│   ├── components/     # Navbar, ExpenseCard, SpendingChart, InsightCard, etc.
│   ├── hooks/          # useExpenses, useInsights, useAuth
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
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Frontend

```bash
# Install dependencies
npm install

# Copy and fill in env vars
cp .env.example .env

# Start dev server
npm run dev
```

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy and fill in env vars
cp .env.example .env

# Start server
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
GEMINI_API_KEY=
ALLOWED_ORIGIN=*
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all `VITE_*` env vars in project settings
4. Deploy — Vercel auto-detects Vite

### Backend → Render
1. New Web Service → connect repo
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `GEMINI_API_KEY` and `ALLOWED_ORIGIN` env vars

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
