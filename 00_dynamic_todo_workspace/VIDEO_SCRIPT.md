# 🎬 Video Demo Script — Project 0: Zenith Dynamic Task Workspace

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 0` (Open `http://localhost:5173`)  
> **Code to Show**: `00_dynamic_todo_workspace/server/index.js` (Lines 181–222)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 0 is the Zenith Dynamic Task Workspace. It's a full-stack project and task management dashboard designed to organize workflows. Think of it like a smart Kanban board with automated priority sorting, subtask checklists, and real-time live synchronization so teams stay aligned without needing to refresh their browser."*
* **What to Show on Screen**:
  - Open `http://localhost:5173`.
  - Point out the dark board layout, column headers (`To Do`, `In Progress`, `Done`), and the glowing green **SSE Live Stream** indicator in the top header.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"A key feature of this project is the automated Eisenhower Priority Matrix and real-time task pipeline. When I click '+ Create Task', add a task like 'Build ML Pipeline', assign it 'Urgent' priority, and add two subtasks, it immediately appears on the board. When I check off a subtask, the progress bar updates live, and I can advance it across columns into 'Done'."*
* **What to Show on Screen**:
  - Click **"+ Create Task"**, type `Build ML Pipeline`, choose `Urgent (P0)`, add a couple of subtasks, and submit.
  - Check off a subtask to show the progress bar fill up.
  - Click the **"Priority Matrix"** tab to show tasks auto-sorted into the *Urgent & Important (Do First)* quadrant.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The main data science concept here is **Descriptive Analytics and Data Aggregation**. Rather than just storing raw task records, the system continuously aggregates task statuses, calculates completion rates, and breaks down workload by priority tiers to provide immediate productivity metrics."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `00_dynamic_todo_workspace/server/index.js` around line 181.
* **Code Snippet**:
  ```javascript
  // server/index.js - Descriptive Analytics & Aggregation Engine
  app.get('/api/analytics', (req, res) => {
    const tasks = readTasks();
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    const priorityDistribution = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
    ...
  });
  ```
* **What to Say**:
  > *"Here in `server/index.js`, this `/api/analytics` endpoint processes all active tasks. It calculates the team's overall completion percentage and tallies up the priority distribution. This code is essential because it turns raw database records into clear summary metrics that feed the visual telemetry dashboard."*
