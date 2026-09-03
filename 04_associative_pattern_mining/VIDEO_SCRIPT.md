# 🎬 Video Demo Script — Project 4: Market Basket Association Pattern Mining

**Target Duration**: ~1:45 – 2:00 Minutes  
**Focus**: Association rule mining (Apriori, FP-Growth), affinity metrics (Support, Confidence, Lift, Leverage, Conviction), Co-Occurrence Network Graph, and live Smart Basket cross-sell recommendations.

---

## ⏱️ Timeline & Step-by-Step Walkthrough

### 1. Project Introduction & Purpose (0:00 – 0:25)
* **What to Say**:  
  *"Welcome to Project 04: The Market Basket Association Pattern Mining Platform. Built on Kaggle Groceries and Instacart transactional receipts, this system extracts hidden purchasing affinities to power dynamic retail cross-sells, optimize bundle pricing, and visualize product co-occurrence networks."*
* **What to Show on Screen**:  
  - Open `http://localhost:5177`.
  - Show the Smart Basket Studio with the interactive grocery catalog on the left and active cart / AI recommendations on the right.

---

### 2. Core Association Mining Mathematics & Logic (0:25 – 0:55)
* **What to Say**:  
  - **Apriori & FP-Growth Algorithms (`backend/main.py`)**: *"The backend mines 1,500 transactional receipts using compact FP-Tree data structures, bypassing candidate generation to achieve 4x faster execution."*
  - **Rule Affinity Metrics**:  
    - **Support**: $P(A \cup B)$ — the joint transaction frequency.
    - **Confidence**: $P(B \mid A)$ — the conditional purchase probability.
    - **Lift**: $\frac{P(A \cup B)}{P(A)P(B)}$ — measuring true statistical correlation over random chance.
    - **Leverage & Conviction**: Measuring absolute dependency and directional implication strength.
  - **Cross-Sell Recommender**: *"When items are added to a cart, the `/api/recommend-basket` endpoint dynamically filters high-lift association rules to deliver real-time complementary product recommendations."*

---

### 3. Step-by-Step Live User Flow (0:55 – 1:40)
* **Step 1: Live Smart Basket Recommender (0:55 – 1:15)**
  - In the grocery catalog, click on **"Artisan Pasta"** and **"San Marzano Sauce"** to add them to the cart.
  - Notice the **High-Lift Cross-Sell Recommendations** instantly suggest **"Parmesan Cheese" (Lift 3.4x)** and **"Fresh Garlic" (Lift 2.8x)** with confidence tags.
  - Click **"+ Add to Cart"** on the recommended Parmesan Cheese to demonstrate seamless basket completion.

* **Step 2: Co-Occurrence Network Graph (1:15 – 1:30)**
  - Switch tabs to **"Co-Occurrence Network"**:
  - Point out the interactive circular graph: Highlight green edges representing high-lift connections ($>2.5x$) linking breakfast bundles (Milk, Bread, Eggs, Coffee) and Italian dinner bundles (Pasta, Sauce, Garlic, Wine).

* **Step 3: Mined Rules Catalog & AutoResearch (1:30 – 1:40)**
  - Switch tabs to **"Mined Association Rules"**: Adjust the **Min Lift** slider to `2.0x` and show the filtered rule matrix with Support, Confidence, Lift, and Leverage.
  - Switch tabs to **"CRISP-DM & AutoResearch"**: Highlight the benchmark table proving FP-Tree recursion reduces memory from 1.2MB to 290KB.

---

### 4. Closing & Takeaway (1:40 – 1:55)
* **What to Say**:  
  *"In summary, Project 4 demonstrates how associative pattern mining and graph topology turn raw point-of-sale data into actionable, high-lift ecommerce cross-sell intelligence."*
