const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(cors());
app.use(express.json());

// Ensure data dir and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading tasks:', err);
    return [];
  }
}

function writeTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    broadcastEvent('tasks_updated', { count: tasks.length });
    return true;
  } catch (err) {
    console.error('Error writing tasks:', err);
    return false;
  }
}

// SSE Clients List
let sseClients = [];

function broadcastEvent(type, data) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (e) {
      // client disconnected
    }
  });
}

// SSE endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  let tasks = readTasks();
  const { status, priority, tag, search } = req.query;

  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }
  if (priority) {
    tasks = tasks.filter(t => t.priority === priority);
  }
  if (tag) {
    tasks = tasks.filter(t => t.tags && t.tags.includes(tag));
  }
  if (search) {
    const query = search.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query)) ||
      (t.tags && t.tags.some(tg => tg.toLowerCase().includes(query)))
    );
  }

  res.json({ success: true, count: tasks.length, data: tasks });
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.json({ success: true, data: task });
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const { title, description, status, priority, dueDate, tags, subtasks, estimatedMinutes } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    tags: Array.isArray(tags) ? tags : [],
    subtasks: Array.isArray(subtasks) ? subtasks.map((st, i) => ({
      id: st.id || `sub-${Date.now()}-${i}`,
      title: typeof st === 'string' ? st : st.title,
      completed: !!st.completed
    })) : [],
    estimatedMinutes: Number(estimatedMinutes) || 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  writeTasks(tasks);
  res.status(201).json({ success: true, data: newTask });
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const existing = tasks[index];
  const updated = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  if (req.body.status === 'done' && existing.status !== 'done') {
    updated.completedAt = new Date().toISOString();
  } else if (req.body.status && req.body.status !== 'done') {
    delete updated.completedAt;
  }

  tasks[index] = updated;
  writeTasks(tasks);
  res.json({ success: true, data: updated });
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const initialLen = tasks.length;
  tasks = tasks.filter(t => t.id !== req.params.id);
  if (tasks.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  writeTasks(tasks);
  res.json({ success: true, message: 'Task deleted successfully' });
});

// GET /api/analytics
app.get('/api/analytics', (req, res) => {
  const tasks = readTasks();
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const backlog = tasks.filter(t => t.status === 'backlog').length;
  const review = tasks.filter(t => t.status === 'review').length;

  const priorityDistribution = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

  const tagCounts = {};
  tasks.forEach(t => {
    (t.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const totalSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks ? t.subtasks.length : 0), 0);
  const completedSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks ? t.subtasks.filter(s => s.completed).length : 0), 0);

  res.json({
    success: true,
    data: {
      total,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      statusCounts: { backlog, todo, inProgress, review, done },
      priorityDistribution,
      tagCounts,
      subtasksStats: {
        total: totalSubtasks,
        completed: completedSubtasks,
        percentage: totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0
      },
      totalEstimatedHours: (tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0) / 60).toFixed(1)
    }
  });
});

app.listen(PORT, () => {
  console.log(`⚡ Zenith Task Workspace Server running on http://localhost:${PORT}`);
});
