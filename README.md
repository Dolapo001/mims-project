# 🚀 AdWise AI — Intelligent Campaign Platform Predictor

**AdWise AI** is a production-ready, full-stack intelligence platform that leverages machine learning to predict the optimal social media platform for advertising campaigns. By analyzing historical performance metrics (budget, industry, conversion rates, and demographics), AdWise AI eliminates guesswork, maximizing ROI for digital marketers.

---

## 🏛️ System Architecture

AdWise AI is built on a **Decoupled Microservices Architecture**, ensuring high performance, scalability, and clean separation of concerns.

### 1. 🧠 ML Intelligence Service (`/ml_engine`)
- **Engine**: Scikit-learn (Python).
- **Core Model**: `StackingClassifier` ensemble.
  - **Base Learners**: Random Forest, Gradient Boosting, SVM, Decision Tree.
  - **Meta-Estimator**: Logistic Regression for final probability blending.
- **Preprocessing**: Automated `ColumnTransformer` with `OneHotEncoding` for categorical context and `StandardScaler` for financial metrics.

### 2. ⚡ Backend REST API (`/backend`)
- **Framework**: Django REST Framework (DRF).
- **Authentication**: JWT (JSON Web Tokens) with `SimpleJWT`.
- **Database**: Persistent SQLite (ready for PostgreSQL migration) storing prediction logs and user history.
- **Predictor Service**: Encapsulated logic for artifact loading (`.pkl`) and real-time inference.

### 3. 🎨 Dashboard Frontend (`/frontend`)
- **Framework**: Next.js 15+ (App Router) & React.
- **Styling**: TailwindCSS with premium aesthetics (Glassmorphism, Dark Mode, Framer Motion animations).
- **State Management**: Context API (`AuthContext`, `PredictionContext`, `NotificationContext`).
- **Charts**: Interactive probability radar and distribution charts via Recharts/Lucide.

---

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Logic** | Python 3.12+ | Model training and API development |
| **Interface** | TypeScript / Next.js | High-fidelity dashboard & auth |
| **ML Models** | Scikit-learn | Multi-class platform classification |
| **Security** | SimpleJWT | Secure, stateless authentication |
| **Styling** | TailwindCSS | Responsive, theme-aware UI |

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Python 3.10+
- Node.js 20+ (with npm/yarn)
- Git

### 2. Backend & ML Setup
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python -m venv venv_adwise
source venv_adwise/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations & start server
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📡 API Endpoints (Core)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/token/` | Public | Obtain JWT Access/Refresh tokens |
| `POST` | `/api/accounts/register/` | Public | Create a new user profile |
| `POST` | `/api/predict/` | Private | Run AI prediction engine |
| `GET` | `/api/history/` | Private | Retrieve user-specific history |
| `GET` | `/api/stats/` | Private | Get dashboard analytics summary |

---

## 🧠 ML Engine Methodology

AdWise AI uses a **Feature Engineering Pipeline** to transform raw campaign metrics into predictive tensors:
- **Numerical Features**: Budget, impressions, clicks, conversions, ER, CPC.
- **Categorical Features**: Industry (e.g., Tech, Fashion), Target Demographic (e.g., 18-24), Campaign Goal (e.g., Conversion).

The model optimizes for **Consistency** and **Match Confidence**, providing a ranked list of platform suitabilities rather than a single absolute result.

---

## 🌘 Dark Mode & UI Excellence
AdWise AI supports systemic Dark Mode via `next-themes`. The UI is built with a focus on **Visual Hierarchy**:
- **Glassmorphism**: Translucent cards for dashboard metrics.
- **Micro-Animations**: Subtle transitions for form loading and chart entries.
- **Responsiveness**: Fully optimized for Mobile, Tablet, and Ultra-wide displays.

---

## 📜 License
© 2026 AdWise AI. All Rights Reserved. Built for high-performance marketing intelligence.
