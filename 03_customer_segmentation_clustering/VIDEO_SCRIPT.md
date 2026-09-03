# 🎬 Video Demo Script — Project 3: Customer Intelligence & Clustering Platform

**Target Duration**: ~1:45 – 2:00 Minutes  
**Focus**: Unsupervised clustering (K-Means, GMM, DBSCAN, Hierarchical), 2D PCA feature projection, Silhouette score diagnostics, and automated persona extraction.

---

## ⏱️ Timeline & Step-by-Step Walkthrough

### 1. Project Introduction & Purpose (0:00 – 0:25)
* **What to Say**:  
  *"Welcome to Project 03: The Customer Intelligence & Segmentation Clustering Platform. Using the popular Kaggle Customer demographic dataset, this platform automates unsupervised customer segmentation to identify distinct behavioral archetypes, evaluate clustering quality, and map targeted marketing strategies."*
* **What to Show on Screen**:  
  - Open `http://localhost:5176`.
  - Show the 2D interactive scatter plot of Annual Income vs Spending Score with 5 colored customer clusters and persona cards.

---

### 2. Core Machine Learning & Clustering Logic (0:25 – 0:55)
* **What to Say**:  
  - **Multi-Algorithm Engine (`backend/main.py`)**: *"The backend implements four unsupervised algorithms: K-Means with WCSS optimization, Gaussian Mixture Models with Expectation-Maximization, Agglomerative Hierarchical with Ward Linkage, and DBSCAN for density-based noise filtering."*
  - **Dimensionality Reduction & Validation**: *"We perform StandardScaler normalization and 2D PCA decomposition. Clustering quality is validated in real-time using the Silhouette Coefficient ($S=0.554$), Calinski-Harabasz Index, and Davies-Bouldin scores."*
  - **Persona Synthesis**: *"Clusters are automatically synthesized into business archetypes: VIP Luxury Spenders, Trendsetters, Mainstream Shoppers, Affluent Savers, and Budget Conscious consumers."*

---

### 3. Step-by-Step Live User Flow (0:55 – 1:40)
* **Step 1: Interactive Scatter Exploration (0:55 – 1:10)**
  - Hover over a few dots in the scatter plot: Show the instant tooltip displaying Customer ID, Age, Annual Income, and Assigned Persona.
  - Use the **Cluster Filter** dropdown to isolate `Cluster #0: VIP Luxury Spenders` (high income, high spend).

* **Step 2: Algorithm Switching & K-Value Tuning (1:10 – 1:25)**
  - On the right panel, switch the algorithm from **K-Means** to **Gaussian Mixture Model (GMM)** and adjust $K$ from 5 to 4.
  - Point out how the live Silhouette Score and Calinski-Harabasz metrics recalculate instantly.

* **Step 3: Elbow Diagnostics & Real-Time Classifier (1:25 – 1:40)**
  - Switch tabs to **"Elbow & Silhouette"**: Highlight the clear inflection point at $K=5$ confirming optimal mathematical partition.
  - Switch tabs to **"Live Profiler"**: Set Age=28, Income=$95k, Spending=85/100, and click **"Classify Customer Segment"** to demonstrate instant inference placing the customer into the **VIP Luxury Spenders** segment.

---

### 4. Closing & Takeaway (1:40 – 1:55)
* **What to Say**:  
  *"In summary, Project 3 demonstrates how unsupervised machine learning and rigorous metric validation translate raw customer behavioral data into actionable marketing playbooks."*
