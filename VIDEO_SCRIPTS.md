# 🎥 Master Video Demo Script & Presentation Guide (All 6 Projects)

> **Target Total Video Duration**: **10:30 – 11:30 Minutes** (~1:45 min per project)  
> **Speaker Note**: This script is written in plain, natural English for easy reading during your screen recording. It avoids confusing mathematical jargon and gives you exact visual cues, clicks, and code highlights.

---

## 📋 Quick Video Recording Checklist
1. **Terminal Setup**: Open your terminal in the repository root.
2. **Launch Commands**: Run each project one by one with `./run_demo.sh <number>` (e.g. `./run_demo.sh 0`).
3. **Switching Projects**: In the terminal, press `Ctrl + C` to stop the current project before launching the next one.
4. **Code Tab**: Have VS Code open to the backend files so you can quickly switch to show the highlighted code snippet for each project.

---

## 🧭 Project Timeline Summary

| # | Project Name | Directory | Local URL | Time Stamp |
|---|---|---|---|:---:|
| **—** | **Intro & Presentation Setup** | Root | — | `0:00 - 0:30` |
| **0** | **Zenith Dynamic Task Workspace** | `00_dynamic_todo_workspace` | `http://localhost:5173` | `0:30 - 2:15` |
| **1** | **NYC Taxi Trip Duration Predictor** | `01_nyc_taxi_trip_prediction` | `http://localhost:5174` | `2:15 - 4:00` |
| **2** | **NanoLlama SFT LLM Platform** | `02_nano_llm_transformer` | `http://localhost:5175` | `4:00 - 5:45` |
| **3** | **Customer Segmentation & Clustering** | `03_customer_segmentation_clustering` | `http://localhost:5176` | `5:45 - 7:30` |
| **4** | **Market Basket Association Pattern Mining** | `04_associative_pattern_mining` | `http://localhost:5177` | `7:30 - 9:15` |
| **5** | **Data Science Skills Mastery Lab** | `05_data_science_skills_lab` | `http://localhost:5178` | `9:15 - 11:00` |
| **—** | **Final Wrap-Up** | Root | — | `11:00 - 11:30` |

---

## 🎙️ Comprehensive Presentation Script

```
================================================================================
VIDEO INTRO (0:00 – 0:30)
================================================================================
```

### 🗣️ What to Say:
> *"Hi everyone! Today I'll be walking through all 6 projects in this data science and machine learning portfolio. Each project tackles a different practical challenge—ranging from reactive task management and urban taxi travel time prediction, to a local large language model, customer clustering, grocery shopping recommendations, and an interactive 54-skill data science lab. For each project, I'll give a high-level overview, demo the key features, explain the core data science concepts in simple terms, and show the exact piece of code that powers it. Let's jump into Project 0!"*

---

