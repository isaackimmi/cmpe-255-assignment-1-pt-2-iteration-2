import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation, MapPin, Clock, DollarSign, Gauge, Shield, Cpu,
  TrendingUp, Award, Layers, Compass, Calendar, Users, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, Activity, Zap
} from 'lucide-react';
import L from 'leaflet';

export default function App() {
  const [activeTab, setActiveTab] = useState('estimator'); // 'estimator' | 'crispdm' | 'autoresearch' | 'leaderboard'
  const [sampleTrips, setSampleTrips] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hillclimbing, setHillclimbing] = useState([]);
  const [crispdm, setCrispdm] = useState(null);

  // Map & Prediction State
  const [pickup, setPickup] = useState({ lat: 40.7580, lon: -73.9855, label: 'Times Square' });
  const [dropoff, setDropoff] = useState({ lat: 40.7061, lon: -73.9969, label: 'Brooklyn Bridge' });
  const [passengerCount, setPassengerCount] = useState(1);
  const [pickupHour, setPickupHour] = useState(17);
  const [pickupDay, setPickupDay] = useState(2); // Tuesday
  const [selectedModel, setSelectedModel] = useState('random_forest');
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ pickup: null, dropoff: null, polyline: null });

  // Fetch initial API data
  useEffect(() => {
    fetch('/api/sample-trips').then(r => r.json()).then(setSampleTrips).catch(() => {});
    fetch('/api/models/leaderboard').then(r => r.json()).then(setLeaderboard).catch(() => {});
    fetch('/api/autoresearch/hillclimbing').then(r => r.json()).then(setHillclimbing).catch(() => {});
    fetch('/api/crispdm').then(r => r.json()).then(setCrispdm).catch(() => {});
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [40.74, -73.98],
      zoom: 12
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Markers & Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { pickup: pMarker, dropoff: dMarker, polyline } = markersRef.current;
    if (pMarker) map.removeLayer(pMarker);
    if (dMarker) map.removeLayer(dMarker);
    if (polyline) map.removeLayer(polyline);

    const pickupIcon = L.divIcon({
      className: 'custom-pin-pickup',
      html: `<div style="background:#10b981; width:28px; height:28px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px #10b981; font-weight:800; font-size:11px; color:#fff;">P</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const dropoffIcon = L.divIcon({
      className: 'custom-pin-dropoff',
      html: `<div style="background:#ef4444; width:28px; height:28px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px #ef4444; font-weight:800; font-size:11px; color:#fff;">D</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const newPMarker = L.marker([pickup.lat, pickup.lon], { icon: pickupIcon, draggable: true }).addTo(map);
    newPMarker.bindPopup(`<b>Pickup:</b> ${pickup.label || 'Custom Point'}`);
    newPMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setPickup({ lat: Number(pos.lat.toFixed(4)), lon: Number(pos.lng.toFixed(4)), label: 'Custom Coordinate' });
    });

    const newDMarker = L.marker([dropoff.lat, dropoff.lon], { icon: dropoffIcon, draggable: true }).addTo(map);
    newDMarker.bindPopup(`<b>Dropoff:</b> ${dropoff.label || 'Custom Point'}`);
    newDMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setDropoff({ lat: Number(pos.lat.toFixed(4)), lon: Number(pos.lng.toFixed(4)), label: 'Custom Coordinate' });
    });

    const newPolyline = L.polyline([[pickup.lat, pickup.lon], [dropoff.lat, dropoff.lon]], {
      color: '#f59e0b',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.85
    }).addTo(map);

    markersRef.current = { pickup: newPMarker, dropoff: newDMarker, polyline: newPolyline };
    map.fitBounds([[pickup.lat, pickup.lon], [dropoff.lat, dropoff.lon]], { padding: [50, 50] });
  }, [pickup, dropoff]);

  // Execute Prediction API
  const runPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_lat: pickup.lat,
          pickup_lon: pickup.lon,
          dropoff_lat: dropoff.lat,
          dropoff_lon: dropoff.lon,
          passenger_count: passengerCount,
          pickup_hour: pickupHour,
          pickup_day_of_week: pickupDay,
          selected_model: selectedModel
        })
      });
      const data = await res.json();
      if (data.success) {
        setPredictionResult(data);
      }
    } catch (e) {
      console.error('Prediction failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [pickup, dropoff, passengerCount, pickupHour, pickupDay, selectedModel]);

  const selectSample = (trip) => {
    setPickup(trip.pickup);
    setDropoff(trip.dropoff);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}>
              <Navigation style={{ color: '#fff', width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  NYC Taxi Trip Duration & Fare Predictor
                </h1>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 600 }}>CRISP-DM Standard</span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Project 01 • Kaggle NYC Taxi Challenge ML Regression & Spatial Feature Engineering</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'estimator', label: 'Trip Estimator & Map', icon: Navigation },
              { id: 'crispdm', label: 'CRISP-DM Report', icon: Layers },
              { id: 'autoresearch', label: 'AutoResearch Hill Climbing', icon: TrendingUp },
              { id: 'leaderboard', label: 'Model Benchmark', icon: Award }
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
                    background: isActive ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#fcd34d' : '#94a3b8',
                    outline: isActive ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)'
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
        {/* TAB 1: ESTIMATOR & MAP */}
        {activeTab === 'estimator' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            {/* Left: Interactive Leaflet Map & Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="glass-panel" style={{ padding: 16, height: 460, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin style={{ color: '#f59e0b', width: 16, height: 16 }} />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Interactive NYC Geospatial Map</h3>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Drag markers to update routes</span>
                </div>
                <div ref={mapContainerRef} style={{ flex: 1, minHeight: 380, borderRadius: 8, overflow: 'hidden' }}></div>
              </div>

              {/* Sample Popular Routes */}
              <div className="glass-panel" style={{ padding: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#cbd5e1' }}>Popular NYC Trip Benchmarks</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {sampleTrips.map((st, i) => (
                    <div
                      key={i}
                      onClick={() => selectSample(st)}
                      style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>{st.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{st.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real-Time Estimator Controls & Prediction Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Prediction Result Hero Card */}
              {predictionResult && (
                <div className="glass-panel" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ML Inference Prediction</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Model: {predictionResult.model_used.replace('_', ' ')}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>
                        <Clock style={{ width: 14, height: 14, color: '#38bdf8' }} />
                        <span>Estimated Duration</span>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
                        {predictionResult.prediction.duration_minutes} <span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}>min</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                        95% CI: {predictionResult.prediction.confidence_interval_95[0]} - {predictionResult.prediction.confidence_interval_95[1]} min
                      </div>
                    </div>

                    <div style={{ padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>
                        <DollarSign style={{ width: 14, height: 14, color: '#34d399' }} />
                        <span>Estimated Total Fare</span>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#34d399' }}>
                        ${predictionResult.prediction.estimated_fare_usd.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                        TLC Standard Fare Schedule
                      </div>
                    </div>
                  </div>

                  {/* Geospatial Metrics Pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11, textAlign: 'center' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                      <div style={{ color: '#94a3b8' }}>Haversine Dist</div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{predictionResult.spatial_features.haversine_distance_km} km</div>
                    </div>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                      <div style={{ color: '#94a3b8' }}>Manhattan Dist</div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{predictionResult.spatial_features.manhattan_distance_km} km</div>
                    </div>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                      <div style={{ color: '#94a3b8' }}>Compass Bearing</div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{predictionResult.spatial_features.bearing_degrees}°</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Parameter Controls */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>Trip Simulation Parameters</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                      <span>Pickup Time of Day: <b>{pickupHour}:00 ({pickupHour >= 7 && pickupHour <= 10 ? 'Morning Rush' : pickupHour >= 16 && pickupHour <= 19 ? 'Evening Rush' : 'Off-Peak'})</b></span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="23"
                      value={pickupHour}
                      onChange={e => setPickupHour(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                      <span>Day of Week: <b>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][pickupDay]}</b></span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      value={pickupDay}
                      onChange={e => setPickupDay(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Passenger Count</label>
                      <select
                        value={passengerCount}
                        onChange={e => setPassengerCount(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none' }}
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Active ML Model</label>
                      <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none' }}
                      >
                        <option value="random_forest">Random Forest (Champion)</option>
                        <option value="gradient_boosting">Gradient Boosted Trees</option>
                        <option value="ridge">Ridge Linear Regression</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRISP-DM RESEARCH REPORT */}
        {activeTab === 'crispdm' && crispdm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{crispdm.title}</h2>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Comprehensive 6-Phase Data Science Methodology Breakdown</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {crispdm.phases.map(phase => (
                <div key={phase.phase} className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f59e0b', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{phase.phase}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{phase.name}</h3>
                  </div>

                  {phase.objectives && (
                    <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 10 }}><b>Objective:</b> {phase.objectives}</p>
                  )}
                  {phase.kpis && (
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                      <b>Target KPIs:</b> {phase.kpis.join(' • ')}
                    </div>
                  )}
                  {phase.findings && (
                    <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}><b>EDA Findings:</b> {phase.findings}</p>
                  )}
                  {phase.transformations && (
                    <ul style={{ fontSize: 12, color: '#94a3b8', paddingLeft: 18, lineHeight: 1.6 }}>
                      {phase.transformations.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  )}
                  {phase.champion_metric && (
                    <div style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>{phase.champion_metric}</div>
                  )}
                  {phase.infrastructure && (
                    <div style={{ fontSize: 12, color: '#38bdf8' }}><b>Infrastructure:</b> {phase.infrastructure}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUTORESEARCH HILL CLIMBING */}
        {activeTab === 'autoresearch' && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>AutoResearch Hill Climbing Feature Ablation Log</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Iterative hypothesis generation, feature additions, and cross-validation score minimization.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                  <th style={{ padding: '12px' }}>Iter</th>
                  <th style={{ padding: '12px' }}>Hypothesis / Change Description</th>
                  <th style={{ padding: '12px' }}>Feature Additions</th>
                  <th style={{ padding: '12px' }}>CV RMSLE</th>
                  <th style={{ padding: '12px' }}>Delta</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {hillclimbing.map(h => (
                  <tr key={h.iteration} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#f59e0b' }}>#{h.iteration}</td>
                    <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 600 }}>{h.hypothesis}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {h.feature_set.map(f => (
                          <span key={f} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: '#38bdf8' }}>{f}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#fff' }}>{h.cv_rmsle.toFixed(3)}</td>
                    <td style={{ padding: '12px', color: h.delta_pct.startsWith('-') ? '#34d399' : '#94a3b8', fontWeight: 600 }}>{h.delta_pct}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 600 }}>Accepted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: MODEL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="glass-panel" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Kaggle Benchmark Model Leaderboard</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Multi-model performance metrics, root mean square error (RMSE), and serving latency.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                  <th style={{ padding: '12px' }}>Rank</th>
                  <th style={{ padding: '12px' }}>Model Architecture</th>
                  <th style={{ padding: '12px' }}>RMSLE</th>
                  <th style={{ padding: '12px' }}>RMSE (Seconds)</th>
                  <th style={{ padding: '12px' }}>MAE (Seconds)</th>
                  <th style={{ padding: '12px' }}>R² Score</th>
                  <th style={{ padding: '12px' }}>Latency</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(item => (
                  <tr key={item.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: item.rank === 1 ? '#f59e0b' : '#94a3b8' }}>#{item.rank}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#fff' }}>{item.model}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>{item.rmsle}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{item.rmse_seconds}s</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{item.mae_seconds}s</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{item.r2_score}</td>
                    <td style={{ padding: '12px', color: '#38bdf8' }}>{item.latency_ms} ms</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: item.rank === 1 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: item.rank === 1 ? '#fcd34d' : '#94a3b8', fontWeight: 600 }}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
