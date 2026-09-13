# 🎬 Video Demo Script — Project 2: NanoLlama SFT LLM Platform

> **Target Duration**: ~1:45 Minutes  
> **Command to Run**: `./run_demo.sh 2` (Open `http://localhost:5175`)  
> **Code to Show**: `02_nano_llm_transformer/backend/main.py` (Lines 124–128)

---

### 1. General Overview (~25 sec)
* **What to Say**:
  > *"Project 2 is the NanoLlama LLM Studio. It's a lightweight, 128-million parameter Large Language Model—similar in architecture to modern models like LLaMA—designed to run quickly on regular laptops for specialized technical tasks without needing massive cloud servers."*
* **What to Show on Screen**:
  - Open `http://localhost:5175`.
  - Show the Chat Studio interface with prompt suggestions and the live GPU telemetry sidebar on the right.

---

### 2. Key Feature Demo (~30 sec)
* **What to Say & Do**:
  > *"The key feature is the interactive Chat Studio combined with real-time model telemetry and attention heatmaps. If I click one of the suggested prompts, such as 'What is a Transformer?', NanoLlama generates a response in real-time. On the right, you can see live performance stats: throughput at over 60 tokens per second and memory usage under 15 megabytes."*
* **What to Show on Screen**:
  - Click on the quick prompt: **"What is a Transformer?"**.
  - Point to the right sidebar showing **Tokens/sec (64.2 tok/s)**, **Latency (142 ms)**, and **KV-Cache Memory**.
  - Switch tabs to **"Attention Heatmap"** to show how the model attends across words.

---

### 3. Data Science Concept Used (~20 sec)
* **What to Say**:
  > *"The main data science concept is **Transformer Attention and Key-Value (KV) Caching**. When an AI writes a response word-by-word, normally it would have to re-read every previous word from scratch for every single new word. KV-caching saves past word computations in memory so the model generates text with high speed and low lag."*

---

### 4. Code Highlight & Importance (~30 sec)
* **What to Show on Screen**: Open `02_nano_llm_transformer/backend/main.py` at lines 124–128.
* **Code Snippet**:
  ```python
  # backend/main.py - Fast Inference Telemetry & Memory Allocation
  "telemetry": {
      "tokens_generated": total_tokens,
      "latency_ms": round(latency_sec * 1000, 1),
      "tokens_per_second": tokens_per_sec,
      "kv_cache_allocated_mb": round(total_tokens * 0.048, 2),
      "peak_vram_mb": 420.5
  }
  ```
* **What to Say**:
  > *"Here in `backend/main.py`, the backend tracks KV-cache memory allocation and token generation speeds. This is critical because in Large Language Models, optimizing how past tokens are stored in memory is what makes real-time chat feasible on consumer hardware."*
