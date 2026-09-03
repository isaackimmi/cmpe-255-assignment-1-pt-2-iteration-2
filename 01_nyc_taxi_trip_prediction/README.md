# Project 1: NYC Taxi Trip Duration & Fare Prediction Platform

An end-to-end Data Science and Machine Learning platform predicting NYC taxi trip durations and fares based on the Kaggle NYC Taxi Challenge, engineered adhering strictly to the **CRISP-DM standard** with interactive Leaflet map estimation, AutoResearch hill climbing experiments, and data science admin diagnostics.

## Features
- **Interactive Geospatial Estimator**: Drag & drop pickup and dropoff pins on NYC Leaflet map with instant duration & fare inference.
- **CRISP-DM Research Report**: Complete 6-phase data science lifecycle breakdown.
- **AutoResearch Hill Climbing**: Chronological experiment tracking showing iterative feature engineering and hyperparameter tuning gains.
- **Model Leaderboard**: Side-by-side performance comparisons (Random Forest, Gradient Boosting, Ridge, Baseline).
- **Admin Diagnostics**: Feature importance weights, residual distributions, and speed heatmaps.

## Quick Start
```bash
# Backend (Port 8000)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (Port 5174)
cd frontend
npm install
npm run dev
```
Open `http://localhost:5174` in your browser.
