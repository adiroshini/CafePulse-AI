# ☕ CafePulse AI

AI-powered business intelligence platform for café and restaurant owners.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo) |
| Backend | FastAPI (Python) |
| AI | Sarvam AI |
| Database | Neo4j Graph Database |

---

## Features Implemented

| # | Feature | Status |
|---|---------|--------|
| 1 | User Registration & OTP Verification | ✅ |
| 2 | Business Setup Profile | ✅ |
| 3 | Data Upload (Sales, Reviews, Inventory, Feedback) | ✅ |
| 4 | AI Analysis Engine | ✅ |
| 5 | Business Health Dashboard | ✅ |
| 6 | Review Intelligence (Complaints & Strengths) | ✅ |
| 7 | Revenue & Performance Analysis | ✅ |
| 8 | Root Cause Detection (Neo4j) | ✅ |
| 9 | AI Recommendations | ✅ |
| 10 | Voice-Based Assistant (Sarvam AI) | ✅ |
| 11 | Smart Menu Analysis | ✅ |
| 12 | Menu Experiment Engine | ✅ |
| 13 | Smart Combo Generator | ✅ |
| 14 | Inventory Intelligence | ✅ |
| 15 | Customer Exit Prediction | ✅ |
| 16 | What-If Business Simulator | ✅ |
| 17 | Smart Action Tracker | ✅ |
| 18 | Weekly Voice Report | ✅ |
| 19 | WhatsApp & SMS Alerts | ✅ |
| 20 | Continuous Learning Engine | ✅ |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Neo4j Desktop or AuraDB (free tier)
- Expo CLI

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your Neo4j, Sarvam AI, and Twilio credentials

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Expo
npx expo start
```

Scan the QR code with Expo Go app on your phone.

---

## Environment Variables

### Backend `.env`

```env
# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password

# JWT
SECRET_KEY=your_super_secret_key

# Sarvam AI (get key at sarvam.ai)
SARVAM_API_KEY=your_sarvam_api_key

# Twilio (for WhatsApp/SMS alerts)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Frontend API URL

Edit `frontend/src/services/api.ts`:
```ts
const BASE_URL = 'http://YOUR_SERVER_IP:8000';
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/verify-otp` — Verify OTP
- `POST /api/auth/login` — Login
- `POST /api/auth/business-setup` — Create business profile
- `GET /api/auth/me` — Get current user

### Data
- `POST /api/data/upload` — Upload sales/reviews/inventory/feedback
- `GET /api/data/summary` — Get data counts

### Analysis
- `POST /api/analysis/run` — Run full AI analysis
- `GET /api/analysis/dashboard` — Get health dashboard
- `GET /api/analysis/reviews` — Get review breakdown
- `GET /api/analysis/revenue` — Get revenue data
- `GET /api/analysis/inventory` — Get inventory status
- `GET /api/analysis/customer-exit` — Get at-risk customers
- `POST /api/analysis/what-if` — What-if simulator

### AI
- `POST /api/ai/ask` — Ask business question
- `POST /api/ai/weekly-report` — Get weekly voice report
- `POST /api/ai/sentiment` — Analyze text sentiment

### Menu
- `GET /api/menu/analysis` — Menu performance analysis
- `POST /api/menu/experiment` — Create menu experiment
- `GET /api/menu/combos` — Get combo suggestions

### Actions
- `GET /api/actions/pending` — Get pending recommendations
- `POST /api/actions/update` — Mark action as done

### Notifications
- `POST /api/notifications/auto-check` — Check and send alerts

---

## Architecture

```
User
 ↓
React Native App (Expo)
 ↓ REST API
FastAPI Backend
 ├── Auth (JWT)
 ├── Data Upload & Processing
 ├── Analysis Engine
 │    ├── Revenue Analysis
 │    ├── Review Intelligence
 │    ├── Root Cause Detection ────→ Neo4j Graph DB
 │    ├── Customer Exit Prediction → Neo4j Graph DB
 │    └── Recommendations
 ├── AI Layer ──────────────────→ Sarvam AI
 │    ├── NLP (review analysis)
 │    ├── TTS (voice reports)
 │    ├── STT (voice queries)
 │    └── Multilingual (EN/HI/TE)
 ├── Menu Intelligence
 ├── Action Tracker
 └── Notifications ─────────→ Twilio (WhatsApp/SMS)
```

## Neo4j Graph Schema

```
(User)-[:OWNS]->(Business)
(Business)-[:HAS_SALE]->(Sale)-[:FOR_PRODUCT]->(Product)
(Business)-[:HAS_REVIEW]->(Review)
(Customer)-[:WROTE]->(Review)
(Business)-[:HAS_INVENTORY]->(Inventory)
(Business)-[:HAS_FEEDBACK]->(Feedback)
(Customer)-[:GAVE]->(Feedback)
(Business)-[:HAS_EXPERIMENT]->(Experiment)-[:FOR_PRODUCT]->(Product)
(Business)-[:HAS_ACTION]->(Action)
```
