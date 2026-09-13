# 🎬 Video Demo Script — Project 1: NYC Taxi Trip Duration & Fare Predictor

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 1` (Open `http://localhost:5174`)  
> **Code to Show**: `01_nyc_taxi_trip_prediction/backend/main.py` (Lines 34–40)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 1 is the NYC Taxi Trip Duration and Fare Predictor, inspired by the Kaggle NYC Taxi challenge. It takes pickup and dropoff locations anywhere in New York City, applies machine learning models, and instantly estimates both travel duration and total taxi fare."*
* **What to Show on Screen**:
  - Open `http://localhost:5174`.
  - Show the split view: Interactive dark NYC street map on the left, and the live prediction cards and model selector on the right.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature is the interactive map routing. If I select a popular preset like 'Times Square to Brooklyn Bridge', the map draws the route and calculates the trip in milliseconds. If I drag the pickup or dropoff pins on the map, or adjust the time slider to 6:00 PM evening rush hour, you can see the predicted travel time increase from 18 minutes to 26 minutes with rush-hour fare surcharges applied."*
* **What to Show on Screen**:
  - Click preset: **"Times Square to Brooklyn Bridge"**.
  - Drag one of the map pins slightly and watch the numbers recalculate instantly.
  - Slide the **"Pickup Time of Day"** slider to `18:00 (Rush Hour)`.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The core data science concept is **Geospatial Feature Engineering and Regression Modeling**. Raw GPS coordinates like latitude and longitude don't tell a model much on their own. We transform those raw coordinates into real-world driving distances—specifically calculating street-grid distance and compass direction to train our Random Forest model."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `01_nyc_taxi_trip_prediction/backend/main.py` at lines 34–40.
* **Code Snippet**:
  ```python
  # backend/main.py - Manhattan Grid Distance Calculation
  def calculate_manhattan(lat1, lon1, lat2, lon2):
      R = 6371.0 # Earth radius in km
      phi1, phi2 = math.radians(lat1), math.radians(lat2)
      avg_phi = (phi1 + phi2) / 2.0
      dlat = math.radians(abs(lat2 - lat1))
      dlon = math.radians(abs(lon2 - lon1))
      return R * (dlat + dlon * math.cos(avg_phi))
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, this `calculate_manhattan` function computes street grid distance. In New York City, cars cannot fly straight through skyscrapers; they must follow perpendicular streets and avenues. By feeding this realistic grid distance into our machine learning model instead of straight-line distance, we improved prediction accuracy by over 30%."*
