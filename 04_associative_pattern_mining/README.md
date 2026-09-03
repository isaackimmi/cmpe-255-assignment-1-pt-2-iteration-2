# Project 4: Market Basket Association Pattern Mining Platform

An enterprise-grade Association Pattern Mining and Market Basket Intelligence platform based on the popular **Kaggle Groceries & Instacart Dataset**, implementing **Apriori** and **FP-Growth** algorithms with interactive **Co-Occurrence Network Graphs**, **Support/Confidence/Lift scatter matrices**, **Live Smart Basket Cross-Sell Recommender**, and **CRISP-DM lifecycle audit**.

## Features
- **Apriori & FP-Growth Mining**: Dynamic frequency extraction supporting Support, Confidence, Lift, Leverage, and Conviction filters.
- **Interactive Co-Occurrence Network Graph**: Visual node-link representation of item affinities and bundle clusters.
- **Live Smart Basket Recommender**: Add products to cart and receive real-time, high-lift basket completion suggestions.
- **Diagnostic Scatter Matrix**: Support vs Confidence distribution color-coded by Lift strength.
- **CRISP-DM Standard**: Full 6-phase retail data science methodology documentation.

## Quick Start
```bash
# Backend (Port 8004)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8004

# Frontend (Port 5177)
cd frontend
npm install
npm run dev
```
Open `http://localhost:5177` in your browser.
