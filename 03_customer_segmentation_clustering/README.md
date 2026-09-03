# Project 3: Customer Intelligence & Segmentation Clustering Platform

An enterprise-grade unsupervised machine learning platform for customer intelligence and segmentation based on the popular **Kaggle Customer Dataset**, featuring **K-Means**, **DBSCAN**, **Hierarchical Clustering**, **Gaussian Mixture Models (GMM)**, **PCA projections**, **Silhouette diagnostics**, and automated **Customer Persona Synthesis**.

## Features
- **Multi-Algorithm Clustering**: Toggle dynamically between K-Means ($K=2..8$), DBSCAN ($\epsilon$ density), Agglomerative Hierarchical, and Gaussian Mixture Models.
- **Interactive 2D/3D Projections**: Visual scatter plot with PCA reduction, cluster halos, and centroid indicators.
- **Diagnostic Curve Analysis**: Elbow Method (Within-Cluster Sum of Squares) and Silhouette score plots.
- **Customer Persona Studio**: Automated generation of segment archetypes (VIP Spenders, Budget Conscious, Conservative Savers, Mainstream Shoppers).
- **Live Inference Engine**: Classify newly acquired customers into behavioral segments.
- **CRISP-DM Governance**: Full 6-phase data science methodology documentation.

## Quick Start
```bash
# Backend (Port 8003)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8003

# Frontend (Port 5176)
cd frontend
npm install
npm run dev
```
Open `http://localhost:5176` in your browser.
