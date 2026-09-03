# Implementation Plan - Project 4: Market Basket Association Pattern Mining Platform

## 1. Executive Summary & Objective
An end-to-end CRISP-DM compliant market basket and associative pattern mining platform based on the Kaggle Groceries/Instacart dataset. It implements Apriori and FP-Growth algorithms, computes comprehensive affinity metrics (Support, Confidence, Lift, Leverage, Conviction), generates interactive co-occurrence network graphs, and powers a real-time cross-sell basket recommendation engine.

## 2. Mathematical Foundations & Formulations
For association rule antecedent $A \implies B$ consequent:
- **Support**:
  $$\text{Support}(A \implies B) = P(A \cup B) = \frac{\sigma(A \cup B)}{|T|}$$
- **Confidence**:
  $$\text{Confidence}(A \implies B) = P(B \mid A) = \frac{\text{Support}(A \cup B)}{\text{Support}(A)}$$
- **Lift**:
  $$\text{Lift}(A \implies B) = \frac{P(A \cup B)}{P(A) \cdot P(B)}$$
  $\text{Lift} > 1$ represents positive correlation; $\text{Lift} = 1$ indicates statistical independence.
- **Leverage**:
  $$\text{Leverage}(A \implies B) = \text{Support}(A \cup B) - \text{Support}(A) \cdot \text{Support}(B)$$
- **Conviction**:
  $$\text{Conviction}(A \implies B) = \frac{1 - \text{Support}(B)}{1 - \text{Confidence}(A \implies B)}$$

## 3. Backend API Specification (Port 8004)
- `GET /api/rules` - Dynamic rule extraction with min_support, min_confidence, min_lift query filters
- `GET /api/frequent-itemsets` - $k$-itemset item combinations with support counts
- `POST /api/recommend-basket` - Recommends complementary cross-sell items based on cart contents
- `GET /api/items` - Inventory item catalog
- `GET /api/crispdm` - 6-phase associative pattern mining methodology
- `GET /api/autoresearch/experiments` - Hill climbing benchmark comparisons (Apriori vs FP-Growth runtime, memory, rule density)

## 4. Frontend Studio (Port 5177)
- Interactive Co-occurrence Network Graph with hover links and node scaling
- Support vs Confidence scatter matrix
- Interactive Shopping Cart with live AI bundle recommendations
- Rule Explorer data table with sorting and export
- CRISP-DM & AutoResearch tabs

## 5. Verification & Testing
- Association rule metric consistency checks ($\text{Confidence} \le 1.0, \text{Lift} > 0$)
- Frontend build validation with zero errors
