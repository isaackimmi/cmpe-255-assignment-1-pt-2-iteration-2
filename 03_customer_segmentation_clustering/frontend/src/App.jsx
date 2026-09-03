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

export default function App() {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'diagnostics' | 'personas' | 'classifier' | 'crispdm'
  const [algorithm, setAlgorithm] = useState('kmeans');
  const [kValue, setKValue] = useState(5);
  const [clusterData, setClusterData] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [crispdm, setCrispdm] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL');

  // Customer Classifier Form State
  const [inputAge, setInputAge] = useState(30);
  const [inputIncome, setInputIncome] = useState(75);
  const [inputSpending, setInputSpending] = useState(80);
  const [classificationResult, setClassificationResult] = useState(null);

  const fetchClusters = async () => {
    try {
      const res = await fetch(`/api/clusters?algorithm=${algorithm}&k=${kValue}`);
      const data = await res.json();
      if (data.success) {
        setClusterData(data);
      }
    } catch (e) {
      console.error('Fetch clusters error:', e);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, [algorithm, kValue]);

  useEffect(() => {
    fetch('/api/evaluation/elbow-silhouette').then(r => r.json()).then(setDiagnostics).catch(() => {});
    fetch('/api/autoresearch/experiments').then(r => r.json()).then(setExperiments).catch(() => {});
    fetch('/api/crispdm').then(r => r.json()).then(setCrispdm).catch(() => {});
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
      const data = await res.json();
      if (data.success) {
        setClassificationResult(data);
      }
    } catch (err) {
      console.error('Classification error:', err);
    }
  };

  const filteredPoints = clusterData ? clusterData.points.filter(p =>
    selectedClusterFilter === 'ALL' || String(p.cluster) === selectedClusterFilter
  ) : [];

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
        {activeTab === 'explorer' && clusterData && (
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
