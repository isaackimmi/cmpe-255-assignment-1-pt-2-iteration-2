# Project 2: NanoLlama Autoregressive SFT LLM Platform

A compact, state-of-the-art Transformer language model engineered with modern LLM primitives: **Rotary Position Embeddings (RoPE)**, **SwiGLU feed-forward networks**, **RMSNorm**, and **KV-Cache acceleration**, accompanied by a live interactive Chat Studio, Attention visualizer, AutoResearch benchmark leaderboard, and CRISP-DM lifecycle dashboard.

## Features
- **Modern Transformer Architecture**: RoPE rotary positional encoding, SwiGLU gated activations, RMSNorm pre-normalization, and Multi-Head Attention.
- **Interactive Chat Studio**: Real-time response generation with live token metrics, generation speed (tokens/sec), and token probability distributions.
- **Attention Matrix Inspector**: Visual representation of multi-head causal attention weights.
- **AutoResearch Benchmarking**: Performance scores across MMLU-tiny, GSM8k-nano, HumanEval-mini, and Perplexity metrics.
- **CRISP-DM LLM Framework**: Full 6-phase engineering lifecycle documentation.

## Quick Start
```bash
# Backend (Port 8002)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8002

# Frontend (Port 5175)
cd frontend
npm install
npm run dev
```
Open `http://localhost:5175` in your browser.
