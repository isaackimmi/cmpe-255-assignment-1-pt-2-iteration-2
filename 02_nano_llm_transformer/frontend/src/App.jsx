import React, { useState, useEffect } from 'react';
import {
  Bot, User, Send, Sparkles, Cpu, Layers, Activity,
  Sliders, Zap, Terminal, RefreshCw, BarChart2, ShieldCheck,
  ChevronRight, Brain, Clock, Gauge
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'architecture' | 'attention' | 'training' | 'crispdm'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am **NanoLlama-128M**, an autoregressive Transformer powered by Rotary Position Embeddings (RoPE), SwiGLU activations, RMSNorm, and KV-Caching. Ask me any questions about Data Science, Machine Learning, Transformer Math, or CRISP-DM.' }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [attentionData, setAttentionData] = useState([]);
  const [selectedHead, setSelectedHead] = useState(1);
  const [architecture, setArchitecture] = useState(null);
  const [lossCurves, setLossCurves] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [crispdm, setCrispdm] = useState(null);

  // Inference Hyperparameters
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  const samplePrompts = [
    "Explain the CRISP-DM framework for machine learning",
    "What are Rotary Position Embeddings (RoPE) and SwiGLU?",
    "How does KV-Caching optimize autoregressive decoding?",
    "Show me a PyTorch RMSNorm implementation",
    "Compare K-Means vs DBSCAN vs GMM clustering algorithms"
  ];

  useEffect(() => {
    fetch('/api/architecture').then(r => r.json()).then(setArchitecture).catch(() => {});
    fetch('/api/training/loss-curves').then(r => r.json()).then(setLossCurves).catch(() => {});
    fetch('/api/autoresearch/benchmarks').then(r => r.json()).then(setBenchmarks).catch(() => {});
    fetch('/api/crispdm').then(r => r.json()).then(setCrispdm).catch(() => {});
  }, []);

  const handleSendMessage = async (promptText) => {
    const query = promptText || inputPrompt;
    if (!query.trim() || isGenerating) return;

    const newMessages = [...messages, { role: 'user', content: query.trim() }];
    setMessages(newMessages);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query.trim(),
          temperature,
          top_p: topP
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
        setTelemetry(data.telemetry);
        if (data.attention_summary) {
          setAttentionData(data.attention_summary);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...newMessages, { role: 'assistant', content: '❌ Error generating response from NanoLlama backend.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
              <Brain style={{ color: '#fff', width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  NanoLlama SFT LLM Platform
                </h1>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)', fontWeight: 600 }}>128M Transformer</span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Project 02 • SOTA Autoregressive Primitives (RoPE, SwiGLU, RMSNorm, KV-Cache)</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'chat', label: 'Chat Studio', icon: Bot },
              { id: 'architecture', label: 'Architecture & Specs', icon: Cpu },
              { id: 'attention', label: 'Attention Heatmap', icon: Activity },
              { id: 'training', label: 'Loss & Benchmarks', icon: BarChart2 },
              { id: 'crispdm', label: 'CRISP-DM LLM', icon: ShieldCheck }
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
                    background: isActive ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#c4b5fd' : '#94a3b8',
                    outline: isActive ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.06)'
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
        {/* TAB 1: CHAT STUDIO */}
        {activeTab === 'chat' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Left: Chat Window */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: 600, padding: 20 }}>
              {/* Message History */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 8 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: m.role === 'assistant' ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {m.role === 'assistant' ? <Bot style={{ width: 18, height: 18, color: '#fff' }} /> : <User style={{ width: 18, height: 18, color: '#fff' }} />}
                    </div>
                    <div style={{ flex: 1, background: m.role === 'assistant' ? 'rgba(255,255,255,0.03)' : 'rgba(139,92,246,0.15)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', fontSize: 13, lineHeight: 1.6, color: '#f1f5f9', whiteSpace: 'pre-wrap' }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#94a3b8', fontSize: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RefreshCw style={{ width: 16, height: 16, color: '#fff', animation: 'spin 1s linear infinite' }} />
                    </div>
                    <span>NanoLlama autoregressive decoding with KV-Cache...</span>
                  </div>
                )}
              </div>

              {/* Sample Prompts Pills */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 0 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {samplePrompts.map((sp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sp)}
                    style={{ flexShrink: 0, fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', cursor: 'pointer' }}
                  >
                    {sp}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Ask NanoLlama anything about ML algorithms, transformers, code..."
                  value={inputPrompt}
                  onChange={e => setInputPrompt(e.target.value)}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !inputPrompt.trim()}
                  style={{ padding: '0 20px', borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', fontWeight: 600, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Send style={{ width: 16, height: 16 }} />
                </button>
              </form>
            </div>

            {/* Right: Live Telemetry & Sampling Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Telemetry Card */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Gauge style={{ color: '#8b5cf6', width: 16, height: 16 }} />
                  Inference Telemetry
                </h3>
                {telemetry ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>Throughput:</span>
                      <span style={{ fontWeight: 700, color: '#34d399' }}>{telemetry.tokens_per_second} tok/s</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>Tokens Generated:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{telemetry.tokens_generated} tokens</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>Latency:</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{telemetry.latency_ms} ms</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>KV-Cache Allocated:</span>
                      <span style={{ fontWeight: 600, color: '#38bdf8' }}>{telemetry.kv_cache_allocated_mb} MB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#94a3b8' }}>Peak VRAM Footprint:</span>
                      <span style={{ fontWeight: 600, color: '#c4b5fd' }}>{telemetry.peak_vram_mb} MB</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '20px 0' }}>
                    Send a message to view live GPU / inference telemetry.
                  </div>
                )}
              </div>

              {/* Sampling Hyperparameters */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sliders style={{ color: '#8b5cf6', width: 16, height: 16 }} />
                  Sampling Dials
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                      <span>Temperature:</span>
                      <span style={{ fontWeight: 700, color: '#c4b5fd' }}>{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={temperature}
                      onChange={e => setTemperature(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#8b5cf6' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                      <span>Top-P (Nucleus):</span>
                      <span style={{ fontWeight: 700, color: '#c4b5fd' }}>{topP}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={e => setTopP(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#8b5cf6' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARCHITECTURE SPECS */}
        {activeTab === 'architecture' && architecture && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>NanoLlama Model Architecture Specification</h2>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>State-of-the-Art Compact Autoregressive Transformer Architecture Breakdown</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {Object.entries(architecture).map(([k, v]) => (
                <div key={k} className="glass-panel" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'capitalize', marginBottom: 4 }}>{k.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENTION HEATMAP */}
        {activeTab === 'attention' && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Multi-Head Causal Attention Heatmap</h2>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>Visualizing attention weights across sequence positions for query/key dot-products.</p>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4].map(head => (
                  <button
                    key={head}
                    onClick={() => setSelectedHead(head)}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: selectedHead === head ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                      color: selectedHead === head ? '#fff' : '#94a3b8'
                    }}
                  >
                    Head #{head}
                  </button>
                ))}
              </div>
            </div>

            {attentionData.length > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 50px)', gap: 4 }}>
                  {(attentionData.find(a => a.head === selectedHead)?.matrix || []).map((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        style={{
                          width: 50, height: 50, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 600, color: '#fff',
                          background: `rgba(139, 92, 246, ${Math.max(0.08, val)})`,
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                Generate a response in Chat Studio to populate live multi-head attention weights.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TRAINING LOSS & BENCHMARKS */}
        {activeTab === 'training' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Benchmarks Table */}
            <div className="glass-panel" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>AutoResearch Empirical Benchmark Leaderboard</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>NanoLlama vs Standard Baseline Transformer Benchmark Scores</p>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                    <th style={{ padding: '12px' }}>Evaluation Benchmark</th>
                    <th style={{ padding: '12px' }}>NanoLlama-128M (RoPE+SwiGLU)</th>
                    <th style={{ padding: '12px' }}>Baseline Transformer</th>
                    <th style={{ padding: '12px' }}>Empirical Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((b, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#fff' }}>{b.benchmark}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>{b.nanollama}</td>
                      <td style={{ padding: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{b.baseline_transformer}</td>
                      <td style={{ padding: '12px', color: '#38bdf8', fontWeight: 700 }}>{b.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Loss Curves */}
            {lossCurves && (
              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>SFT Training Loss & Perplexity Trajectory</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 6, alignItems: 'flex-end', height: 160, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {lossCurves.train_loss.map((loss, i) => {
                    const heightPct = Math.round((loss / 4.0) * 100);
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: '100%', height: `${heightPct}%`, background: 'linear-gradient(180deg, #8b5cf6, #3b82f6)', borderRadius: 4 }}></div>
                        <span style={{ fontSize: 9, color: '#64748b' }}>{lossCurves.steps[i] / 1000}k</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
                  <span>Initial Loss: 3.82 (Perplexity ~45.6)</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>Final SFT Loss: 1.19 (Perplexity 4.09)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CRISP-DM LLM */}
        {activeTab === 'crispdm' && crispdm && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {crispdm.phases.map(p => (
              <div key={p.phase} className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{p.phase}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{p.name}</h3>
                </div>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
