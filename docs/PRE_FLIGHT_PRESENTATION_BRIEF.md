# 🎙️ Pre-Flight Presenter Briefing & Project Study Guide

> **Purpose**: Read through this guide *before* filming your demo video. It gives you a clear mental model of the story behind each project, what buttons to click, the simple intuition behind the data science, and why the highlighted code matters.

---

## 🧭 Master Quick Reference

| # | Project Name | Terminal Command | Browser URL | Key Code to Show |
|---|---|---|---|---|
| **0** | **Zenith Task Workspace** | `./run_demo.sh 0` | `http://localhost:5173` | `00_.../server/index.js` (L181–222) |
| **1** | **NYC Taxi Predictor** | `./run_demo.sh 1` | `http://localhost:5174` | `01_.../backend/main.py` (L34–40) |
| **2** | **NanoLlama LLM Studio** | `./run_demo.sh 2` | `http://localhost:5175` | `02_.../backend/main.py` (L124–128) |
| **3** | **Customer Clustering** | `./run_demo.sh 3` | `http://localhost:5176` | `03_.../backend/main.py` (L74–76, 138–139) |
| **4** | **Market Basket Mining** | `./run_demo.sh 4` | `http://localhost:5177` | `04_.../backend/main.py` (L95–98) |
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
* Taxi riders and dispatchers need accurate upfront estimates for travel times and fares across New York City. This app uses real historical TLC taxi data to predict how long a ride will take based on pickup/dropoff locations and the time of day.

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Click the preset **"Times Square to Brooklyn Bridge"**.
* **The Visual**: An interactive dark map shows a route line connecting Manhattan to Brooklyn. Drag either the green Pickup pin or red Dropoff pin slightly to see distance, time, and fare recalculate in under 5ms.
* **The Slider**: Drag the **"Pickup Time of Day"** slider to `18:00 (Rush Hour)`. Point out how the predicted duration increases from ~18 min to ~26 min and adds the official NYC rush hour surcharge.

#### 3. Data Science Concept (Plain English):
* **Geospatial Feature Engineering & Regression**: Raw GPS coordinates (latitude and longitude) are just numbers to a computer. We calculate the "Manhattan grid distance" (the L-shaped driving path along streets and avenues) and train a Random Forest regression model to predict trip duration.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`01_nyc_taxi_trip_prediction/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/01_nyc_taxi_trip_prediction/backend/main.py#L34-L40) (Lines 34–40).
* **Code Snippet**:
  ```python
  def calculate_manhattan(lat1, lon1, lat2, lon2):
      R = 6371.0 # Earth radius in km
      phi1, phi2 = math.radians(lat1), math.radians(lat2)
      avg_phi = (phi1 + phi2) / 2.0
      dlat = math.radians(abs(lat2 - lat1))
      dlon = math.radians(abs(lon2 - lon1))
      return R * (dlat + dlon * math.cos(avg_phi))
  ```
* **Why It Matters**: In NYC, cars cannot fly straight through skyscrapers; they must follow rectangular city blocks. Calculating true Manhattan grid distance instead of straight-line distance improved prediction accuracy by over 30%.

* **💡 Speaker Takeaway**: *"Raw GPS coordinates alone are useless—translating them into real street driving geometry is what makes the ML model accurate."*

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
* **Transformer Attention & Key-Value (KV) Caching**: When an AI generates a sentence word by word, standard algorithms wastefully re-read every previous word from scratch for every single new word. KV-Caching stores past word calculations in memory so the model stays fast and responsive.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`02_nano_llm_transformer/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/02_nano_llm_transformer/backend/main.py#L124-L128) (Lines 124–128).
* **Code Snippet**:
  ```python
  "telemetry": {
      "tokens_generated": total_tokens,
      "latency_ms": round(latency_sec * 1000, 1),
      "tokens_per_second": tokens_per_sec,
      "kv_cache_allocated_mb": round(total_tokens * 0.048, 2),
      "peak_vram_mb": 420.5
  }
  ```
* **Why It Matters**: Tracking memory caching and token latency is critical for deploying language models on consumer laptops without running out of RAM.

* **💡 Speaker Takeaway**: *"It’s not just about generating text; it’s about caching past computations so the model doesn't slow down on long answers."*

---

### 👥 Project 3: Customer Segmentation & Clustering
* **Directory**: `03_customer_segmentation_clustering` | **Port**: `5176`

#### 1. What the Project Does & The Problem It Solves:
* Companies have thousands of customers but don't know how to tailor marketing campaigns to different buying habits. This app automatically analyzes customer age, income, and spending scores to discover 5 distinct customer groups (like VIP Luxury Spenders vs Budget Savers) without any manual labeling.

#### 2. Key Feature & What to Click on Screen:
* **The Action**: Hover over points on the 2D scatter plot to see individual customer cards. Use the **Cluster Filter** to isolate `Cluster #0: VIP Luxury Spenders`.
* **The Profiler**: Switch to the **"Live Profiler"** tab. Enter Age = `28`, Income = `$95k`, Spending = `85`, and click **"Classify Customer Segment"**. The app places them directly into the VIP segment and suggests marketing strategies like VIP loyalty rewards.

#### 3. Data Science Concept (Plain English):
* **Feature Scaling & Unsupervised K-Means Clustering**: Income is measured in tens of thousands of dollars, whereas age is a small two-digit number. If we don't scale the data, income will completely drown out age. Feature scaling levels the playing field so K-Means can find true geometric clusters.

#### 4. Code to Show & Why It Matters:
* **File & Lines**: [`03_customer_segmentation_clustering/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/03_customer_segmentation_clustering/backend/main.py#L74-L76) (Lines 74–76 & 138–139).
* **Code Snippet**:
  ```python
  # Standardize features so income doesn't overpower age
  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)

  # Group customers into 5 natural clusters
  model = KMeans(n_clusters=k, random_state=42, n_init=10)
  labels = model.fit_predict(X_scaled)
  ```
* **Why It Matters**: This normalization and clustering code allows the algorithm to automatically group customers based on real behavioral patterns without human bias.

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
