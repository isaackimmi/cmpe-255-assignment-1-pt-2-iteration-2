# 🎬 Video Demo Script — Project 1: NYC Taxi Trip Duration & Fare Predictor

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 1` (Open `http://localhost:5174`)  
> **Code to Show**: `01_nyc_taxi_trip_prediction/backend/main.py` (Lines 73–93 & 123–136)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 1 is the NYC Taxi Trip Duration and Fare Predictor, inspired by the Kaggle NYC Taxi challenge. It takes pickup and dropoff locations anywhere in New York City, applies trained machine learning regression models, and instantly predicts both travel duration in minutes and estimated taxi fares."*
* **What to Show on Screen**:
  - Open `http://localhost:5174`.
  - Show the split view: Interactive dark NYC street map on the left, and the live prediction summary cards and model leaderboard on the right.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature is the interactive map routing paired with real-time ML inference. If I select a popular preset like 'Times Square to Brooklyn Bridge', the map draws the route and passes the spatial coordinates to our Random Forest model. If I drag the pins on the map, or adjust the time slider to 6:00 PM evening rush hour, you can see the model re-predict the travel time from 18 minutes to 26 minutes with rush-hour fare surcharges applied."*
* **What to Show on Screen**:
  - Click preset: **"Times Square to Brooklyn Bridge"**.
  - Drag one of the map pins slightly and watch the numbers recalculate instantly.
  - Slide the **"Pickup Time of Day"** slider to `18:00 (Rush Hour)`.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The core data science concept is **Supervised Machine Learning Regression & Feature Matrix Assembly**. Rather than using a basic mathematical formula, we combine multiple engineered features—like straight-line distance, street-grid distance, compass angles, passenger count, and rush-hour flags—into a unified feature matrix to train an ensemble of decision trees using `RandomForestRegressor`."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `01_nyc_taxi_trip_prediction/backend/main.py` at lines 73–93 and lines 123–136.
* **Code Snippet**:
  ```python
  # backend/main.py - Feature Matrix Assembly, Model Training & Live ML Inference
  X_train = np.column_stack([
      distances_km, manhattan_km, bearings,
      sample_passengers, sample_hour, sample_day, is_rush_hour.astype(int)
  ])
  y_train = sample_durations

  # Train Random Forest Regression Ensemble
  rf_model = RandomForestRegressor(n_estimators=25, max_depth=8, random_state=42)
  rf_model.fit(X_train, y_train)

  # Live Inference on user route features
  features = np.array([[haversine_dist, manhattan_dist, bearing_deg, req.passenger_count, req.pickup_hour, req.pickup_day_of_week, is_rush]])
  pred_duration = float(rf_model.predict(features)[0])
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, you can see the entire data science modeling pipeline. First, we stack all our engineered spatial and temporal features into `X_train`. Next, we train a `RandomForestRegressor` ensemble to learn the complex non-linear relationships between traffic, distance, and duration. Finally, during live user requests, we feed the new route's feature vector into `rf_model.predict()` to generate accurate duration predictions in under 5 milliseconds."*
