# 🎬 Video Demo Script — Project 1: NYC Taxi Trip Duration & Fare Predictor

**Target Duration**: ~1:45 – 2:00 Minutes  
**Focus**: CRISP-DM spatial machine learning, geospatial distance calculations, Leaflet map routing, and AutoResearch hill climbing.

---

## ⏱️ Timeline & Step-by-Step Walkthrough

### 1. Project Introduction & Purpose (0:00 – 0:25)
* **What to Say**:  
  *"Welcome to Project 01: The NYC Taxi Trip Duration & Fare Prediction Platform. Based on the Kaggle NYC TLC Challenge, this application demonstrates end-to-end CRISP-DM machine learning, spatial feature engineering, multi-model benchmarking, and real-time interactive routing on an NYC Leaflet map."*
* **What to Show on Screen**:  
  - Show the application at `http://localhost:5174`.
  - Highlight the split view: Interactive dark NYC Leaflet map on the left and live ML Prediction Summary cards on the right.

---

### 2. Core Data Science & ML Logic (0:25 – 0:55)
* **What to Say**:  
  - **Geospatial Feature Engineering (`calculate_haversine`, `calculate_manhattan`, `calculate_bearing`)**: *"Raw latitude and longitude coordinates alone lack predictive power. We engineer Great-Circle Haversine distance, L1 Manhattan grid distance, and trigonometric compass bearing angles."*
  - **ML Regressors**: *"We fit an ensemble of Random Forest (45 trees), Gradient Boosted Decision Trees, and Ridge Linear Regression on log-transformed durations."*
  - **Backend API (`backend/main.py`)**: *"The `/api/predict` endpoint processes coordinates, passenger count, pickup hour, and day of week to return duration (minutes), 95% confidence intervals, and fare calculations with NYC TLC surcharge logic in under 5ms."*

---

### 3. Step-by-Step Live User Flow (0:55 – 1:40)
* **Step 1: Interactive Route Selection & Pin Dragging (0:55 – 1:15)**
  - Click on the popular preset: **"Times Square to Brooklyn Bridge"**.
  - Notice the map zoom and animate a dashed route line between Manhattan and Brooklyn.
  - Drag the green **Pickup Pin (P)** or red **Dropoff Pin (D)** slightly on the map: Show how the Haversine distance, Manhattan distance, and duration recalculate instantly.

* **Step 2: Simulate Rush Hour & Model Switching (1:15 – 1:25)**
  - Drag the **"Pickup Time of Day"** slider to `18:00 (Evening Rush)`.
  - Point out the duration increasing from 18 min to 26 min due to the rush hour traffic coefficient.
  - Switch the **Active ML Model** dropdown to `Ridge Linear Regression` to demonstrate multi-model inference.

* **Step 3: AutoResearch Hill Climbing & CRISP-DM Tabs (1:25 – 1:40)**
  - Click on the **"AutoResearch Hill Climbing"** tab: Highlight the iterative experiments where adding Haversine distance cut RMSLE by -21.3%, and Manhattan distance by another -11.4%.
  - Click on the **"CRISP-DM Report"** tab: Briefly show the 6 structured lifecycle phases.

---

### 4. Closing & Takeaway (1:40 – 1:55)
* **What to Say**:  
  *"In summary, Project 1 shows how domain-informed spatial feature engineering and rigorous CRISP-DM methodology produce highly accurate, low-latency urban mobility predictions."*
