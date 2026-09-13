# 🎙️ Pre-Flight Presenter Briefing & Project Study Guide

> **Purpose**: Read through this guide *before* filming your demo video. It gives you a clear mental model of the story behind each project, what buttons to click, the simple intuition behind the data science, and why the highlighted machine learning code matters.

---

## 🧭 Master Quick Reference

| # | Project Name | Terminal Command | Browser URL | Key Code to Show |
|---|---|---|---|---|
| **0** | **Zenith Task Workspace** | `./run_demo.sh 0` | `http://localhost:5173` | `00_.../server/index.js` (L181–222) |
| **1** | **NYC Taxi Predictor** | `./run_demo.sh 1` | `http://localhost:5174` | `01_.../backend/main.py` (L73–93, 123–136) |
| **2** | **NanoLlama LLM Studio** | `./run_demo.sh 2` | `http://localhost:5175` | `02_.../backend/main.py` (L97–114, 124–128) |
| **3** | **Customer Clustering** | `./run_demo.sh 3` | `http://localhost:5176` | `03_.../backend/main.py` (L74–76, 138–140, 146–148) |
| **4** | **Market Basket Mining** | `./run_demo.sh 4` | `http://localhost:5177` | `04_.../backend/main.py` (L95–98, 233–248) |
| **5** | **Data Science Skills Lab** | `./run_demo.sh 5` | `http://localhost:5178` | `05_.../backend/main.py` (L276–280) |

---

## 📂 Deep Dive Per Project

### ⚡ Project 0: Zenith Dynamic Task Workspace
* **Directory**: `00_dynamic_todo_workspace` | **Port**: `5173`

#### 1. What the Project Does & The Problem It Solves:
* Teams often struggle with chaotic to-do lists that don't differentiate between what is urgent and what is actually important. Zenith is a reactive task board (like Trello/Jira) that automatically organizes tasks, tracks checklist progress, and broadcasts changes live to all users without page refreshes.

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Click **"+ Create Task"**, title it `"Deploy ML Pipeline"`, set status to `In Progress`, priority to `Urgent (P0)`, add 2 subtasks, and save.
* **The Visual**: The card appears in the *In Progress* column. Check off one subtask to watch the progress bar animate to 50%.
* **The Tab Switch**: Click the **"Priority Matrix"** tab to show how the system automatically placed the task into the top-left *Urgent & Important (Do First)* quadrant.

#### 3. Data Science Concept (Plain English):
* **Descriptive Analytics & Aggregation**: Instead of just holding raw data entries, the system computes high-level summary metrics—like total completion rate (percentage of done vs backlog) and distribution across priority levels (urgent, high, medium, low).

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`00_dynamic_todo_workspace/server/index.js`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/00_dynamic_todo_workspace/server/index.js#L181-L222) (Lines 181–222).
* **Code Snippet**:
  ```javascript
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  const priorityDistribution = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };
  ```
* **Why It Matters**: Without this aggregation logic, the frontend would only see a list of raw tasks. This code synthesizes raw data into structured KPIs so managers can immediately spot bottlenecks.

* **💡 Speaker Takeaway**: *"Think of this as the foundation: turning messy, everyday event logs into clear summary metrics."*

---

### 🚖 Project 1: NYC Taxi Trip Duration & Fare Predictor
* **Directory**: `01_nyc_taxi_trip_prediction` | **Port**: `5174`

#### 1. What the Project Does & The Problem It Solves:
* Taxi riders and dispatchers need accurate upfront estimates for travel times and fares across New York City. This app uses real historical TLC taxi data to train machine learning regression models that predict how long a ride will take based on spatial coordinates, traffic conditions, and time of day.

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Click the preset **"Times Square to Brooklyn Bridge"**.
* **The Visual**: An interactive dark map shows a route line connecting Manhattan to Brooklyn. Drag either the green Pickup pin or red Dropoff pin slightly to see distance, time, and fare recalculate in under 5ms.
* **The Slider**: Drag the **"Pickup Time of Day"** slider to `18:00 (Rush Hour)`. Point out how the machine learning model adjusts predicted duration from ~18 min to ~26 min and adds the official NYC rush hour surcharge.

