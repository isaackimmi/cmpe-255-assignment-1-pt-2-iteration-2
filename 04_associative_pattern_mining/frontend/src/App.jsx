import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Network, Table, Sparkles, Sliders,
  Plus, Trash2, ArrowRight, TrendingUp, CheckCircle2,
  ShieldCheck, Percent, Layers, BarChart2, Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('recommender'); // 'recommender' | 'graph' | 'rules' | 'itemsets' | 'crispdm'
  const [items, setItems] = useState([]);
  const [minSupport, setMinSupport] = useState(0.03);
  const [minConfidence, setMinConfidence] = useState(0.20);
  const [minLift, setMinLift] = useState(1.1);
  const [rulesData, setRulesData] = useState(null);
  const [frequentItemsets, setFrequentItemsets] = useState([]);
  const [crispdm, setCrispdm] = useState(null);
  const [experiments, setExperiments] = useState([]);

  // Smart Cart State
  const [cart, setCart] = useState(["Organic Whole Milk", "Ripe Bananas"]);
  const [recommendations, setRecommendations] = useState([]);

  const fetchRules = async () => {
    try {
      const res = await fetch(`/api/rules?min_support=${minSupport}&min_confidence=${minConfidence}&min_lift=${minLift}`);
      const data = await res.json();
      if (data.success) {
        setRulesData(data);
      }
    } catch (e) {
      console.error('Fetch rules error:', e);
    }
  };

  const fetchRecommendations = async (currentCart) => {
    if (!currentCart || currentCart.length === 0) {
      setRecommendations([]);
      return;
    }
    try {
      const res = await fetch('/api/recommend-basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_items: currentCart, top_n: 4 })
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error('Fetch recs error:', e);
    }
  };

  useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(setItems).catch(() => {});
    fetch('/api/frequent-itemsets').then(r => r.json()).then(setFrequentItemsets).catch(() => {});
    fetch('/api/crispdm').then(r => r.json()).then(setCrispdm).catch(() => {});
    fetch('/api/autoresearch/experiments').then(r => r.json()).then(setExperiments).catch(() => {});
  }, []);

  useEffect(() => {
    fetchRules();
  }, [minSupport, minConfidence, minLift]);

  useEffect(() => {
    fetchRecommendations(cart);
  }, [cart]);

  const toggleCartItem = (item) => {
    if (cart.includes(item)) {
      setCart(cart.filter(c => c !== item));
    } else {
      setCart([...cart, item]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.5)' }}>
              <ShoppingBag style={{ color: '#fff', width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Market Basket Association Pattern Mining
                </h1>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600 }}>Apriori & FP-Growth</span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Project 04 • Kaggle Groceries Transaction Affinity & Live Cross-Sell Engine</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'recommender', label: 'Smart Basket Studio', icon: Sparkles },
              { id: 'graph', label: 'Co-Occurrence Network', icon: Network },
              { id: 'rules', label: 'Mined Association Rules', icon: Table },
              { id: 'itemsets', label: 'Frequent Itemsets', icon: Layers },
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
                    background: isActive ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#6ee7b7' : '#94a3b8',
                    outline: isActive ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)'
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

      {/* Main Content */}
      <main style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '24px 16px', flex: 1 }}>
        {/* TAB 1: SMART BASKET RECOMMENDER */}
        {activeTab === 'recommender' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            {/* Left: Grocery Shelf Selection */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Interactive Grocery Catalog</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>Click items to add or remove from your shopping cart</p>
                </div>
                <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>1,500 Transactions Mined</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {items.map(item => {
                  const inCart = cart.includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => toggleCartItem(item.name)}
                      style={{
                        padding: '12px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s ease',
                        background: inCart ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.02)',
                        border: inCart ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: inCart ? '0 0 14px rgba(16,185,129,0.2)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: inCart ? '#fff' : '#cbd5e1', marginBottom: 4 }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                        <span>Support:</span>
                        <span style={{ fontWeight: 600 }}>{(item.support * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Cart & AI Cross-Sell Recommendations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Active Cart */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShoppingBag style={{ width: 16, height: 16, color: '#10b981' }} />
                    Active Cart Contents ({cart.length})
                  </h3>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 11, cursor: 'pointer' }}>Clear Cart</button>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 40 }}>
                  {cart.map(c => (
                    <span key={c} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c}
                      <button onClick={(e) => { e.stopPropagation(); toggleCartItem(c); }} style={{ background: 'none', border: 'none', color: '#6ee7b7', cursor: 'pointer', fontSize: 10 }}>✕</button>
                    </span>
                  ))}
                  {cart.length === 0 && (
                    <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>Your cart is empty. Click items on the left to begin basket mining.</div>
                  )}
                </div>
              </div>

              {/* High-Lift Recommendations */}
              <div className="glass-panel" style={{ padding: 20, flex: 1 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles style={{ width: 16, height: 16, color: '#38bdf8' }} />
                  High-Lift Cross-Sell Recommendations
                </h3>

                {recommendations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {recommendations.map((rec, i) => (
                      <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{rec.item}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            Triggered by: <b>{rec.triggered_by.join(', ')}</b>
                          </div>
                          <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11 }}>
                            <span style={{ color: '#34d399', fontWeight: 600 }}>Confidence: {(rec.confidence * 100).toFixed(1)}%</span>
                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>Lift: {rec.lift.toFixed(2)}x</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleCartItem(rec.item)}
                          style={{ padding: '6px 12px', borderRadius: 6, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                        >
                          + Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: 12 }}>
                    No strong association triggers for current combination. Try adding complementary items.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NETWORK GRAPH */}
        {activeTab === 'graph' && rulesData && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Itemset Affinity Co-Occurrence Network Graph</h2>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>Visualizing frequent item connections where edge thickness represents association Lift.</p>
              </div>

              <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6ee7b7' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> High Lift ({'>'}2.0x)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }}></span> Moderate Lift (1.2 - 2.0x)</span>
              </div>
            </div>

            {/* Network Graph Simulation Canvas */}
            <div style={{ width: '100%', height: 460, background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 800 450" style={{ width: '100%', height: '100%' }}>
                {/* Circular Network Layout */}
                {rulesData.network_graph.nodes.slice(0, 16).map((node, i, arr) => {
                  const angle = (i / arr.length) * 2 * Math.PI;
                  const cx = 400 + 260 * Math.cos(angle);
                  const cy = 225 + 170 * Math.sin(angle);
                  node.x = cx;
                  node.y = cy;
                  return null;
                })}

                {/* Draw Edges */}
                {rulesData.network_graph.links.slice(0, 30).map((link, i) => {
                  const srcNode = rulesData.network_graph.nodes.find(n => n.id === link.source);
                  const tgtNode = rulesData.network_graph.nodes.find(n => n.id === link.target);
                  if (!srcNode || !tgtNode || !srcNode.x || !tgtNode.x) return null;

                  const isHighLift = link.lift > 2.0;
                  return (
                    <line
                      key={i}
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isHighLift ? '#10b981' : '#38bdf8'}
                      strokeWidth={Math.min(4, link.lift)}
                      strokeOpacity={0.4}
                    />
                  );
                })}

                {/* Draw Nodes */}
                {rulesData.network_graph.nodes.slice(0, 16).map((node, i) => {
                  if (!node.x || !node.y) return null;
                  return (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                      <circle
                        r={Math.min(22, 10 + node.degree * 2)}
                        fill="rgba(16, 185, 129, 0.85)"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                      <text
                        y={node.y > 225 ? 20 : -14}
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {node.id.length > 18 ? node.id.substring(0, 16) + '...' : node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* TAB 3: MINED RULES TABLE */}
        {activeTab === 'rules' && rulesData && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Mined Association Rules Catalog</h2>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>Filter thresholds: Min Support {(minSupport * 100).toFixed(1)}%, Min Confidence {(minConfidence * 100).toFixed(1)}%, Min Lift {minLift}x</p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ color: '#94a3b8' }}>Min Lift:</span>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={minLift}
                    onChange={e => setMinLift(Number(e.target.value))}
                    style={{ accentColor: '#10b981', width: 100 }}
                  />
                  <span style={{ fontWeight: 700, color: '#6ee7b7' }}>{minLift}x</span>
                </div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                  <th style={{ padding: '12px' }}>Antecedent (IF)</th>
                  <th style={{ padding: '12px' }}>Consequent (THEN)</th>
                  <th style={{ padding: '12px' }}>Support</th>
                  <th style={{ padding: '12px' }}>Confidence</th>
                  <th style={{ padding: '12px' }}>Lift</th>
                  <th style={{ padding: '12px' }}>Leverage</th>
                  <th style={{ padding: '12px' }}>Conviction</th>
                </tr>
              </thead>
              <tbody>
                {rulesData.rules.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>{r.antecedent.join(' + ')}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#6ee7b7' }}>{r.consequent.join(' + ')}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{(r.support * 100).toFixed(2)}%</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#38bdf8' }}>{(r.confidence * 100).toFixed(1)}%</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>{r.lift.toFixed(2)}x</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{r.leverage.toFixed(4)}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{r.conviction.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: FREQUENT ITEMSETS */}
        {activeTab === 'itemsets' && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Frequent $k$-Itemset Hierarchy</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>Discovered Level-1, Level-2, and Level-3 itemset co-occurrences above minimum support threshold.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                  <th style={{ padding: '12px' }}>Order ($k$)</th>
                  <th style={{ padding: '12px' }}>Itemset Elements</th>
                  <th style={{ padding: '12px' }}>Support Fraction</th>
                  <th style={{ padding: '12px' }}>Transaction Occurrences</th>
                </tr>
              </thead>
              <tbody>
                {frequentItemsets.map((fit, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: fit.k === 3 ? 'rgba(139,92,246,0.2)' : fit.k === 2 ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)', color: fit.k === 3 ? '#c4b5fd' : fit.k === 2 ? '#7dd3fc' : '#cbd5e1', fontWeight: 700 }}>
                        {fit.k}-Itemset
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#fff' }}>{fit.itemset.join(', ')}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>{(fit.support * 100).toFixed(2)}%</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{fit.tx_count} baskets</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>{p.phase}</span>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{p.name}</h4>
                      </div>
                      <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>AutoResearch Performance & Runtime Benchmark (Apriori vs FP-Growth)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                    <th style={{ padding: '10px' }}>Exp ID</th>
                    <th style={{ padding: '10px' }}>Algorithm & Data Structure</th>
                    <th style={{ padding: '10px' }}>Min Support</th>
                    <th style={{ padding: '10px' }}>Execution Time</th>
                    <th style={{ padding: '10px' }}>Memory Footprint</th>
                  </tr>
                </thead>
                <tbody>
                  {experiments.map(e => (
                    <tr key={e.exp_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px', color: '#10b981', fontWeight: 700 }}>#{e.exp_id}</td>
                      <td style={{ padding: '10px', color: '#fff', fontWeight: 600 }}>{e.algorithm}</td>
                      <td style={{ padding: '10px', color: '#94a3b8' }}>{e.min_support}</td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>{e.execution_time_ms} ms</td>
                      <td style={{ padding: '10px', color: '#38bdf8' }}>{e.memory_kb} KB</td>
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
