# 🎬 Video Demo Script — Project 5: Data Science Skills Mastery Lab

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 5` (Open `http://localhost:5178`)  
> **Code to Show**: `05_data_science_skills_lab/backend/main.py` (Lines 276–280)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 5 is the Data Science Skills Mastery Lab. It's an interactive visual testing ground that implements 54 distinct data science, statistical testing, and machine learning diagnostic skills across 6 classic datasets like Titanic, California Housing, and Iris. Instead of looking at raw text or command outputs, everything is visualized through interactive dashboards."*
* **What to Show on Screen**:
  - Open `http://localhost:5178`.
  - Show the dataset selector at the top and the catalog of 54 skills on the left panel.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"The key feature is the instant visual execution dashboard. If I choose the 'Titanic Survival' dataset and click 'Feature Distribution', it generates a clear histogram, mean, median, and an automatic written takeaway. If I switch to 'California Housing' and run a 'Correlation Heatmap', it creates an interactive matrix showing which housing features relate to price."*
* **What to Show on Screen**:
  - Select **"Titanic Survival"** and click **"Feature Distribution & Density Estimation"**.
  - Switch dataset to **"California Housing"** and click **"Pearson / Spearman Correlation Heatmap"**.
  - Select **"Two-Sample Student's / Welch's t-Test"** to show statistical hypothesis testing.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The core data science concept is **Statistical Hypothesis Testing (Welch's Two-Sample t-Test)**. When comparing two groups of data, you can't just guess if a difference in averages is meaningful. A t-test calculates a statistical p-value to prove whether the difference between groups is real or just random luck."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `05_data_science_skills_lab/backend/main.py` at lines 276–280.
* **Code Snippet**:
  ```python
  # backend/main.py - Statistical Hypothesis Testing (Two-Sample t-Test)
  sample_a = df[primary_col].iloc[:len(df)//2]
  sample_b = df[primary_col].iloc[len(df)//2:]
  t_stat, p_val = stats.ttest_ind(sample_a, sample_b, equal_var=False)
  is_significant = p_val < 0.05
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, this snippet runs Welch's t-test using `scipy.stats`. It compares two cohorts, computes the p-value, and checks if it's below 0.05. This is fundamental in data science because it gives teams mathematical confidence to confirm hypotheses before deploying models into production."*