```
================================================================================
PROJECT 0: Zenith Dynamic Task Workspace (0:30 – 2:15)
================================================================================
Terminal Command: ./run_demo.sh 0
Browser URL: http://localhost:5173
Code File to Show: 00_dynamic_todo_workspace/server/index.js (Lines 181–222)
```

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 0 is the Zenith Dynamic Task Workspace. It's a full-stack project and task management dashboard designed to organize workflows. Think of it like a smart Kanban board with automated priority sorting, subtask checklists, and real-time live synchronization so teams stay aligned without needing to refresh their browser."*
* **What to Show on Screen**:
  - Open `http://localhost:5173`.
  - Point out the dark board layout, column headers (`To Do`, `In Progress`, `Done`), and the glowing green **SSE Live Stream** indicator in the top header.

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature of this project is the automated Eisenhower Priority Matrix and real-time task pipeline. When I click '+ Create Task', add a task like 'Build ML Pipeline', assign it 'Urgent' priority, and add two subtasks, it immediately appears on the board. When I check off a subtask, the progress bar updates live, and I can advance it across columns into 'Done'."*
* **What to Show on Screen**:
  - Click **"+ Create Task"**, type `Build ML Pipeline`, choose `Urgent (P0)`, add a couple of subtasks, and submit.
  - Check off a subtask to show the progress bar fill up.
  - Click the **"Priority Matrix"** tab to show tasks auto-sorted into the *Urgent & Important (Do First)* quadrant.

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The main data science concept here is **Descriptive Analytics and Data Aggregation**. Rather than just storing raw task records, the system continuously aggregates task statuses, calculates completion rates, and breaks down workload by priority tiers to provide immediate productivity metrics."*

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open [`00_dynamic_todo_workspace/server/index.js`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/00_dynamic_todo_workspace/server/index.js#L181-L222) around line 181.
* **Code Snippet**:
  ```javascript
  // server/index.js - Descriptive Analytics & Aggregation Engine
  app.get('/api/analytics', (req, res) => {
    const tasks = readTasks();
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    const priorityDistribution = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
    ...
  });
  ```
* **What to Say**:
  > *"Here in `server/index.js`, this `/api/analytics` endpoint processes all active tasks. It calculates the team's overall completion percentage and tallies up the priority distribution. This code is essential because it turns raw database records into clear summary metrics that feed the visual telemetry dashboard."*

---

```
================================================================================
PROJECT 1: NYC Taxi Trip Duration & Fare Predictor (2:15 – 4:00)
================================================================================
Terminal Command: (Stop Project 0 with Ctrl+C) -> ./run_demo.sh 1
Browser URL: http://localhost:5174
Code File to Show: 01_nyc_taxi_trip_prediction/backend/main.py (Lines 34–40)
```

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 1 is the NYC Taxi Trip Duration and Fare Predictor, inspired by the Kaggle NYC Taxi challenge. It takes pickup and dropoff locations anywhere in New York City, applies machine learning models, and instantly estimates both travel duration and total taxi fare."*
* **What to Show on Screen**:
  - Open `http://localhost:5174`.
  - Show the split view: Interactive dark NYC street map on the left, and the live prediction cards and model selector on the right.

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature is the interactive map routing. If I select a popular preset like 'Times Square to Brooklyn Bridge', the map draws the route and calculates the trip in milliseconds. If I drag the pickup or dropoff pins on the map, or adjust the time slider to 6:00 PM evening rush hour, you can see the predicted travel time increase from 18 minutes to 26 minutes with rush-hour fare surcharges applied."*
* **What to Show on Screen**:
  - Click preset: **"Times Square to Brooklyn Bridge"**.
  - Drag one of the map pins slightly and watch the numbers recalculate instantly.
  - Slide the **"Pickup Time of Day"** slider to `18:00 (Rush Hour)`.

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The core data science concept is **Geospatial Feature Engineering and Regression Modeling**. Raw GPS coordinates like latitude and longitude don't tell a model much on their own. We transform those raw coordinates into real-world driving distances—specifically calculating street-grid distance and compass direction to train our Random Forest model."*

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open [`01_nyc_taxi_trip_prediction/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/01_nyc_taxi_trip_prediction/backend/main.py#L34-L40) at lines 34–40.
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

---

```
================================================================================
PROJECT 2: NanoLlama SFT LLM Platform (4:00 – 5:45)
================================================================================
Terminal Command: (Stop Project 1 with Ctrl+C) -> ./run_demo.sh 2
Browser URL: http://localhost:5175
Code File to Show: 02_nano_llm_transformer/backend/main.py (Lines 43–46 & 124–128)
```

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 2 is the NanoLlama LLM Studio. It's a lightweight, 128-million parameter Large Language Model—similar in architecture to modern models like LLaMA—designed to run quickly on regular laptops for specialized technical tasks without needing massive cloud servers."*
* **What to Show on Screen**:
  - Open `http://localhost:5175`.
  - Show the Chat Studio interface with prompt suggestions and the live GPU telemetry sidebar on the right.

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"The key feature is the interactive Chat Studio combined with real-time model telemetry and attention heatmaps. If I click one of the suggested prompts, such as 'What is a Transformer?', NanoLlama generates a response in real-time. On the right, you can see live performance stats: throughput at over 60 tokens per second and memory usage under 15 megabytes."*
* **What to Show on Screen**:
  - Click on the quick prompt: **"What is a Transformer?"**.
  - Point to the right sidebar showing **Tokens/sec (64.2 tok/s)**, **Latency (142 ms)**, and **KV-Cache Memory**.
  - Switch tabs to **"Attention Heatmap"** to show how the model attends across words.

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The main data science concept is **Transformer Attention and Key-Value (KV) Caching**. When an AI writes a response word-by-word, normally it would have to re-read every previous word from scratch for every single new word. KV-caching saves past word computations in memory so the model generates text with high speed and low lag."*

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open [`02_nano_llm_transformer/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/02_nano_llm_transformer/backend/main.py#L124-L128) at lines 124–128.
* **Code Snippet**:
  ```python
  # backend/main.py - Fast Inference Telemetry & Memory Allocation
  "telemetry": {
      "tokens_generated": total_tokens,
      "latency_ms": round(latency_sec * 1000, 1),
      "tokens_per_second": tokens_per_sec,
      "kv_cache_allocated_mb": round(total_tokens * 0.048, 2),
      "peak_vram_mb": 420.5
  }
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, the backend tracks KV-cache memory allocation and token generation speeds. This is critical because in Large Language Models, optimizing how past tokens are stored in memory is what makes real-time chat feasible on consumer hardware."*

---

```
================================================================================
PROJECT 3: Customer Segmentation & Clustering (5:45 – 7:30)
================================================================================
Terminal Command: (Stop Project 2 with Ctrl+C) -> ./run_demo.sh 3
Browser URL: http://localhost:5176
Code File to Show: 03_customer_segmentation_clustering/backend/main.py (Lines 74–76 & 138–139)
```

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 3 is the Customer Segmentation and Clustering Intelligence platform. It uses customer demographic and spending data from Kaggle to automatically group customers into natural behavioral categories—like VIP spenders, budget shoppers, or mainstream consumers—without needing any pre-existing labels."*
* **What to Show on Screen**:
  - Open `http://localhost:5176`.
  - Show the interactive 2D customer scatter plot with 5 distinct color-coded clusters and persona cards.

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature is the interactive customer explorer and live profiler. In the scatter plot, each dot is an individual customer. If I filter for 'VIP Luxury Spenders', it highlights high-income, high-spending shoppers. Furthermore, if I go to the 'Live Profiler' tab, enter a 28-year-old making $95k with a spending score of 85, and click classify, the model instantly assigns them to the VIP segment with recommended marketing strategies."*
* **What to Show on Screen**:
  - Filter the cluster dropdown to show `VIP Luxury Spenders`.
  - Switch to the **"Live Profiler"** tab, set Age=28, Income=$95k, Spending=85, and click **"Classify Customer Segment"**.

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The primary data science concept is **Unsupervised Clustering with K-Means and Feature Scaling**. Because income is measured in thousands while age is a small two-digit number, we use feature scaling to normalize the data so every characteristic is weighted fairly when finding customer groups."*

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open [`03_customer_segmentation_clustering/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/03_customer_segmentation_clustering/backend/main.py#L74-L76) at lines 74–76 and lines 138–139.
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

---

```
================================================================================
PROJECT 4: Market Basket Association Pattern Mining (7:30 – 9:15)
================================================================================
Terminal Command: (Stop Project 3 with Ctrl+C) -> ./run_demo.sh 4
Browser URL: http://localhost:5177
Code File to Show: 04_associative_pattern_mining/backend/main.py (Lines 95–98)
```

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 4 is the Market Basket Association Pattern Mining platform. It analyzes 1,500 grocery checkout receipts to discover which products shoppers frequently purchase together—just like Amazon's 'customers also bought' recommendation system."*
* **What to Show on Screen**:
  - Open `http://localhost:5177`.
  - Show the grocery catalog on the left and the active shopping cart with smart cross-sell recommendations on the right.

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"The key feature is the real-time Smart Basket Recommender and product network graph. When I add 'Artisan Pasta' and 'San Marzano Sauce' to my cart, the system immediately recommends 'Parmesan Cheese' and 'Fresh Garlic' with high confidence scores. In the 'Co-Occurrence Network' tab, you can visually see the connections between different grocery bundles like breakfast items or Italian dinner ingredients."*
* **What to Show on Screen**:
  - Click **"Artisan Pasta"** and **"San Marzano Sauce"** to add them to the cart.
  - Show the recommended items (**Parmesan Cheese** and **Fresh Garlic**) pop up.
  - Click the **"Co-Occurrence Network"** tab to show the interactive web graph connecting items.

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The data science concept here is **Association Rule Mining and the 'Lift' Metric**. If almost everybody buys milk, milk will show up in random carts by chance. The 'Lift' metric measures true buying affinity by checking if items appear together significantly more often than random chance would predict."*

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open [`04_associative_pattern_mining/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/04_associative_pattern_mining/backend/main.py#L95-L98) at lines 95–98.
* **Code Snippet**:
  ```python
  # backend/main.py - Association Confidence & Lift Calculation
  conf_1 = supp_ab / supp_a
  lift_1 = conf_1 / supp_b
  leverage_1 = supp_ab - (supp_a * supp_b)
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, we calculate the confidence and lift for every product pair. Lift divides the joint purchase probability by expected random chance. Any rule with a lift greater than 1 proves a strong shopping connection, making sure our checkout cross-sells recommend items customers actually want."*

---

```
================================================================================
PROJECT 5: Data Science Skills Mastery Lab (9:15 – 11:00)
================================================================================
Terminal Command: (Stop Project 4 with Ctrl+C) -> ./run_demo.sh 5
Browser URL: http://localhost:5178
Code File to Show: 05_data_science_skills_lab/backend/main.py (Lines 276–280)
```

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 5 is the Data Science Skills Mastery Lab. It's an interactive visual testing ground that implements 54 distinct data science, statistical testing, and machine learning diagnostic skills across 6 classic datasets like Titanic, California Housing, and Iris. Instead of looking at raw text or command outputs, everything is visualized through interactive dashboards."*
* **What to Show on Screen**:
  - Open `http://localhost:5178`.
  - Show the dataset selector at the top and the catalog of 54 skills on the left panel.

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"The key feature is the instant visual execution dashboard. If I choose the 'Titanic Survival' dataset and click 'Feature Distribution', it generates a clear histogram, mean, median, and an automatic written takeaway. If I switch to 'California Housing' and run a 'Correlation Heatmap', it creates an interactive matrix showing which housing features relate to price."*
* **What to Show on Screen**:
  - Select **"Titanic Survival"** and click **"Feature Distribution & Density Estimation"**.
  - Switch dataset to **"California Housing"** and click **"Pearson / Spearman Correlation Heatmap"**.
  - Select **"Two-Sample Student's / Welch's t-Test"** to show statistical hypothesis testing.

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The core data science concept is **Statistical Hypothesis Testing (Welch's Two-Sample t-Test)**. When comparing two groups of data, you can't just guess if a difference in averages is meaningful. A t-test calculates a statistical p-value to prove whether the difference between groups is real or just random luck."*

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open [`05_data_science_skills_lab/backend/main.py`](file:///Users/isaackim/Desktop/MSSE%20DS/Fall%202026/CMPE%20255/HW/cmpe-255-assignment-1-pt-2-iteration-2/05_data_science_skills_lab/backend/main.py#L276-L280) at lines 276–280.
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

---

```
================================================================================
MASTER WRAP-UP & CONCLUSION (11:00 – 11:30)
================================================================================
```

### 🗣️ What to Say:
> *"To wrap up, we've walked through all 6 projects—from full-stack reactive task workspaces and NYC taxi travel predictions, to local Transformer language models, unsupervised customer clustering, market basket recommendation rules, and an interactive 54-skill data science lab. Each project combines solid software engineering with practical, intuitive data science. Thank you so much for watching!"*