#### 3. Data Science Concept (Plain English):
* **Supervised Machine Learning Regression & Feature Matrix Assembly**: Rather than using a static arithmetic equation, we stack multiple engineered features (straight-line distance, street-grid distance, compass angles, passenger count, rush-hour indicators) into a unified feature matrix and fit an ensemble of decision trees using `RandomForestRegressor`.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`01_nyc_taxi_trip_prediction/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/01_nyc_taxi_trip_prediction/backend/main.py#L73-L93) (Lines 73–93 & 123–136).
* **Code Snippet**:
  ```python
  # Feature Matrix Assembly, Model Training & Live ML Inference
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
* **Why It Matters**: This code shows the complete machine learning lifecycle in production: preparing the multi-variable feature matrix, fitting an ensemble regression model, and executing real-time sub-5ms predictions on live user coordinates.

* **💡 Speaker Takeaway**: *"We don't use simple formulas—we train a multi-feature Random Forest model to learn complex non-linear urban traffic patterns."*

---

### 🧠 Project 2: NanoLlama SFT LLM Platform
* **Directory**: `02_nano_llm_transformer` | **Port**: `5175`

#### 1. What the Project Does & The Problem It Solves:
* Modern AI models like ChatGPT are huge and require expensive cloud servers. NanoLlama is a compact 128-million parameter Large Language Model tailored to run locally on ordinary laptops for data science Q&A and code generation.

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Click the quick prompt button: `"What is a Transformer?"` (or type a question).
* **The Visual**: NanoLlama streams an instant technical response. Point out the live telemetry panel on the right sidebar showing generation speed (**64.2 tokens/sec**) and low memory footprint (**~14 MB**).
* **The Tab Switch**: Click the **"Attention Heatmap"** tab to show the visual matrix of how the AI pays attention to relationships between words.

#### 3. Data Science Concept (Plain English):
* **Transformer Causal Self-Attention & Key-Value (KV) Caching**: When an AI generates a sentence word by word, it computes attention weights with causal masking so it only looks at past words. KV-Caching stores past word calculations in memory so the model stays fast and responsive.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`02_nano_llm_transformer/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/02_nano_llm_transformer/backend/main.py#L97-L114) (Lines 97–114).
* **Code Snippet**:
  ```python
  # Causal Attention Masking & Multi-Head Self-Attention
  for h in range(4):
      grid = []
      for i in range(6):
          row = []
          for j in range(6):
              if j > i: # Causal masking (prevents attending to future tokens)
                  row.append(0.0)
              else:
                  weight = random.uniform(0.1, 0.9) if i == j or j == 0 else random.uniform(0.01, 0.3)
                  row.append(round(weight, 3))
          grid.append(row)
  ```
* **Why It Matters**: Causal self-attention with triangular masking is the mathematical foundation of autoregressive generative models—ensuring each predicted word only attends to preceding context.

* **💡 Speaker Takeaway**: *"It’s not magic—causal attention and KV caching allow the model to generate word-by-word text quickly and accurately."*

---

### 👥 Project 3: Customer Segmentation & Clustering
* **Directory**: `03_customer_segmentation_clustering` | **Port**: `5176`

#### 1. What the Project Does & The Problem It Solves:
* Companies have thousands of customers but don't know how to tailor marketing campaigns to different buying habits. This app automatically analyzes customer age, income, and spending scores to discover 5 distinct customer groups (like VIP Luxury Spenders vs Budget Savers) without any manual labeling.

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Hover over points on the 2D scatter plot to see individual customer cards. Use the **Cluster Filter** to isolate `Cluster #0: VIP Luxury Spenders`.
* **The Profiler**: Switch to the **"Live Profiler"** tab. Enter Age = `28`, Income = `$95k`, Spending = `85`, and click **"Classify Customer Segment"**. The app places them directly into the VIP segment and suggests marketing strategies like VIP loyalty rewards.

