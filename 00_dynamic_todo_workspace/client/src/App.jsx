import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, Clock, AlertTriangle, Plus, Trash2, Edit3,
  Search, Filter, BarChart3, LayoutGrid, ListTodo, ShieldAlert,
  Flame, Check, Calendar, Tag, ChevronRight, ArrowRight, RefreshCw, Zap
} from 'lucide-react';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'review', title: 'In Review', color: '#8b5cf6' },
  { id: 'done', title: 'Completed', color: '#10b981' }
];

const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', color: 'badge-urgent' },
  { id: 'high', label: 'High', color: 'badge-high' },
  { id: 'medium', label: 'Medium', color: 'badge-medium' },
  { id: 'low', label: 'Low', color: 'badge-low' }
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'list' | 'matrix' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('todo');
  const [formPriority, setFormPriority] = useState('medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formEstimatedMinutes, setFormEstimatedMinutes] = useState(30);
  const [formTags, setFormTags] = useState('');
  const [formSubtasks, setFormSubtasks] = useState([{ id: 'st-1', title: '', completed: false }]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (e) {
      console.error('Fetch tasks error:', e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (e) {
      console.error('Fetch analytics error:', e);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();

    // SSE Real-time sync
    const eventSource = new EventSource('/api/events');
    eventSource.onopen = () => setIsLiveConnected(true);
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'tasks_updated') {
          fetchTasks();
          fetchAnalytics();
        }
      } catch (e) {}
    };
    eventSource.onerror = () => setIsLiveConnected(false);

    return () => eventSource.close();
  }, []);

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormStatus('todo');
    setFormPriority('medium');
    setFormDueDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setFormEstimatedMinutes(30);
    setFormTags('');
    setFormSubtasks([{ id: `st-${Date.now()}`, title: '', completed: false }]);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormStatus(task.status);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate || '');
    setFormEstimatedMinutes(task.estimatedMinutes || 30);
    setFormTags((task.tags || []).join(', '));
    setFormSubtasks(task.subtasks && task.subtasks.length > 0 ? task.subtasks : [{ id: `st-${Date.now()}`, title: '', completed: false }]);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      status: formStatus,
      priority: formPriority,
      dueDate: formDueDate,
      estimatedMinutes: Number(formEstimatedMinutes),
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      subtasks: formSubtasks.filter(s => s.title.trim())
    };

    try {
      if (editingTask) {
        await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchTasks();
      fetchAnalytics();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
      fetchAnalytics();
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchTasks();
      fetchAnalytics();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleToggleSubtask = async (task, subtaskId) => {
    const updatedSubtasks = (task.subtasks || []).map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      fetchTasks();
      fetchAnalytics();
    } catch (err) {
      console.error('Toggle subtask error:', err);
    }
  };

  // Filtered Tasks
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));
  const filteredTasks = tasks.filter(task => {
    const matchSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.tags && task.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchTag = selectedTag === 'ALL' || (task.tags && task.tags.includes(selectedTag));
    const matchPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
    return matchSearch && matchTag && matchPriority;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
              <Zap style={{ color: '#fff', width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Zenith Dynamic Task Workspace
                </h1>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', fontWeight: 600 }}>v2.0 Pro</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b' }}>Project 00 • Full-Stack Reactive Task & Telemetry Platform</p>
            </div>
          </div>

          {/* Quick Metrics & Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isLiveConnected ? '#10b981' : '#f59e0b', boxShadow: isLiveConnected ? '0 0 8px #10b981' : 'none' }}></span>
              <span style={{ color: '#94a3b8' }}>{isLiveConnected ? 'SSE Live Stream' : 'Connecting...'}</span>
            </div>

            <button
              onClick={openCreateModal}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'all 0.2s' }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* View Switcher & Filter Toolbar */}
        <div style={{ maxWidth: 1400, margin: '16px auto 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
              { id: 'list', label: 'List View', icon: ListTodo },
              { id: 'matrix', label: 'Priority Matrix', icon: ShieldAlert },
              { id: 'analytics', label: 'Productivity Telemetry', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6,
                    border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                    color: isActive ? '#a5b4fc' : '#94a3b8',
                    outline: isActive ? '1px solid rgba(99,102,241,0.4)' : 'none'
                  }}
                >
                  <Icon style={{ width: 15, height: 15 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 10, top: 9, width: 14, height: 14, color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search tasks, tags, desc..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '6px 12px 6px 30px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, width: 200, outline: 'none' }}
              />
            </div>

            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 12, outline: 'none' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 12, outline: 'none' }}
            >
              <option value="ALL">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '24px 16px', flex: 1 }}>
        {/* TAB 1: KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'start' }}>
            {COLUMNS.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14, minHeight: 400 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }}></span>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{col.title}</h3>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>{colTasks.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {colTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => openEditModal(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onStatusChange={handleStatusChange}
                        onToggleSubtask={handleToggleSubtask}
                      />
                    ))}
                    {colTasks.length === 0 && (
                      <div style={{ padding: '24px 12px', textAlign: 'center', color: '#475569', fontSize: 12, fontStyle: 'italic', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8 }}>
                        No tasks in {col.title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: LIST VIEW */}
        {activeTab === 'list' && (
          <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 12 }}>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Task Title & Tags</th>
                  <th style={{ padding: '12px 16px' }}>Priority</th>
                  <th style={{ padding: '12px 16px' }}>Subtasks</th>
                  <th style={{ padding: '12px 16px' }}>Due Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const completedSubCount = (task.subtasks || []).filter(s => s.completed).length;
                  const totalSubCount = (task.subtasks || []).length;
                  return (
                    <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 11, outline: 'none' }}
                        >
                          {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>{task.title}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(task.tags || []).map(t => (
                            <span key={t} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>#{t}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={PRIORITIES.find(p => p.id === task.priority)?.color} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                          {task.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                        {totalSubCount > 0 ? `${completedSubCount}/${totalSubCount} Done` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                        {task.dueDate || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button onClick={() => openEditModal(task)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', marginRight: 10 }} title="Edit"><Edit3 style={{ width: 15, height: 15 }} /></button>
                        <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Delete"><Trash2 style={{ width: 15, height: 15 }} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: EISENHOWER PRIORITY MATRIX */}
        {activeTab === 'matrix' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { id: 'urgent-high', title: 'Quadrant 1: Urgent & Important (Do First)', priorityMatch: ['urgent', 'high'], color: '#f43f5e', bg: 'rgba(244,63,94,0.05)' },
              { id: 'noturgent-high', title: 'Quadrant 2: Not Urgent & Important (Schedule)', priorityMatch: ['medium'], color: '#6366f1', bg: 'rgba(99,102,241,0.05)' },
              { id: 'urgent-low', title: 'Quadrant 3: Urgent & Low Priority (Delegate)', priorityMatch: ['low'], color: '#f59e0b', bg: 'rgba(245,158,11,0.05)' },
              { id: 'noturgent-low', title: 'Quadrant 4: Backlog / Minimal Impact (Eliminate)', priorityMatch: [], isBacklog: true, color: '#64748b', bg: 'rgba(100,116,139,0.05)' }
            ].map(quad => {
              const quadTasks = filteredTasks.filter(t =>
                quad.isBacklog ? t.status === 'backlog' : quad.priorityMatch.includes(t.priority) && t.status !== 'backlog' && t.status !== 'done'
              );
              return (
                <div key={quad.id} style={{ background: quad.bg, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: quad.color }}>{quad.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>{quadTasks.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {quadTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => openEditModal(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onStatusChange={handleStatusChange}
                        onToggleSubtask={handleToggleSubtask}
                      />
                    ))}
                    {quadTasks.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: 12 }}>No items in this quadrant.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: PRODUCTIVITY ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { title: 'Total Tasks Active', value: analytics.total, icon: ListTodo, color: '#38bdf8' },
                { title: 'Completion Rate', value: `${analytics.completionRate}%`, icon: CheckCircle2, color: '#34d399' },
                { title: 'Subtask Checklist Done', value: `${analytics.subtasksStats.percentage}%`, icon: Zap, color: '#a78bfa' },
                { title: 'Total Est. Effort', value: `${analytics.totalEstimatedHours} hrs`, icon: Clock, color: '#fbbf24' }
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="glass-panel" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{kpi.title}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{kpi.value}</div>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ color: kpi.color, width: 22, height: 22 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Breakdown & Priority Graph */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Status Pipeline Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(analytics.statusCounts).map(([status, count]) => {
                    const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                    return (
                      <div key={status}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ textTransform: 'capitalize', color: '#cbd5e1' }}>{status.replace('_', ' ')}</span>
                          <span style={{ color: '#94a3b8' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 4 }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Priority Distribution Matrix</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(analytics.priorityDistribution).map(([prio, count]) => {
                    const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                    const colors = { urgent: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#10b981' };
                    return (
                      <div key={prio}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 700, color: colors[prio] }}>{prio}</span>
                          <span style={{ color: '#94a3b8' }}>{count} items</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: colors[prio], borderRadius: 4 }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div className="glass-panel" style={{ maxWidth: 580, width: '100%', padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                {editingTask ? 'Edit Task Specification' : 'Create New Dynamic Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Transformer Attention Cache"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide technical context, constraints, and deliverables..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Pipeline Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                  >
                    <option value="urgent">Urgent (P0)</option>
                    <option value="high">High (P1)</option>
                    <option value="medium">Medium (P2)</option>
                    <option value="low">Low (P3)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Est. Effort (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={formEstimatedMinutes}
                    onChange={e => setFormEstimatedMinutes(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Architecture, PyTorch, SFT"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>

              {/* Subtasks Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Subtask Checklist</label>
                  <button
                    type="button"
                    onClick={() => setFormSubtasks([...formSubtasks, { id: `st-${Date.now()}`, title: '', completed: false }])}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus style={{ width: 13, height: 13 }} /> Add Subtask
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {formSubtasks.map((st, idx) => (
                    <div key={st.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="text"
                        placeholder={`Subtask #${idx + 1}`}
                        value={st.title}
                        onChange={e => {
                          const updated = [...formSubtasks];
                          updated[idx].title = e.target.value;
                          setFormSubtasks(updated);
                        }}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 12, outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormSubtasks(formSubtasks.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Task Card
function TaskCard({ task, onEdit, onDelete, onStatusChange, onToggleSubtask }) {
  const completedSubCount = (task.subtasks || []).filter(s => s.completed).length;
  const totalSubCount = (task.subtasks || []).length;
  const subPercent = totalSubCount > 0 ? Math.round((completedSubCount / totalSubCount) * 100) : 0;

  return (
    <div className="glass-card" style={{ padding: 14 }}>
      {/* Header Badge Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className={PRIORITIES.find(p => p.id === task.priority)?.color} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
          {task.priority}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }} title="Edit"><Edit3 style={{ width: 13, height: 13 }} /></button>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Delete"><Trash2 style={{ width: 13, height: 13 }} /></button>
        </div>
      </div>

      {/* Title & Description */}
      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 6, lineHeight: 1.4 }}>{task.title}</h4>
      {task.description && (
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      {/* Subtasks Progress */}
      {totalSubCount > 0 && (
        <div style={{ marginBottom: 10, padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
            <span>Subtasks</span>
            <span style={{ fontWeight: 600, color: subPercent === 100 ? '#34d399' : '#cbd5e1' }}>{completedSubCount}/{totalSubCount} ({subPercent}%)</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: `${subPercent}%`, height: '100%', background: subPercent === 100 ? '#10b981' : '#6366f1' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {task.subtasks.map(st => (
              <div
                key={st.id}
                onClick={() => onToggleSubtask(task, st.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: st.completed ? '#64748b' : '#cbd5e1', cursor: 'pointer', textDecoration: st.completed ? 'line-through' : 'none' }}
              >
                {st.completed ? (
                  <CheckCircle2 style={{ width: 13, height: 13, color: '#10b981', flexShrink: 0 }} />
                ) : (
                  <Circle style={{ width: 13, height: 13, color: '#64748b', flexShrink: 0 }} />
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {task.tags.map(t => (
            <span key={t} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>#{t}</span>
          ))}
        </div>
      )}

      {/* Footer Info & Quick Shift */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, fontSize: 11, color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar style={{ width: 12, height: 12 }} />
          <span>{task.dueDate ? task.dueDate : 'No date'}</span>
        </div>

        {/* Quick Shift Button to next column */}
        {task.status !== 'done' && (
          <button
            onClick={() => {
              const currentIdx = COLUMNS.findIndex(c => c.id === task.status);
              if (currentIdx < COLUMNS.length - 1) {
                onStatusChange(task.id, COLUMNS[currentIdx + 1].id);
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', color: '#818cf8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            <span>Advance</span>
            <ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        )}
      </div>
    </div>
  );
}
