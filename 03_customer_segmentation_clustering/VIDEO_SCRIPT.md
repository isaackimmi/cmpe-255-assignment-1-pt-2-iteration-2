# 🎬 Video Demo Script — Project 3: Customer Segmentation & Clustering

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 3` (Open `http://localhost:5176`)  
> **Code to Show**: `03_customer_segmentation_clustering/backend/main.py` (Lines 74–76 & 138–139)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 3 is the Customer Segmentation and Clustering Intelligence platform. It uses customer demographic and spending data from Kaggle to automatically group customers into natural behavioral categories—like VIP spenders, budget shoppers, or mainstream consumers—without needing any pre-existing labels."*
* **What to Show on Screen**:
  - Open `http://localhost:5176`.
  - Show the interactive 2D customer scatter plot with 5 distinct color-coded clusters and persona cards.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature is the interactive customer explorer and live profiler. In the scatter plot, each dot is an individual customer. If I filter for 'VIP Luxury Spenders', it highlights high-income, high-spending shoppers. Furthermore, if I go to the 'Live Profiler' tab, enter a 28-year-old making $95k with a spending score of 85, and click classify, the model instantly assigns them to the VIP segment with recommended marketing strategies."*
* **What to Show on Screen**:
  - Filter the cluster dropdown to show `VIP Luxury Spenders`.
  - Switch to the **"Live Profiler"** tab, set Age=28, Income=$95k, Spending=85, and click **"Classify Customer Segment"**.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The primary data science concept is **Unsupervised Clustering with K-Means and Feature Scaling**. Because income is measured in thousands while age is a small two-digit number, we use feature scaling to normalize the data so every characteristic is weighted fairly when finding customer groups."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `03_customer_segmentation_clustering/backend/main.py` at lines 74–76 and lines 138–139.
* **Code Snippet**:
  ```python
  # backend/main.py - Feature Scaling and K-Means Partitioning
  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)

  model = KMeans(n_clusters=k, random_state=42, n_init=10)
  labels = model.fit_predict(X_scaled)
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, we use `StandardScaler` to bring age, income, and spending onto a shared scale, and then apply `KMeans` to group them into 5 clusters. This is the heart of the project: it allows businesses to find patterns in customer data automatically so marketing teams can target each group effectively."*
