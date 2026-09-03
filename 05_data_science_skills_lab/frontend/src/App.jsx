import React, { useState, useEffect } from 'react';
import {
  FlaskConical, Database, Play, Search, Filter,
  BarChart2, PieChart, Layers, CheckCircle2, AlertCircle,
  HelpCircle, ArrowRight, ShieldCheck, Sparkles, Activity,
  Cpu, FileSpreadsheet, RefreshCw
} from 'lucide-react';

const CATEGORY_COLORS = {
  "EDA & Profiling": "#38bdf8",
  "Data Preparation": "#f59e0b",
  "Statistical Testing": "#a855f7",
  "Feature Engineering": "#10b981",
  "Model Diagnostics": "#f43f5e"
};

export default function App() {
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'catalog' | 'crispdm'
  const [skills, setSkills] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('titanic');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [crispdm, setCrispdm] = useState(null);

  useEffect(() => {
    fetch('/api/skills/catalog')
      .then(r => r.json())
      .then(data => {
        setSkills(data.skills || []);
        if (data.skills && data.skills.length > 0) {
          setSelectedSkill(data.skills[0]);
        }
      })
      .catch(() => {});

    fetch('/api/datasets').then(r => r.json()).then(setDatasets).catch(() => {});
    fetch('/api/crispdm').then(r => r.json()).then(setCrispdm).catch(() => {});
  }, []);

  const runSkillExecution = async (skillToRun, datasetToUse) => {
    const s = skillToRun || selectedSkill;
    const d = datasetToUse || selectedDataset;
    if (!s) return;

    setIsExecuting(true);
    try {
      const res = await fetch('/api/skills/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_id: s.id,
          dataset_id: d
        })
      });
      const data = await res.json();
      if (data.success) {
        setExecutionResult(data);
      }
    } catch (e) {
      console.error('Skill execution failed:', e);
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    if (selectedSkill) {
      runSkillExecution(selectedSkill, selectedDataset);
    }
  }, [selectedSkill, selectedDataset]);

  const categories = Array.from(new Set(skills.map(s => s.category)));

  const filteredSkills = skills.filter(s => {
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchSearch = searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phase.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
              <FlaskConical style={{ color: '#fff', width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Data Science & ML Skills Mastery Lab
                </h1>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(56,189,248,0.2)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.3)', fontWeight: 600 }}>54 Live Skills</span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Project 05 • Interactive Analytics Lab on 6 Kaggle Benchmarks with Visual Dashboards</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'lab', label: 'Interactive Skills Lab', icon: FlaskConical },
              { id: 'catalog', label: 'Skills Catalog (54)', icon: Layers },
              { id: 'crispdm', label: 'CRISP-DM Taxonomy', icon: ShieldCheck }
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
                    background: isActive ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#7dd3fc' : '#94a3b8',
                    outline: isActive ? '1px solid rgba(56,189,248,0.4)' : '1px solid rgba(255,255,255,0.06)'
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
        {/* TAB 1: INTERACTIVE SKILLS LAB */}
        {activeTab === 'lab' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
            {/* Left: Dataset & Skill Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Dataset Selection */}
              <div className="glass-panel" style={{ padding: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Database style={{ width: 14, height: 14, color: '#38bdf8' }} />
                  Target Kaggle Benchmark Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={e => setSelectedDataset(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                >
                  {datasets.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.type} - {d.records} rows)
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills Selector List */}
              <div className="glass-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', height: 500 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ position: 'relative', marginBottom: 8 }}>
                    <Search style={{ position: 'absolute', left: 8, top: 8, width: 13, height: 13, color: '#64748b' }} />
                    <input
                      type="text"
                      placeholder="Search 54 skills..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px 6px 26px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, outline: 'none' }}
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 11, outline: 'none' }}
                  >
                    <option value="ALL">All Categories ({skills.length})</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 }}>
                  {filteredSkills.map(s => {
                    const isSelected = selectedSkill && selectedSkill.id === s.id;
                    const catColor = CATEGORY_COLORS[s.category] || '#38bdf8';
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSkill(s)}
                        style={{
                          padding: '8px 10px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s ease',
                          background: isSelected ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.04)'
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#fff' : '#cbd5e1', marginBottom: 2 }}>{s.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#94a3b8' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: catColor }}></span>
                          <span>{s.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Visual Interactive Execution Dashboard (NO Raw JSON) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {executionResult ? (
                <div className="glass-panel" style={{ padding: 24 }}>
                  {/* Skill Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontWeight: 700 }}>{executionResult.skill.category}</span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>• CRISP-DM: {executionResult.skill.phase}</span>
                      </div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{executionResult.headline}</h2>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Dataset: <b>{executionResult.dataset}</b></p>
                    </div>

                    <button
                      onClick={() => runSkillExecution(selectedSkill, selectedDataset)}
                      disabled={isExecuting}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 6, background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      <RefreshCw style={{ width: 13, height: 13, animation: isExecuting ? 'spin 1s linear infinite' : 'none' }} />
                      Re-Execute
                    </button>
                  </div>

                  {/* Summary KPI Badges */}
                  {executionResult.kpis && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
                      {executionResult.kpis.map((kpi, idx) => (
                        <div key={idx} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{kpi.label}</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: kpi.color || '#fff' }}>{kpi.value}</div>
                          {kpi.note && <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{kpi.note}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Visual Representation 1: Histogram */}
                  {executionResult.visual_type === 'histogram' && executionResult.chart_data && (
                    <div style={{ marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>Empirical Density Bins</h4>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {executionResult.chart_data.map((bin, i) => {
                          const maxCount = Math.max(...executionResult.chart_data.map(b => b.count));
                          const heightPct = Math.round((bin.count / (maxCount || 1)) * 100);
                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <span style={{ fontSize: 9, color: '#38bdf8', fontWeight: 600 }}>{bin.count}</span>
                              <div style={{ width: '100%', height: `${heightPct}%`, background: 'linear-gradient(180deg, #38bdf8, #0284c7)', borderRadius: 3 }}></div>
                              <span style={{ fontSize: 9, color: '#64748b', transform: 'rotate(-30deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>{bin.range}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Visual Representation 2: Correlation Matrix Heatmap */}
                  {executionResult.visual_type === 'correlation_matrix' && executionResult.columns && (
                    <div style={{ marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>Correlation Matrix Heatmap</h4>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ borderCollapse: 'collapse', textAlign: 'center', fontSize: 12, margin: '0 auto' }}>
                          <thead>
                            <tr>
                              <th></th>
                              {executionResult.columns.map(c => <th key={c} style={{ padding: '6px 12px', color: '#94a3b8', fontSize: 11 }}>{c}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {executionResult.columns.map(c1 => (
                              <tr key={c1}>
                                <td style={{ padding: '6px 12px', color: '#94a3b8', fontSize: 11, fontWeight: 600, textAlign: 'right' }}>{c1}</td>
                                {executionResult.columns.map(c2 => {
                                  const cell = executionResult.matrix_data.find(m => m.var1 === c1 && m.var2 === c2);
                                  const val = cell ? cell.value : 0;
                                  const alpha = Math.abs(val);
                                  const bg = val >= 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(244, 63, 94, ${alpha})`;
                                  return (
                                    <td key={c2} style={{ padding: '8px 12px', background: bg, color: alpha > 0.5 ? '#fff' : '#cbd5e1', fontWeight: 700, border: '1px solid rgba(255,255,255,0.05)' }}>
                                      {val.toFixed(2)}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Visual Representation 3: Hypothesis Testing Card */}
                  {executionResult.visual_type === 'hypothesis_test' && (
                    <div style={{ marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>Cohort Mean Comparison</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {executionResult.group_comparison.map((grp, i) => (
                          <div key={i} style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{grp.group} (N={grp.n})</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>μ = {grp.mean}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Std Dev (σ): {grp.std}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual Representation 4: PCA Scree Plot */}
                  {executionResult.visual_type === 'scree_plot' && executionResult.chart_data && (
                    <div style={{ marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>Eigenvalue Explained Variance Ratio</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {executionResult.chart_data.map(pc => (
                          <div key={pc.component}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{pc.component}</span>
                              <span style={{ color: '#38bdf8' }}>{pc.explained_variance_pct}% (Cumulative: {pc.cumulative_pct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${pc.explained_variance_pct}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #10b981)', borderRadius: 4 }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual Representation 5: Model Diagnostics (Confusion Matrix & ROC) */}
                  {executionResult.visual_type === 'model_diagnostics' && executionResult.confusion_matrix && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 10 }}>Confusion Matrix</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'center' }}>
                          <div style={{ padding: 12, background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', borderRadius: 6 }}>
                            <div style={{ fontSize: 10, color: '#6ee7b7' }}>True Negative (TN)</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{executionResult.confusion_matrix.tn}</div>
                          </div>
                          <div style={{ padding: 12, background: 'rgba(244,63,94,0.15)', border: '1px solid #f43f5e', borderRadius: 6 }}>
                            <div style={{ fontSize: 10, color: '#fda4af' }}>False Positive (FP)</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{executionResult.confusion_matrix.fp}</div>
                          </div>
                          <div style={{ padding: 12, background: 'rgba(244,63,94,0.15)', border: '1px solid #f43f5e', borderRadius: 6 }}>
                            <div style={{ fontSize: 10, color: '#fda4af' }}>False Negative (FN)</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{executionResult.confusion_matrix.fn}</div>
                          </div>
                          <div style={{ padding: 12, background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', borderRadius: 6 }}>
                            <div style={{ fontSize: 10, color: '#6ee7b7' }}>True Positive (TP)</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{executionResult.confusion_matrix.tp}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 10 }}>ROC Curve Points</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                          {executionResult.roc_curve.map((pt, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <span>Threshold #{i+1} (FPR: {pt.fpr.toFixed(2)})</span>
                              <span style={{ color: '#34d399', fontWeight: 600 }}>TPR: {pt.tpr.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Executive Analytical Takeaway Banner */}
                  <div style={{ padding: '14px 18px', background: 'rgba(56,189,248,0.08)', borderLeft: '4px solid #38bdf8', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#7dd3fc', marginBottom: 2 }}>Analytical Conclusion & Data Science Takeaway</div>
                    <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{executionResult.takeaway}</p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
                  Select a skill on the left to execute live analysis.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS CATALOG */}
        {activeTab === 'catalog' && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Complete 54 Data Science Skills Catalog</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Comprehensive taxonomy of analytical algorithms, statistical tests, and machine learning diagnostics.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
              {skills.map(s => {
                const color = CATEGORY_COLORS[s.category] || '#38bdf8';
                return (
                  <div
                    key={s.id}
                    onClick={() => { setSelectedSkill(s); setActiveTab('lab'); }}
                    style={{ padding: 14, background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}33`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s ease' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: `${color}22`, color: color, fontWeight: 700 }}>{s.category}</span>
                      <span style={{ fontSize: 10, color: '#64748b' }}>{s.phase}</span>
                    </div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.name}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CRISP-DM */}
        {activeTab === 'crispdm' && crispdm && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {crispdm.phases.map(p => (
              <div key={p.phase} className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#38bdf8', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{p.phase}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{p.name}</h3>
                </div>
                <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, marginBottom: 8 }}>{p.skills_count} Analytical Skills In Scope</div>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
