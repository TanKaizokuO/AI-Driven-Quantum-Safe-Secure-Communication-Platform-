# AI-Driven Quantum-Safe Secure Communication Platform (Thesis Simulation Mode)

This document provides an in-depth explanation of the **AI-Driven Quantum-Safe Secure Communication Platform**, highlighting its architectural design, cryptographic primitives, AI integration, and simulation boundaries.

---

## 1. Project Overview & Motivation

With the advent of quantum computing, traditional public-key cryptography (e.g., RSA, ECC) is vulnerable to Shor's algorithm, which can solve integer factorization and discrete logarithms in polynomial time. This threat has prompted the development of **Post-Quantum Cryptography (PQC)**.

To mitigate transition risks (such as bugs or design flaws in newly standardized algorithms) and protect against **Store-Now-Decrypt-Later (SNDL)** attacks, this project showcases a **Hybrid Key Encapsulation Mechanism (KEM)**. 

By combining classical Elliptic Curve Cryptography (**X25519**) with the NIST-standardized post-quantum lattice-based KEM (**ML-KEM-768**), the platform guarantees that security holds if *either* of the underlying schemes remains secure.

Additionally, the platform incorporates an **AI-driven Key Management & Threat Detection engine**, simulating active threat monitoring, anomaly scoring, and automated key rotation recommendations.

---

## 2. System Architecture

The platform follows a classic microservice architecture optimized for real-time visualization and simulation control:

```
                    +------------------------------+
                    |       React/Next.js UI       |
                    |      (Port 3000 Front)       |
                    +--------------+---------------+
                                   |
             REST APIs & WebSockets| (Real-time Encrypted Chat)
                                   v
                    +------------------------------+
                    |       FastAPI Backend        |
                    |      (Port 8001 Engine)      |
                    +-------+--------------+-------+
                            |              |
                    SQLite  |              | Ollama AI Agent API
              (quantum_comm)|              | (Port 11434, llama3)
                            v              v
                    +---------------+      +---------------+
                    | SQLite DB Local|     |  Ollama Core  |
                    | (quantum_comm)|      | (Local LLM)   |
                    +---------------+      +---------------+
```

### Component Breakdown:
1. **Frontend (React/Next.js)**: A futuristic cybersecurity dashboard styled with dark themes, monospace typography, neon accents, and interactive visualizations. It uses **Recharts** for performance plots and SVG streams for cryptographic handshakes.
2. **Backend (FastAPI)**: A Python web framework that coordinates simulation routines, manages SQLite state, handles real-time WebSocket communication, and orchestrates calls to the AI subsystem.
3. **AI Core (Ollama)**: Integrates a local Large Language Model (like `llama3` or `mistral`) to analyze logs and key aging metrics. A robust rule-based model serves as an automated fallback if Ollama is unavailable.
4. **Database (SQLite)**: A zero-config local relational database (via SQLAlchemy) to persist logs, metrics, user credentials, and simulation benchmark runs.

---

## 3. Cryptographic Core & Simulation Philosophy

This platform operates in **Thesis Simulation Mode**. To facilitate instant deployment across diverse reviewer environments without compiler dependencies (such as building `liboqs` or binding native C libraries), the cryptographic execution times and resulting public/private keys are dynamically simulated. 

The simulated parameters are tightly bound to real-world benchmarks:

### A. Hybrid KEM Pipeline
1. **X25519 Key Generation**: Simulates key generation taking ~0.8 to 1.2 ms, outputting a 32-byte public key hex string.
2. **ML-KEM-768 Key Generation**: Simulates key generation taking ~13.2 to 18.7 ms, outputting public key (800 bytes) and private key (2400 bytes) hex structures.
3. **ML-KEM Encapsulation**: Simulates client-side encapsulation (~15.0 to 22.0 ms) outputting the ciphertext payload.
4. **ML-KEM Decapsulation**: Simulates server-side decapsulation (~14.0 to 20.0 ms).
5. **Shared Secret Derivation**: Leverages HKDF-SHA256 to combine both classical X25519 and PQC ML-KEM secrets into a single 256-bit symmetric key.

