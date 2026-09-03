# Implementation Plan - Project 2: NanoLlama Autoregressive SFT LLM Platform

## 1. Executive Summary & Objective
NanoLlama is a compact, high-efficiency autoregressive Transformer model incorporating state-of-the-art primitives (Rotary Position Embeddings, SwiGLU activations, RMSNorm, KV Cache) trained for supervised instruction following (SFT) within laptop compute budgets. The platform features an interactive Chat Studio, token probability inspection, attention matrix visualizer, training telemetry, and CRISP-DM LLM governance.

## 2. Architecture & Mathematical Primitives
- **Rotary Position Embeddings (RoPE)**:
  $$\mathbf{R}_{\Theta, m}^d = \text{diag}\left(R_{\theta_1, m}, \dots, R_{\theta_{d/2}, m}\right)$$
- **SwiGLU Feed-Forward Networks**:
  $$\text{FFN}_{\text{SwiGLU}}(x) = \left(\text{swish}(x W_{\text{gate}}) \otimes x W_{\text{up}}\right) W_{\text{down}}$$
- **Root Mean Square Normalization (RMSNorm)**:
  $$\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d} \sum_{i=1}^d x_i^2 + \epsilon}} \odot \gamma$$
- **Autoregressive Generation with KV-Cache**:
  Caches $K_{1:t-1}$ and $V_{1:t-1}$ to reduce per-token inference complexity from $\mathcal{O}(T^2)$ to $\mathcal{O}(T)$.

## 3. Backend & API Specification (Port 8002)
- `POST /api/chat/generate` - Ingests user prompt, returns generated tokens, KV cache telemetry, speed (tokens/sec), and token logits
- `GET /api/architecture` - Returns full transformer config & parameter count breakdown
- `GET /api/training/loss-curves` - SFT loss and validation perplexity curves across 10,000 steps
- `GET /api/crispdm` - 6-phase LLM lifecycle methodology
- `GET /api/autoresearch/benchmarks` - Evaluation leaderboard (MMLU-tiny, GSM8k-nano, HumanEval-mini)

## 4. Frontend Interactive Studio (Port 5175)
- Live Chat Studio with interactive prompt presets and streaming generation
- Attention Heatmap & Logit Distribution inspector
- Real-time sampling parameter dials (Temperature, Top-P, Repetition Penalty)
- AutoResearch & CRISP-DM documentation viewer

## 5. Verification & Testing
- Token generation deterministic sanity test
- Latency check: $\ge 45$ tokens/sec on CPU
- Frontend build validation with zero errors
