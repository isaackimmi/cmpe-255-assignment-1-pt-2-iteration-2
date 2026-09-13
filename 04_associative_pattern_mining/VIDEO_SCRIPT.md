# 🎬 Video Demo Script — Project 4: Market Basket Association Pattern Mining

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 4` (Open `http://localhost:5177`)  
> **Code to Show**: `04_associative_pattern_mining/backend/main.py` (Lines 95–98)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 4 is the Market Basket Association Pattern Mining platform. It analyzes 1,500 grocery checkout receipts to discover which products shoppers frequently purchase together—just like Amazon's 'customers also bought' recommendation system."*
* **What to Show on Screen**:
  - Open `http://localhost:5177`.
  - Show the grocery catalog on the left and the active shopping cart with smart cross-sell recommendations on the right.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"The key feature is the real-time Smart Basket Recommender and product network graph. When I add 'Artisan Pasta' and 'San Marzano Sauce' to my cart, the system immediately recommends 'Parmesan Cheese' and 'Fresh Garlic' with high confidence scores. In the 'Co-Occurrence Network' tab, you can visually see the connections between different grocery bundles like breakfast items or Italian dinner ingredients."*
* **What to Show on Screen**:
  - Click **"Artisan Pasta"** and **"San Marzano Sauce"** to add them to the cart.
  - Show the recommended items (**Parmesan Cheese** and **Fresh Garlic**) pop up.
  - Click the **"Co-Occurrence Network"** tab to show the interactive web graph connecting items.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The data science concept here is **Association Rule Mining and the 'Lift' Metric**. If almost everybody buys milk, milk will show up in random carts by chance. The 'Lift' metric measures true buying affinity by checking if items appear together significantly more often than random chance would predict."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `04_associative_pattern_mining/backend/main.py` at lines 95–98.
* **Code Snippet**:
  ```python
  # backend/main.py - Association Confidence & Lift Calculation
  conf_1 = supp_ab / supp_a
  lift_1 = conf_1 / supp_b
  leverage_1 = supp_ab - (supp_a * supp_b)
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, we calculate the confidence and lift for every product pair. Lift divides the joint purchase probability by expected random chance. Any rule with a lift greater than 1 proves a strong shopping connection, making sure our checkout cross-sells recommend items customers actually want."*
