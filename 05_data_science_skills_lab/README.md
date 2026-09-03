# Project 5: Data Science & ML Skills Mastery Lab

An interactive Data Science & Machine Learning laboratory platform demonstrating **54 analytical skills** across **6 popular Kaggle datasets** (Titanic, Iris, California Housing, Wine Quality, Heart Disease, Diabetes) with **rich visual interactive dashboards**, statistical hypothesis testing cards, and **CRISP-DM lifecycle workflows**.

## Features
- **54 Analytical Skills**: Full breadth across Data Profiling, Outlier Removal, Statistical Testing, Feature Selection, Dimensionality Reduction, and Model Evaluation.
- **6 Kaggle Datasets**: Titanic, Iris, Housing, Wine, Heart Disease, and Diabetes.
- **Visual Interactive Execution Dashboard**: Replaces raw JSON with structured visual charts, histogram distributions, correlation heatmaps, confusion matrices, and statistical decision banners.
- **CRISP-DM Taxonomy**: Structured phase-by-phase execution path.

## Quick Start
```bash
# Backend (Port 8005)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8005

# Frontend (Port 5178)
cd frontend
npm install
npm run dev
```
Open `http://localhost:5178` in your browser.
