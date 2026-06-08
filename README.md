# AI-Driven Quantum-Safe Secure Communication Platform

A research demonstration showcasing a hybrid quantum-safe Secure Key Encapsulation Mechanism (KEM) communication platform. The system combines classical elliptic curve cryptography (**X25519**) with post-quantum lattice cryptography (**ML-KEM-768**) to secure transmission channels, utilizing real-time WebSockets and an **AI-driven Key Management & Threat Detection engine** running on local LLMs.

---

## 🚀 Quick Start & Setup

For a deep dive into the implementation, inner workings, and complete catalog, please refer to the detailed [DEMO.md](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/DEMO.md) guide.

### Prerequisites
- **Python 3.12+**
- **Node.js 18+** & **npm**
- **Ollama** installed on the host machine (Run `ollama pull llama3` or `ollama pull mistral` to download local models).

### Option A: Manual Setup

1. **FastAPI Backend**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   uvicorn backend.main:app --reload --port 8001
   ```
   *Backend Swagger Docs: `http://localhost:8001/docs`*

2. **Next.js Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend Dashboard: `http://localhost:3000`*

### Option B: Docker Compose
```bash
docker-compose up --build
```

---

## 🛠️ Architecture & System Structure

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

### Component Overview
- **`backend/`**: Built on FastAPI. Manages REST endpoints, SQLite databases, and establishes WebSocket connections at `/ws/{session_id}`.
- **`backend/simulation/`**: Houses simulation wrappers for hybrid handshakes (`crypto_sim.py`), network profiles (`network_sim.py`), and anomalies (`anomaly_sim.py`).
- **`backend/ai/`**: Links backend anomalies and metrics to local Ollama LLMs with high-fidelity rules as fallbacks.
- **`frontend/`**: Interactive dashboard presenting cryptographic benchmarks, real-time message encryption telemetry, and an interactive Cyber Range Topology simulator (`app/experiment`).

---

## 🔒 Cryptographic Mechanics (Under the Hood)

The platform secures channels using a **Hybrid Key Encapsulation Mechanism**:

1. **Dual Key Generation**: Key pairs are generated for both classical **X25519** and post-quantum **ML-KEM-768** algorithms.
2. **Key Encapsulation / Decapsulation**: Client and server exchange and decapsulate public parameters to extract raw secrets.
3. **HKDF Derivation**: Secrets are combined using **HKDF-SHA256** to derive a 256-bit symmetric session key.
4. **Symmetric Encryption**: Individual chat messages are encrypted client-side using **AES-256-GCM**, transmitting the ciphertext along with `iv` and authentication `tag` markers.

For detailed sequence diagrams, mathematical formulas, and simulation thresholds, view [DEMO.md](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/DEMO.md).
