# Implementation Plan - Project 1: NYC Taxi Trip Duration & Fare Prediction Platform

## 1. Executive Summary & Objective
An end-to-end CRISP-DM compliant machine learning platform predicting NYC taxi trip durations and fares based on the Kaggle NYC Taxi challenge. It includes spatial feature engineering (Haversine, Manhattan distance, bearing angles), multi-model benchmarking (Random Forest, Gradient Boosting, Ridge Regression), an interactive Leaflet mapping interface for interactive geospatial routing, an AutoResearch hill climbing experimentation log, and a data science administration suite.

## 2. Architecture & Tech Stack
- **Backend**: FastAPI + Python 3 (Port 8000)
  - Scikit-learn trained ensemble regressors
  - Feature pipeline: Geospatial distance (Haversine, Manhattan), Bearing calculation, Temporal cyclic transforms, Airport boundary detectors
  - REST endpoints: `/api/predict`, `/api/models/leaderboard`, `/api/crispdm`, `/api/autoresearch/hillclimbing`, `/api/sample-trips`
- **Frontend**: React 18 + Vite (Port 5174) + Leaflet / React-Leaflet + Lucide Icons
  - Interactive Map: Pickup & Dropoff pin dragging, route polyline, NYC hotspots
  - Estimator Studio: Live trip duration, fare calculations, confidence bounds, and feature attribution
  - CRISP-DM Methodology Navigator: 6 phases (Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, Deployment)
  - AutoResearch Leaderboard & Hill Climbing Experiments: Feature ablation, RMSE progression, hyperparameter optimization

## 3. Mathematical & Feature Engineering Formulations
- **Haversine Distance**:
  $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
- **Manhattan Distance**:
  $$d_{\text{manhattan}} = r \cdot (|\Delta \phi| + |\Delta \lambda| \cdot \cos(\bar{\phi}))$$
- **Bearing Angle**:
  $$\theta = \arctan2(\sin(\Delta \lambda)\cos(\phi_2), \cos(\phi_1)\sin(\phi_2) - \sin(\phi_1)\cos(\phi_2)\cos(\Delta \lambda))$$

## 4. Verification & Testing
- Model unit tests validating RMSLE $\le 0.38$, RMSE $\le 240$ seconds
- Frontend build validation with zero errors (`npm run build`)
- Cross-coordinate endpoint prediction validation
