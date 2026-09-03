# 🎬 Video Demo Script — Project 0: Zenith Dynamic Task Workspace

**Target Duration**: ~1:45 – 2:00 Minutes  
**Focus**: Reactive full-stack architecture, dynamic task state machine, Eisenhower matrix, and real-time SSE telemetry.

---

## ⏱️ Timeline & Step-by-Step Walkthrough

### 1. Project Introduction & Purpose (0:00 – 0:25)
* **What to Say**:  
  *"Welcome to Project 00: Zenith Dynamic Task Workspace. This system is an enterprise-grade, reactive task management platform designed to eliminate cognitive overload and streamline team execution. It combines modern Kanban flow, Eisenhower priority quadrants, subtask decomposition, and live Server-Sent Events (SSE) telemetry."*
* **What to Show on Screen**:  
  - Show the main application view at `http://localhost:5173`.
  - Point out the dark glassmorphic header, active task counters, and the glowing green **SSE Live Stream** status indicator.

---

### 2. Core Architecture & Logic (0:25 – 0:55)
* **What to Say**:  
  - **Backend Logic (`server/index.js`)**: *"The backend is powered by Node.js and Express on port 5001. It maintains an event-driven architecture with `/api/events` broadcasting task state mutations to all connected clients in real-time, plus `/api/analytics` computing productivity velocity and priority distributions."*
  - **Frontend Logic (`client/src/App.jsx`)**: *"The frontend is built with React 18 and Vite. It maintains state synchronization through EventSource listeners, enabling instant optimistic UI updates without manual page refreshes."*
  - **Task State Machine**: *"Tasks follow a strict progression pipeline: `backlog` ➔ `todo` ➔ `in_progress` ➔ `review` ➔ `done` with subtask checklist completion percentages."*

---

### 3. Step-by-Step Live User Flow (0:55 – 1:40)
* **Step 1: Create a New Task (0:55 – 1:10)**
  - Click **"+ Create Task"**.
  - Fill in:
    - **Title**: `Deploy Multi-Head Attention Kernel`
    - **Status**: `In Progress`
    - **Priority**: `Urgent (P0)`
    - **Tags**: `PyTorch, CUDA, Inference`
    - **Subtasks**: Add `Allocate Continuous Buffer` and `Benchmark latency`.
  - Click **"Create Task"** and observe it instantly appear in the **In Progress** column with a glowing badge.

* **Step 2: Subtask Progress & Column Advance (1:10 – 1:25)**
  - On the newly created card, check off a subtask. Notice the progress bar fill to 50% in real-time.
  - Click **"Advance ➔"** to shift the card into the **In Review** column.

* **Step 3: Eisenhower Priority Matrix & Telemetry (1:25 – 1:40)**
  - Switch tabs to **"Priority Matrix"**: Demonstrate how P0/P1 tasks automatically populate the *Urgent & Important (Do First)* quadrant.
  - Switch tabs to **"Productivity Telemetry"**: Show the velocity metrics, status pipeline distribution bar charts, and estimated effort hours.

---

### 4. Closing & Takeaway (1:40 – 1:55)
* **What to Say**:  
  *"In summary, Project 0 demonstrates how full-stack reactive engineering, real-time telemetry streaming, and thoughtful UX can transform standard task tracking into a high-efficiency productivity workspace."*