### B. Encrypted Chat Simulation
When messages are sent over the WebSocket channel:
- Plaintext is encrypted client-side using simulated **AES-256-GCM**.
- The frontend shows the generated `ciphertext`, initialization vector (`iv`), and authentication `tag`.
- The backend broadcasts the payload, and receiving clients decode and verify the authenticity tag before decrypting.

---

## 4. AI Key Management & Anomaly Detection

The AI subsystem consists of two operational endpoints connected to Ollama:

### 1. Key Rotation Prediction (`/ai/predict-rotation`)
Analyzes variables such as key age (days), session count, and failed logins. The LLM classifies the key status:
- **`Safe`**: Low utilization and recent generation.
- **`Rotate Soon`**: Moderate age or volume.
- **`Immediate Rotation`**: Threshold breach or security indicators.

### 2. Threat & Anomaly Assessment (`/ai/analyze-threat`)
Consumes streaming network log feeds. The AI agent analyzes log windows containing failed attempts and handshake counts, returning a structured JSON response:
- `threat_score` (float 0.0 - 1.0)
- `severity` (LOW, MEDIUM, HIGH, CRITICAL)
- `anomaly_type` (e.g., Brute Force, DDoS, Session Hijacking)
- `action` (MONITOR, ROTATE_KEY, TERMINATE_SESSION)
- `reasoning` (LLM-synthesized context explanation)

---

## 5. Directory & File Structure Details

### Backend
- **[main.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/main.py)**: Configures the FastAPI app, manages CORS, handles WebSocket sessions, and exposes websocket endpoints at `/ws/{session_id}`.
- **`backend/routers/`**:
  - **[auth.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/routers/auth.py)**: Facilitates secure operator registration and login using simulated JWT tokens.
  - **[session.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/routers/session.py)**: Creates and coordinates secure communication sessions with simulated hybrid handshakes.
  - **[ai.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/routers/ai.py)**: Exposes endpoints for AI assessments and persists threat outcomes to the SQLite database.
  - **[benchmark.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/routers/benchmark.py)**: Coordinates benchmarking suites across different cryptographic configurations and network profiles.
- **`backend/simulation/`**:
  - **[crypto_sim.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/simulation/crypto_sim.py)**: The timing and key simulation routines for X25519 and ML-KEM-768.
  - **[network_sim.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/simulation/network_sim.py)**: Simulates packet latencies for Normal, WAN, Mobile, and Adverse profiles.
  - **[anomaly_sim.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/simulation/anomaly_sim.py)**: Generates synthetic log signatures representing brute force or flooding anomalies.
- **`backend/ai/`**:
  - **[ollama_client.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/ai/ollama_client.py)**: The interface to the local LLM. Contains fallback rules to keep the app operational if Ollama is offline.
- **`backend/models/`**:
  - **[database.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/models/database.py)**: Defines the SQLAlchemy schema mapping users, sessions, messages, threat logs, and benchmarks.

### Frontend
- **`frontend/app/`**:
  - **[page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/page.tsx)**: The secure terminal landing portal and login system.
  - **[dashboard/page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/dashboard/page.tsx)**: Displays the active system status, cryptographic configurations, and current threat levels.
  - **[chat/page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/chat/page.tsx)**: The real-time chat chamber with client-side encryption step visualization.
  - **[performance/page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/performance/page.tsx)**: Visualizes cryptographic benchmarks (X25519 vs ML-KEM vs Hybrid) using Recharts.
  - **[threats/page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/threats/page.tsx)**: The scrolling live feed of anomalies and AI analysis.
  - **[experiment/page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/experiment/page.tsx)**: A scripted simulation page mapping the 12 key lifecycle steps of a large-scale communication node network, generating a downloadable thesis-grade PDF report.

---

## 6. Database Schema Summary

The SQLite database (`quantum_comm.db`) consists of six tables:
- **`users`**: Manages credential records for active operators.
- **`sessions`**: Tracks session parameters (shared secrets, network profile, status, timestamp).
- **`messages`**: Persists simulated encrypted WebSocket communications (IV, tags, ciphertext).
- **`crypto_metrics`**: Records latency logs of simulated cryptographic processes.
- **`threat_logs`**: Logs anomaly logs, severity metrics, and AI actions.
- **`benchmark_results`**: Caches compiled benchmarking records for Recharts representation.
