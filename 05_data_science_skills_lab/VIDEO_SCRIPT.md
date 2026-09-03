# 🎬 Video Demo Script — Project 5: Data Science & ML Skills Mastery Lab

**Target Duration**: ~1:45 – 2:00 Minutes  
**Focus**: 54 analytical skills, 6 Kaggle benchmark datasets (Titanic, Iris, Housing, Wine, Heart, Diabetes), rich visual interactive dashboard, and hypothesis testing.

---

## ⏱️ Timeline & Step-by-Step Walkthrough

### 1. Project Introduction & Purpose (0:00 – 0:25)
* **What to Say**:  
  *"Welcome to Project 05: The Data Science Skills Mastery Lab. This interactive platform operationalizes 54 distinct data science, statistical testing, and machine learning skills across 6 popular Kaggle datasets. In direct response to feedback requiring rich visual UI rather than raw JSON dumps, every analytical skill renders as a dynamic visual dashboard."*
* **What to Show on Screen**:  
  - Open `http://localhost:5178`.
  - Show the split layout: Target Dataset selector & 54-skill catalog on the left, and the visual execution dashboard on the right.

---

### 2. Core Data Science & Analytics Architecture (0:25 – 0:55)
* **What to Say**:  
  - **6 Benchmark Datasets**: *"The backend includes Titanic Survival, Iris Morphometrics, California Housing, Wine Quality, Heart Disease, and Pima Diabetes."*
  - **54 Skills Grouped into 5 CRISP-DM Phases (`backend/main.py`)**:
    - **EDA & Profiling**: Skewness, Kurtosis, Nullity Maps, Correlation Heatmaps, VIF.
    - **Data Preparation**: Winsorization, IQR filtering, Power Transforms, Robust Scaling, SMOTE.
    - **Statistical Testing**: Welch's t-test, ANOVA F-test, Mann-Whitney U, Chi-Square, Shapiro-Wilk.
    - **Feature Engineering**: PCA Scree plots, Mutual Information, Random Forest Gini importance.
    - **Model Diagnostics**: ROC-AUC curves, Precision-Recall curves, Confusion Matrices.
  - **Visual Payload Engine**: *"The `/api/skills/execute` endpoint transforms analytical computations into structured visualization payloads with KPI metric badges, interactive charts, and executive takeaway conclusions."*

---

### 3. Step-by-Step Live User Flow (0:55 – 1:40)
* **Step 1: Dataset Switching & EDA Distribution (0:55 – 1:10)**
  - Select dataset: **"Titanic Survival"**.
  - Click on **"Feature Distribution & Density Estimation"**:
  - Point out the empirical density histogram, summary KPI badges (Mean: 29.8, Median: 28.0, Skewness: 0.38, Kurtosis: 0.12), and the blue **Analytical Insights Takeaway Banner**.

* **Step 2: Correlation Heatmap on California Housing (1:10 – 1:20)**
  - Switch dataset to **"California Housing"**.
  - Click on **"Pearson / Spearman Correlation Heatmap"**:
  - Show the interactive matrix table with color-coded correlation intensity and feature pair rankings.

* **Step 3: Statistical Hypothesis Testing & Model Diagnostics (1:20 – 1:40)**
  - Select **"Two-Sample Student's / Welch's t-Test"**:
    - Show the cohort mean comparison card ($μ_1$ vs $μ_2$), t-statistic, exact p-value, and the automated statistical significance verdict banner.
  - Switch to **"Receiver Operating Characteristic (ROC-AUC) Curve"**:
    - Show the Confusion Matrix (TP, TN, FP, FN) and ROC-AUC curve with threshold steps (AUC: 0.914).

---

### 4. Closing & Master Wrap-Up (1:40 – 2:00)
* **What to Say**:  
  *"Across all 6 projects—from reactive task workspaces and geospatial taxi regression, to NanoLlama Transformers, customer clustering, market basket mining, and the 54-skill mastery lab—this repository demonstrates production-grade, end-to-end CRISP-DM data science and AI engineering. Thank you for watching!"*
