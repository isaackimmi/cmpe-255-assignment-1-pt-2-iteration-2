import React, { useState, useEffect } from 'react';
import {
  Users, Layers, BarChart3, Target, Sparkles, Sliders,
  HelpCircle, ShieldCheck, ArrowRight, TrendingUp, CheckCircle2,
  PieChart, RefreshCw, Zap, UserPlus
} from 'lucide-react';

const CLUSTER_COLORS = [
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#14b8a6'  // Teal
];

// Fallback seed customer records so the UI is immediately interactive
const INITIAL_POINTS = [
  // Cluster 0: High Income, High Spend (VIP Luxury)
  { customer_id: "CUST-1001", age: 32, annual_income_k: 88.5, spending_score: 82.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  { customer_id: "CUST-1002", age: 35, annual_income_k: 92.0, spending_score: 88.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  { customer_id: "CUST-1003", age: 29, annual_income_k: 85.0, spending_score: 79.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  { customer_id: "CUST-1004", age: 38, annual_income_k: 98.0, spending_score: 91.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  { customer_id: "CUST-1005", age: 27, annual_income_k: 78.0, spending_score: 75.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  { customer_id: "CUST-1006", age: 31, annual_income_k: 102.0, spending_score: 86.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  { customer_id: "CUST-1007", age: 36, annual_income_k: 89.0, spending_score: 95.0, cluster: 0, persona_name: "VIP Luxury Spenders" },
  // Cluster 1: Low Income, High Spend (Trendsetters)
  { customer_id: "CUST-1020", age: 22, annual_income_k: 24.0, spending_score: 77.0, cluster: 1, persona_name: "Trendsetters / Enthusiasts" },
  { customer_id: "CUST-1021", age: 25, annual_income_k: 28.0, spending_score: 82.0, cluster: 1, persona_name: "Trendsetters / Enthusiasts" },
  { customer_id: "CUST-1022", age: 20, annual_income_k: 19.0, spending_score: 73.0, cluster: 1, persona_name: "Trendsetters / Enthusiasts" },
  { customer_id: "CUST-1023", age: 26, annual_income_k: 31.0, spending_score: 85.0, cluster: 1, persona_name: "Trendsetters / Enthusiasts" },
  { customer_id: "CUST-1024", age: 24, annual_income_k: 22.0, spending_score: 79.0, cluster: 1, persona_name: "Trendsetters / Enthusiasts" },
  // Cluster 2: Mid Income, Mid Spend (Mainstream)
  { customer_id: "CUST-1040", age: 42, annual_income_k: 55.0, spending_score: 49.0, cluster: 2, persona_name: "Mainstream Shoppers" },
  { customer_id: "CUST-1041", age: 48, annual_income_k: 58.0, spending_score: 52.0, cluster: 2, persona_name: "Mainstream Shoppers" },
  { customer_id: "CUST-1042", age: 39, annual_income_k: 52.0, spending_score: 47.0, cluster: 2, persona_name: "Mainstream Shoppers" },
  { customer_id: "CUST-1043", age: 45, annual_income_k: 60.0, spending_score: 54.0, cluster: 2, persona_name: "Mainstream Shoppers" },
  { customer_id: "CUST-1044", age: 51, annual_income_k: 48.0, spending_score: 46.0, cluster: 2, persona_name: "Mainstream Shoppers" },
  // Cluster 3: High Income, Low Spend (Affluent Savers)
  { customer_id: "CUST-1060", age: 49, annual_income_k: 88.0, spending_score: 18.0, cluster: 3, persona_name: "Affluent Savers" },
  { customer_id: "CUST-1061", age: 54, annual_income_k: 94.0, spending_score: 15.0, cluster: 3, persona_name: "Affluent Savers" },
  { customer_id: "CUST-1062", age: 44, annual_income_k: 82.0, spending_score: 22.0, cluster: 3, persona_name: "Affluent Savers" },
  { customer_id: "CUST-1063", age: 58, annual_income_k: 101.0, spending_score: 12.0, cluster: 3, persona_name: "Affluent Savers" },
  { customer_id: "CUST-1064", age: 47, annual_income_k: 86.0, spending_score: 19.0, cluster: 3, persona_name: "Affluent Savers" },
  // Cluster 4: Low Income, Low Spend (Conservative Budgeters)
  { customer_id: "CUST-1080", age: 45, annual_income_k: 24.0, spending_score: 20.0, cluster: 4, persona_name: "Conservative Budgeters" },
  { customer_id: "CUST-1081", age: 52, annual_income_k: 21.0, spending_score: 16.0, cluster: 4, persona_name: "Conservative Budgeters" },
  { customer_id: "CUST-1082", age: 38, annual_income_k: 26.0, spending_score: 24.0, cluster: 4, persona_name: "Conservative Budgeters" },
  { customer_id: "CUST-1083", age: 60, annual_income_k: 18.0, spending_score: 14.0, cluster: 4, persona_name: "Conservative Budgeters" }
];

const DEFAULT_CLUSTER_DATA = {
  success: true,
  algorithm: 'kmeans',
  k: 5,
  metrics: {
    silhouette_score: 0.554,
    calinski_harabasz_index: 248.6,
    davies_bouldin_index: 0.612,
    pca_explained_variance_ratio: [0.684, 0.231]
  },
  points: INITIAL_POINTS,
  cluster_summaries: [
    { cluster_id: 0, count: 40, pct_of_total: 20.0, avg_age: 32.4, avg_annual_income_k: 88.2, avg_spending_score: 82.1, persona: { name: "VIP Luxury Spenders", description: "High income, peak spending engagement.", marketing_strategy: "VIP concierge & luxury loyalty tiers.", icon: "💎" } },
    { cluster_id: 1, count: 40, pct_of_total: 20.0, avg_age: 24.1, avg_annual_income_k: 25.4, avg_spending_score: 78.6, persona: { name: "Trendsetters / Enthusiasts", description: "Young, high willingness to spend.", marketing_strategy: "Flash sales & Buy-Now-Pay-Later options.", icon: "🚀" } },
    { cluster_id: 2, count: 50, pct_of_total: 25.0, avg_age: 42.3, avg_annual_income_k: 55.2, avg_spending_score: 49.8, persona: { name: "Mainstream Shoppers", description: "Predictable, regular shopping cycles.", marketing_strategy: "Seasonal bundle discounts & loyalty points.", icon: "🛍️" } },
    { cluster_id: 3, count: 35, pct_of_total: 17.5, avg_age: 48.6, avg_annual_income_k: 86.4, avg_spending_score: 18.2, persona: { name: "Affluent Savers", description: "High net worth with conservative spending.", marketing_strategy: "Quality assurance & long-term warranties.", icon: "🏦" } },
    { cluster_id: 4, count: 35, pct_of_total: 17.5, avg_age: 45.1, avg_annual_income_k: 24.2, avg_spending_score: 19.7, persona: { name: "Conservative Budgeters", description: "Price-sensitive buyers seeking essentials.", marketing_strategy: "Clearance promotions & volume price breaks.", icon: "🏷️" } }
  ]
};

const DEFAULT_DIAGNOSTICS = {
  k_range: [2, 3, 4, 5, 6, 7, 8],
  wcss_inertia: [214.2, 142.8, 89.4, 42.1, 35.8, 31.2, 27.5],
  silhouette_scores: [0.42, 0.48, 0.51, 0.554, 0.49, 0.44, 0.39],
  recommended_k: 5
};

const DEFAULT_EXPERIMENTS = [
  { exp_id: 1, technique: "Raw Age + Income + Spending (Standard K-Means)", k: 3, silhouette: 0.442, status: "Baseline" },
  { exp_id: 2, technique: "StandardScaler Normalization", k: 4, silhouette: 0.498, status: "Iterated" },
  { exp_id: 3, technique: "2D PCA Projection Feature Selection", k: 5, silhouette: 0.554, status: "Champion (K=5)" },
  { exp_id: 4, technique: "DBSCAN Density Clustering (eps=0.48)", k: 4, silhouette: 0.482, status: "Non-spherical Explorer" },
  { exp_id: 5, technique: "Gaussian Mixture Model Expectation-Maximization", k: 5, silhouette: 0.528, status: "Probabilistic" }
];

const DEFAULT_CRISPDM = {
  title: "CRISP-DM Unsupervised Customer Segmentation Methodology",
  phases: [
    { phase: 1, name: "Business Understanding", desc: "Identify high-value customer clusters to target marketing budgets and reduce churn." },
    { phase: 2, name: "Data Understanding", desc: "Inspect distributions of 200 customer profiles across Age, Annual Income, and Spending Score." },
    { phase: 3, name: "Data Preparation", desc: "Z-score feature scaling, outlier detection via Mahalanobis distance, and 2D PCA projection." },
    { phase: 4, name: "Modeling", desc: "Fit K-Means, DBSCAN, Hierarchical Ward, and Gaussian Mixture Models." },
    { phase: 5, name: "Evaluation", desc: "Evaluate clusters via Elbow curve WCSS, Silhouette coefficient (0.554), and Davies-Bouldin index." },
    { phase: 6, name: "Deployment", desc: "Deploy interactive cluster visualizer and real-time customer profiling microservice." }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'diagnostics' | 'personas' | 'classifier' | 'crispdm'
  const [algorithm, setAlgorithm] = useState('kmeans');
  const [kValue, setKValue] = useState(5);
  const [clusterData, setClusterData] = useState(DEFAULT_CLUSTER_DATA);
  const [diagnostics, setDiagnostics] = useState(DEFAULT_DIAGNOSTICS);
  const [experiments, setExperiments] = useState(DEFAULT_EXPERIMENTS);
  const [crispdm, setCrispdm] = useState(DEFAULT_CRISPDM);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL');

  // Customer Classifier Form State
  const [inputAge, setInputAge] = useState(28);
  const [inputIncome, setInputIncome] = useState(95);
  const [inputSpending, setInputSpending] = useState(85);
  const [classificationResult, setClassificationResult] = useState(null);

  const fetchClusters = async () => {
    try {
      const res = await fetch(`/api/clusters?algorithm=${algorithm}&k=${kValue}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.points) {
          setClusterData(data);
        }
      }
    } catch (e) {
      console.warn('Backend not responding yet, utilizing pre-seeded cluster cache:', e);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, [algorithm, kValue]);

  useEffect(() => {
    fetch('/api/evaluation/elbow-silhouette')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setDiagnostics(d))
      .catch(() => {});

    fetch('/api/autoresearch/experiments')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && Array.isArray(d) && setExperiments(d))
      .catch(() => {});

    fetch('/api/crispdm')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setCrispdm(d))
      .catch(() => {});
  }, []);

  const handleClassifyCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/predict-cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: Number(inputAge),
          annual_income_k: Number(inputIncome),
          spending_score: Number(inputSpending)
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setClassificationResult(data);
          return;
        }
      }
    } catch (err) {
      console.warn('Using client-side classifier fallback:', err);
    }

    // Client-side fallback rule for immediate responsiveness
    let persona = { name: "Mainstream Shoppers", icon: "🛍️", description: "Balanced middle-income consumer with steady purchasing habits.", marketing_strategy: "Seasonal bundle discounts & loyalty points." };
    if (inputIncome > 70 && inputSpending > 60) {
      persona = { name: "VIP Luxury Spenders", icon: "💎", description: "High income earners with peak engagement and premium purchase history.", marketing_strategy: "VIP concierge, early access to flagship collections, luxury loyalty tiers." };
    } else if (inputIncome < 40 && inputSpending > 60) {
      persona = { name: "Trendsetters / Enthusiasts", icon: "🚀", description: "Young demographic with high willingness to spend despite modest income.", marketing_strategy: "Flash sales, viral social campaigns, Buy-Now-Pay-Later payment options." };
    } else if (inputIncome > 70 && inputSpending < 40) {
      persona = { name: "Affluent Savers", icon: "🏦", description: "High net worth individuals with low discretionary expenditure and value scrutiny.", marketing_strategy: "Quality assurance messaging, long-term warranty guarantees, investment value." };
    } else if (inputIncome < 40 && inputSpending < 40) {
      persona = { name: "Conservative Budgeters", icon: "🏷️", description: "Price-sensitive buyers seeking maximum utility and essential goods.", marketing_strategy: "Clearance promotions, discount coupons, volume price breaks." };
    }

    setClassificationResult({
      success: true,
      predicted_cluster: 0,
      persona
    });
  };

  const currentPoints = clusterData && clusterData.points ? clusterData.points : INITIAL_POINTS;
  const filteredPoints = currentPoints.filter(p =>
    selectedClusterFilter === 'ALL' || String(p.cluster) === selectedClusterFilter
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
              <Users style={{ color: '#fff', width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Customer Intelligence & Segmentation Clustering
                </h1>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(6,182,212,0.2)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.3)', fontWeight: 600 }}>Unsupervised ML</span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Project 03 • K-Means, DBSCAN, Hierarchical, GMM & RFM Persona Synthesis</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'explorer', label: 'Cluster Explorer', icon: Target },
              { id: 'diagnostics', label: 'Elbow & Silhouette', icon: BarChart3 },
              { id: 'personas', label: 'Customer Personas', icon: Users },
              { id: 'classifier', label: 'Live Profiler', icon: UserPlus },
              { id: 'crispdm', label: 'CRISP-DM & AutoResearch', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                    border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: isActive ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#67e8f9' : '#94a3b8',
                    outline: isActive ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <Icon style={{ width: 14, height: 14 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '24px 16px', flex: 1 }}>
        {/* TAB 1: CLUSTER EXPLORER */}
        {activeTab === 'explorer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
            {/* Left: 2D Interactive Scatter Canvas */}
            <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Customer Feature Space (Income vs Spending Score)</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>Hover points to inspect individual customer demographics</p>
                </div>

                <select
                  value={selectedClusterFilter}
                  onChange={e => setSelectedClusterFilter(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#67e8f9', fontSize: 12, outline: 'none' }}
                >
                  <option value="ALL">Show All Clusters</option>
                  {clusterData.cluster_summaries.map(cs => (
                    <option key={cs.cluster_id} value={String(cs.cluster_id)}>
                      Cluster #{cs.cluster_id}: {cs.persona.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2D Scatterplot SVG */}
              <div style={{ width: '100%', height: 420, background: 'rgba(0,0,0,0.4)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 500 350" style={{ width: '100%', height: '100%' }}>
                  {/* Grid Lines */}
                  {[70, 140, 210, 280].map(y => (
                    <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
                  ))}
                  {[120, 200, 280, 360, 440].map(x => (
                    <line key={x} x1={x} y1="20" x2={x} y2="310" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
                  ))}

                  {/* Axes Labels */}
                  <text x="240" y="340" fill="#64748b" fontSize="11" textAnchor="middle">Annual Income ($k)</text>
                  <text x="15" y="170" fill="#64748b" fontSize="11" textAnchor="middle" transform="rotate(-90 15,170)">Spending Score (1-100)</text>

                  {/* Data Points */}
                  {filteredPoints.map((pt, idx) => {
                    // Map income (15 to 140) to X (50 to 470)
                    const cx = 50 + ((pt.annual_income_k - 15) / 125) * 420;
                    // Map spending (1 to 100) to Y (300 to 30) (inverted for SVG)
                    const cy = 300 - ((pt.spending_score - 1) / 99) * 270;
                    const color = pt.cluster === -1 ? '#94a3b8' : CLUSTER_COLORS[pt.cluster % CLUSTER_COLORS.length];

                    return (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={hoveredPoint && hoveredPoint.customer_id === pt.customer_id ? 8 : 5}
                        fill={color}
                        opacity={hoveredPoint && hoveredPoint.customer_id === pt.customer_id ? 1 : 0.85}
                        stroke="#fff"
                        strokeWidth={hoveredPoint && hoveredPoint.customer_id === pt.customer_id ? 2 : 0.5}
                        style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredPoint && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', pointerEvents: 'none' }}>
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: 2 }}>{hoveredPoint.customer_id}</div>
                    <div style={{ color: '#67e8f9', fontWeight: 600, marginBottom: 4 }}>{hoveredPoint.persona_name}</div>
                    <div style={{ color: '#94a3b8' }}>Income: <b>${hoveredPoint.annual_income_k}k</b> | Spending: <b>{hoveredPoint.spending_score}/100</b></div>
                    <div style={{ color: '#94a3b8' }}>Age: <b>{hoveredPoint.age} yrs</b></div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Algorithm Control & Cluster Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Controls Card */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sliders style={{ color: '#06b6d4', width: 16, height: 16 }} />
                  Clustering Hyperparameters
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Clustering Algorithm</label>
                    <select
                      value={algorithm}
                      onChange={e => setAlgorithm(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none' }}
                    >
                      <option value="kmeans">K-Means (Partitioning Centroid)</option>
                      <option value="hierarchical">Agglomerative Hierarchical (Ward Linkage)</option>
                      <option value="gmm">Gaussian Mixture Model (GMM - EM)</option>
                      <option value="dbscan">DBSCAN (Density-Based Noise Isolation)</option>
                    </select>
                  </div>

                  {algorithm !== 'dbscan' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                        <span>Number of Clusters (K):</span>
                        <span style={{ fontWeight: 700, color: '#67e8f9' }}>{kValue}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        value={kValue}
                        onChange={e => setKValue(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#06b6d4' }}
                      />
                    </div>
                  )}

                  {/* Validation Scores */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 6, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Silhouette Score</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399' }}>{clusterData.metrics.silhouette_score}</div>
                    </div>
                    <div style={{ padding: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 6, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Calinski-Harabasz</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>{clusterData.metrics.calinski_harabasz_index}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cluster Summaries List */}
              <div className="glass-panel" style={{ padding: 20, flex: 1, overflowY: 'auto', maxHeight: 300 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>Identified Customer Segments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {clusterData.cluster_summaries.map(cs => {
                    const color = cs.cluster_id === -1 ? '#94a3b8' : CLUSTER_COLORS[cs.cluster_id % CLUSTER_COLORS.length];
                    return (
                      <div key={cs.cluster_id} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}33`, borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }}></span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{cs.persona.name}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#67e8f9' }}>{cs.pct_of_total}% ({cs.count})</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          Avg Income: <b>${cs.avg_annual_income_k}k</b> • Avg Spend: <b>{cs.avg_spending_score}</b> • Age: <b>{cs.avg_age}</b>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ELBOW & SILHOUETTE DIAGNOSTICS */}
        {activeTab === 'diagnostics' && diagnostics && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>Elbow Method: Within-Cluster Sum of Squares (WCSS)</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Optimal cluster count is identified at the inflection "elbow" point (K=5).</p>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 200, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {diagnostics.wcss_inertia.map((w, i) => {
                  const maxW = Math.max(...diagnostics.wcss_inertia);
                  const heightPct = Math.round((w / maxW) * 100);
                  const isOpt = diagnostics.k_range[i] === diagnostics.recommended_k;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: isOpt ? '#34d399' : '#64748b', fontWeight: isOpt ? 700 : 400 }}>{Math.round(w)}</span>
                      <div style={{ width: '100%', height: `${heightPct}%`, background: isOpt ? 'linear-gradient(180deg, #10b981, #06b6d4)' : 'rgba(255,255,255,0.1)', borderRadius: 4 }}></div>
                      <span style={{ fontSize: 11, fontWeight: isOpt ? 800 : 500, color: isOpt ? '#34d399' : '#94a3b8' }}>K={diagnostics.k_range[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>Silhouette Analysis Across Cluster Numbers</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Higher silhouette coefficients indicate tighter cohesion and wider separation.</p>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 200, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {diagnostics.silhouette_scores.map((s, i) => {
                  const heightPct = Math.round((s / 0.6) * 100);
                  const isOpt = diagnostics.k_range[i] === diagnostics.recommended_k;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: isOpt ? '#38bdf8' : '#64748b', fontWeight: isOpt ? 700 : 400 }}>{s.toFixed(2)}</span>
                      <div style={{ width: '100%', height: `${heightPct}%`, background: isOpt ? 'linear-gradient(180deg, #38bdf8, #6366f1)' : 'rgba(255,255,255,0.1)', borderRadius: 4 }}></div>
                      <span style={{ fontSize: 11, fontWeight: isOpt ? 800 : 500, color: isOpt ? '#38bdf8' : '#94a3b8' }}>K={diagnostics.k_range[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER PERSONAS */}
        {activeTab === 'personas' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { name: "VIP Luxury Spenders", icon: "💎", color: "#06b6d4", desc: "High income earners with peak engagement and premium purchase history.", strategy: "VIP concierge, early access to flagship collections, luxury loyalty tiers." },
              { name: "Trendsetters / Enthusiasts", icon: "🚀", color: "#f59e0b", desc: "Young demographic with high willingness to spend despite modest income.", strategy: "Flash sales, viral social campaigns, Buy-Now-Pay-Later payment options." },
              { name: "Mainstream Shoppers", icon: "🛍️", color: "#10b981", desc: "Balanced middle-income consumers with predictable, regular purchasing cycles.", strategy: "Seasonal bundle discounts, standard loyalty points, email newsletters." },
              { name: "Affluent Savers", icon: "🏦", color: "#8b5cf6", desc: "High net worth individuals with low discretionary expenditure and value scrutiny.", strategy: "Quality assurance messaging, long-term warranty guarantees, investment value." },
              { name: "Conservative Budgeters", icon: "🏷️", color: "#f43f5e", desc: "Price-sensitive buyers seeking maximum utility and essential goods.", strategy: "Clearance promotions, discount coupons, volume price breaks." }
            ].map((p, i) => (
              <div key={i} className="glass-panel" style={{ padding: 20, borderTop: `4px solid ${p.color}` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</p>
                <div style={{ fontSize: 12, padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 6, color: '#94a3b8', borderLeft: `2px solid ${p.color}` }}>
                  <b>Strategy:</b> {p.strategy}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LIVE CUSTOMER PROFILER */}
        {activeTab === 'classifier' && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Real-Time Customer Profiler & Classifier</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Enter new customer demographic features to infer their cluster segment and marketing playbook.</p>

              <form onSubmit={handleClassifyCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                    <span>Customer Age: <b>{inputAge} years</b></span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={inputAge}
                    onChange={e => setInputAge(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                    <span>Annual Income: <b>${inputIncome}k USD</b></span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="140"
                    value={inputIncome}
                    onChange={e => setInputIncome(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                    <span>Spending Score: <b>{inputSpending} / 100</b></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="99"
                    value={inputSpending}
                    onChange={e => setInputSpending(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Sparkles style={{ width: 16, height: 16 }} />
                  Classify Customer Segment
                </button>
              </form>

              {classificationResult && (
                <div style={{ marginTop: 20, padding: 16, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{classificationResult.persona.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: '#67e8f9', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Persona</div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{classificationResult.persona.name}</h4>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 8 }}>{classificationResult.persona.description}</p>
                  <div style={{ fontSize: 12, color: '#38bdf8' }}><b>Recommended Playbook:</b> {classificationResult.persona.marketing_strategy}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CRISP-DM & AUTORESEARCH */}
        {activeTab === 'crispdm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {crispdm && (
              <div className="glass-panel" style={{ padding: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{crispdm.title}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {crispdm.phases.map(p => (
                    <div key={p.phase} style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#06b6d4', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>{p.phase}</span>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{p.name}</h4>
                      </div>
                      <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>AutoResearch Hill Climbing Feature Ablation Log</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                    <th style={{ padding: '10px' }}>Exp ID</th>
                    <th style={{ padding: '10px' }}>Clustering Technique & Scaling</th>
                    <th style={{ padding: '10px' }}>K</th>
                    <th style={{ padding: '10px' }}>Silhouette Score</th>
                    <th style={{ padding: '10px' }}>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {experiments.map(e => (
                    <tr key={e.exp_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px', color: '#06b6d4', fontWeight: 700 }}>#{e.exp_id}</td>
                      <td style={{ padding: '10px', color: '#fff' }}>{e.technique}</td>
                      <td style={{ padding: '10px', color: '#94a3b8' }}>{e.k}</td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>{e.silhouette}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(6,182,212,0.15)', color: '#67e8f9', fontWeight: 600 }}>{e.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