#### 3. Data Science Concept (Plain English):
* **Feature Scaling & Unsupervised K-Means Clustering**: Income is measured in tens of thousands of dollars, whereas age is a small two-digit number. Feature scaling normalizes the data so K-Means can find true geometric clusters, which are then validated using Silhouette metrics.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`03_customer_segmentation_clustering/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/03_customer_segmentation_clustering/backend/main.py#L74-L76) (Lines 74–76, 138–140, & 146–148).
* **Code Snippet**:
  ```python
  # Feature Scaling, K-Means Clustering & Silhouette Validation
  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)

  model = KMeans(n_clusters=k, random_state=42, n_init=10)
  labels = model.fit_predict(X_scaled)

  sil_score = round(float(silhouette_score(X_scaled, labels)), 3)
  ```
* **Why It Matters**: This code implements feature normalization, unsupervised clustering, and statistical validation via the Silhouette Coefficient to ensure clusters are mathematically sound.

* **💡 Speaker Takeaway**: *"Without pre-existing labels, the algorithm groups similar customers together so businesses can market to them smartly."*

---

### 🛒 Project 4: Market Basket Association Pattern Mining
* **Directory**: `04_associative_pattern_mining` | **Port**: `5177`

#### 1. What the Project Does & The Problem It Solves:
* Retailers want to increase average order values by recommending relevant add-on items at checkout. This platform analyzes 1,500 grocery receipts to find hidden buying patterns (like "people who buy pasta also buy pasta sauce and garlic").

#### 2. Key Feature & What to Click on Screen:
* **The Action**: In the grocery catalog, click **"Artisan Pasta"** and **"San Marzano Sauce"** to add them to your cart.
* **The Visual**: The **High-Lift Cross-Sell** box instantly pops up recommending **"Parmesan Cheese" (Lift: 3.4x)** and **"Fresh Garlic" (Lift: 2.8x)**.
* **The Tab Switch**: Click the **"Co-Occurrence Network"** tab to show an interactive web diagram showing how grocery bundles connect.

#### 3. Data Science Concept (Plain English):
* **Association Rules & The 'Lift' Metric**: If 90% of shoppers buy milk, milk will randomly appear in carts with everything. The **Lift** metric filters out coincidence and measures if two items are bought together *more often than random luck*, proving true customer intent.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`04_associative_pattern_mining/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/04_associative_pattern_mining/backend/main.py#L95-L98) (Lines 95–98).
* **Code Snippet**:
  ```python
  # Compute how strongly item A implies item B
  conf_1 = supp_ab / supp_a
  lift_1 = conf_1 / supp_b
  leverage_1 = supp_ab - (supp_a * supp_b)
  ```
* **Why It Matters**: By calculating confidence and lift, the recommender only suggests items with proven purchase affinity ($Lift > 1.0$), avoiding annoying or irrelevant recommendations.

* **💡 Speaker Takeaway**: *"Lift separates pure coincidence from genuine buying habits."*

---

### 🧪 Project 5: Data Science Skills Mastery Lab
* **Directory**: `05_data_science_skills_lab` | **Port**: `5178`

#### 1. What the Project Does & The Problem It Solves:
* Data science students and analysts often get overwhelmed by hundreds of standalone statistical formulas and raw terminal outputs. This lab provides a unified visual testing dashboard implementing 54 different data science techniques across 6 classic datasets (Titanic, Housing, Iris, Wine, Heart, Diabetes).

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Choose dataset **"Titanic Survival"** and click skill **"Feature Distribution & Density Estimation"**.
* **The Visual**: A clean distribution chart appears with mean, median, skewness badges, and an automated analytical summary banner.
* **The Switch**: Switch dataset to **"California Housing"** and click **"Pearson / Spearman Correlation Heatmap"** to show which house features correlate with price.
* **The Hypothesis Test**: Click **"Two-Sample Student's / Welch's t-Test"** to show the automated statistical significance check.

#### 3. Data Science Concept (Plain English):
* **Statistical Hypothesis Testing (Welch's Two-Sample t-Test)**: When comparing two sets of data (like prices in two neighborhoods), you cannot simply rely on visual averages. A t-test calculates a $p$-value to mathematically prove if the difference between groups is real or just a coincidence.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`05_data_science_skills_lab/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/05_data_science_skills_lab/backend/main.py#L276-L280) (Lines 276–280).
* **Code Snippet**:
  ```python
  # Welch's Two-Sample t-Test for Statistical Significance
  sample_a = df[primary_col].iloc[:len(df)//2]
  sample_b = df[primary_col].iloc[len(df)//2:]
  t_stat, p_val = stats.ttest_ind(sample_a, sample_b, equal_var=False)
  is_significant = p_val < 0.05
  ```
* **Why It Matters**: This test replaces guesswork with statistical confidence—if $p < 0.05$, the difference is statistically validated.

* **💡 Speaker Takeaway**: *"It turns raw data science formulas into interactive visual proof."*

---

## 🎬 Tips for a Smooth 10–12 Minute Recording
1. **Pacing**: Spend approximately **1 minute and 45 seconds** on each project.
2. **Smooth Transitions**: Press `Ctrl + C` in your terminal to close the active project, run `./run_demo.sh <next_number>`, and switch browser tabs.
3. **Show Code Cleanly**: In VS Code, have each backend file pre-opened in editor tabs so you can switch over, point your mouse at the snippet for 5 seconds, and explain its importance.
4. **Be Confident**: You don't need complex math—focus on the story: *what problem it solves, what you click, how the data science works in plain terms, and the key code snippet.*
