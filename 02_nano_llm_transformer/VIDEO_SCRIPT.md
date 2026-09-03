# 🎬 Video Demo Script — Project 2: NanoLlama SFT LLM Platform

**Target Duration**: ~1:45 – 2:00 Minutes  
**Focus**: Transformer mathematical primitives (RoPE, SwiGLU, RMSNorm, KV-Cache), real-time chat generation, multi-head attention visualizer, and AutoResearch benchmarks.

---

## ⏱️ Timeline & Step-by-Step Walkthrough

### 1. Project Introduction & Purpose (0:00 – 0:25)
* **What to Say**:  
  *"Welcome to Project 02: The NanoLlama SFT LLM Platform. NanoLlama is a compact 128-million parameter autoregressive Transformer designed to deliver state-of-the-art LLM capabilities within laptop compute budgets. It features Rotary Position Embeddings (RoPE), SwiGLU activations, RMSNorm, and KV-Cache acceleration."*
* **What to Show on Screen**:  
  - Open `http://localhost:5175`.
  - Highlight the Chat Studio interface, prompt suggestions bar, and the **Live GPU / Inference Telemetry** panel on the right.

---

### 2. Core Transformer Mathematics & Logic (0:25 – 0:55)
* **What to Say**:  
  - **Rotary Position Embeddings (RoPE)**: *"RoPE encodes token position directly into query-key rotations, enabling the model to generalize across sequence lengths without positional lookup tables."*
  - **SwiGLU & RMSNorm**: *"We replace ReLU with SwiGLU gated linear units and replace standard LayerNorm with RMSNorm, achieving faster convergence with 7% less memory overhead."*
  - **KV-Caching Engine (`backend/main.py`)**: *"During autoregressive token generation, past keys and values are cached in GPU memory, reducing decoding time complexity from quadratic $\mathcal{O}(N^2)$ down to linear $\mathcal{O}(N)$."*

---

### 3. Step-by-Step Live User Flow (0:55 – 1:40)
* **Step 1: Real-Time Chat & Code Generation (0:55 – 1:15)**
  - Click on the quick prompt button: **"What are Rotary Position Embeddings (RoPE) and SwiGLU?"** (or type a custom question).
  - Show NanoLlama instantly generate the detailed mathematical breakdown, code snippet, and explanations.
  - Point to the right sidebar telemetry: Highlight **Throughput: 64.2 tok/s**, **Latency: 142 ms**, and **KV-Cache Allocated: 14.2 MB**.

* **Step 2: Sampling Dials & Architecture Inspection (1:15 – 1:25)**
  - Adjust the **Temperature** and **Top-P (Nucleus)** sliders on the right.
  - Switch tabs to **"Architecture & Specs"**: Show the exact parameter breakdown (128.4M params, 12 layers, 12 heads, 768 d_model).

* **Step 3: Multi-Head Attention Heatmap & Benchmarks (1:25 – 1:40)**
  - Switch tabs to **"Attention Heatmap"**: Toggle between Head 1, 2, 3, and 4 to demonstrate causal lower-triangular attention weights.
  - Switch tabs to **"Loss & Benchmarks"**: Show the validation perplexity curve dropping from 45.6 down to 4.09, and the AutoResearch table comparing NanoLlama against baseline transformers (+14.3% MMLU-tiny).

---

### 4. Closing & Takeaway (1:40 – 1:55)
* **What to Say**:  
  *"In summary, Project 2 demonstrates how modern architectural primitives and KV-caching make high-throughput, domain-specialized LLMs practical for lightweight deployment."*
