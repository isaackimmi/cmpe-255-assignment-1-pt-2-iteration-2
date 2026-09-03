#!/usr/bin/env bash

# One-line execution script for all projects in this repository
# Usage: ./run_demo.sh <project_number_or_name>
# Examples:
#   ./run_demo.sh 0
#   ./run_demo.sh 1
#   ./run_demo.sh 02_nano_llm_transformer

set -e

PROJECT=$1
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Resolve Python binary
if [ -f "$ROOT_DIR/.venv/bin/python" ]; then
  PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
elif command -v python3 &>/dev/null; then
  PYTHON_BIN="$(command -v python3)"
else
  PYTHON_BIN="python"
fi

if [ -z "$PROJECT" ]; then
  echo "================================================================="
  echo "🌟 Enterprise Data Science & ML Portfolio - Demo Runner"
  echo "================================================================="
  echo "Usage: ./run_demo.sh <project_id>"
  echo ""
  echo "Available Projects:"
  echo "  0 | 00_dynamic_todo_workspace              (Ports: Backend 5000 / Frontend 5173)"
  echo "  1 | 01_nyc_taxi_trip_prediction            (Ports: Backend 8000 / Frontend 5174)"
  echo "  2 | 02_nano_llm_transformer                (Ports: Backend 8002 / Frontend 5175)"
  echo "  3 | 03_customer_segmentation_clustering    (Ports: Backend 8003 / Frontend 5176)"
  echo "  4 | 04_associative_pattern_mining          (Ports: Backend 8004 / Frontend 5177)"
  echo "  5 | 05_data_science_skills_lab             (Ports: Backend 8005 / Frontend 5178)"
  echo "================================================================="
  exit 1
fi

cleanup() {
  echo ""
  echo "🛑 Shutting down demo processes..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

case "$PROJECT" in
  0|"00"|"00_dynamic_todo_workspace"|"todo")
    DIR="$ROOT_DIR/00_dynamic_todo_workspace"
    echo "🚀 Starting Project 0: Zenith Dynamic Task Workspace..."
    echo "📦 Ensuring dependencies..."
    cd "$DIR/server" && npm install --silent
    cd "$DIR/client" && npm install --silent
    echo "⚡ Launching Backend (Port 5000)..."
    cd "$DIR/server" && npm run dev &
    sleep 2
    echo "⚡ Launching Frontend (Port 5173)..."
    cd "$DIR/client" && npm run dev &
    echo "✅ Project 0 running! Open: http://localhost:5173"
    wait
    ;;

  1|"01"|"01_nyc_taxi_trip_prediction"|"taxi")
    DIR="$ROOT_DIR/01_nyc_taxi_trip_prediction"
    echo "🚀 Starting Project 1: NYC Taxi Trip Duration Predictor..."
    echo "📦 Ensuring dependencies..."
    cd "$DIR/frontend" && npm install --silent
    echo "⚡ Launching Backend (Port 8000)..."
    cd "$DIR/backend" && "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port 8000 &
    sleep 2
    echo "⚡ Launching Frontend (Port 5174)..."
    cd "$DIR/frontend" && npm run dev &
    echo "✅ Project 1 running! Open: http://localhost:5174"
    wait
    ;;

  2|"02"|"02_nano_llm_transformer"|"llm")
    DIR="$ROOT_DIR/02_nano_llm_transformer"
    echo "🚀 Starting Project 2: NanoLlama SFT LLM Studio..."
    echo "📦 Ensuring dependencies..."
    cd "$DIR/frontend" && npm install --silent
    echo "⚡ Launching Backend (Port 8002)..."
    cd "$DIR/backend" && "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port 8002 &
    sleep 2
    echo "⚡ Launching Frontend (Port 5175)..."
    cd "$DIR/frontend" && npm run dev &
    echo "✅ Project 2 running! Open: http://localhost:5175"
    wait
    ;;

  3|"03"|"03_customer_segmentation_clustering"|"clustering")
    DIR="$ROOT_DIR/03_customer_segmentation_clustering"
    echo "🚀 Starting Project 3: Customer Intelligence Clustering..."
    echo "📦 Ensuring dependencies..."
    cd "$DIR/frontend" && npm install --silent
    echo "⚡ Launching Backend (Port 8003)..."
    cd "$DIR/backend" && "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port 8003 &
    sleep 2
    echo "⚡ Launching Frontend (Port 5176)..."
    cd "$DIR/frontend" && npm run dev &
    echo "✅ Project 3 running! Open: http://localhost:5176"
    wait
    ;;

  4|"04"|"04_associative_pattern_mining"|"basket")
    DIR="$ROOT_DIR/04_associative_pattern_mining"
    echo "🚀 Starting Project 4: Market Basket Pattern Mining..."
    echo "📦 Ensuring dependencies..."
    cd "$DIR/frontend" && npm install --silent
    echo "⚡ Launching Backend (Port 8004)..."
    cd "$DIR/backend" && "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port 8004 &
    sleep 2
    echo "⚡ Launching Frontend (Port 5177)..."
    cd "$DIR/frontend" && npm run dev &
    echo "✅ Project 4 running! Open: http://localhost:5177"
    wait
    ;;

  5|"05"|"05_data_science_skills_lab"|"skills")
    DIR="$ROOT_DIR/05_data_science_skills_lab"
    echo "🚀 Starting Project 5: Data Science Skills Mastery Lab..."
    echo "📦 Ensuring dependencies..."
    cd "$DIR/frontend" && npm install --silent
    echo "⚡ Launching Backend (Port 8005)..."
    cd "$DIR/backend" && "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port 8005 &
    sleep 2
    echo "⚡ Launching Frontend (Port 5178)..."
    cd "$DIR/frontend" && npm run dev &
    echo "✅ Project 5 running! Open: http://localhost:5178"
    wait
    ;;

  *)
    echo "❌ Unknown project: $PROJECT"
    echo "Please specify a project number from 0 to 5."
    exit 1
    ;;
esac
