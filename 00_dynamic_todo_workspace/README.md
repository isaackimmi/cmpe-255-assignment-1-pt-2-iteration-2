# Project 0: Zenith Dynamic Task Workspace

A modern, high-performance, dynamic task management workspace engineered with responsive UX, Kanban flow, Eisenhower priority matrix, subtask decomposition, live telemetry, and productivity analytics.

## Features
- **Kanban Board**: Drag/click transitions across Backlog, Todo, In Progress, Review, and Done.
- **Eisenhower Priority Matrix**: 2x2 matrix separating Urgent/Important quadrants for executive time management.
- **Subtask Breakdown**: Granular checklist tracking with live completion percentage bar.
- **Productivity Analytics**: Velocity metrics, completion time distribution, and tag aggregation.
- **Real-Time Telemetry**: Server-Sent Events (SSE) synchronization.

## Quick Start
```bash
# Backend (Port 5000)
cd server
npm install
npm run dev

# Frontend (Port 5173)
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
