# AI-Driven Quantum-Safe Secure Communication Platform (Thesis Simulation Mode)

A research demonstration showcasing a hybrid quantum-safe Key Encapsulation Mechanism (KEM) secure communication platform. The system combines classical elliptic curve cryptography (X25519) with post-quantum lattice cryptography (ML-KEM-768) to protect channels, with AI-driven threat analysis and active rotation protocols.

## Architecture Overview

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
                   |      (Port 8000 Engine)      |
                   +-------+--------------+-------+
                           |              |
                   SQLite  |              | Ollama AI Agent API
             (quantum_comm)|              | (Port 11434, llama3)
                           v              v
                   +---------------+      +---------------+
                   | SQLite DB Local|     |  Ollama Core  |
                   +---------------+      +---------------+
```

## Prerequisites

1. **Python 3.12+**
2. **Node.js 18+** & **npm**
3. **Ollama** installed on host machine (auto-fallback to rule-based model if offline).
   - Pull the model: `ollama pull llama3` or `ollama pull mistral`

## Setup & Running

### Option A: Using Docker Compose
Simply run:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

### Option B: Manual Development Setup

1. **Backend**:
   ```bash
   uv venv
   source .venv/bin/activate
   uv pip install -r backend/requirements.txt
   uvicorn backend.main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000`

## Demonstration Walkthrough

1. **Register/Login**: Access the secure operations terminal credentials.
2. **Hybrid KEM Handshake**: Create a channel to observe the step-by-step key encapsulation animation, showing individual times and output public/private key hex strings.
3. **Encrypted Chat**: Send messages over WebSockets to inspect the instant client-side encryption and GCM cipher tags.
4. **Benchmarking**: Run comparison suites showing latency results across multiple network profiles (Normal, WAN, Mobile, Adverse) rendered in Recharts.
5. **Research Runner**: Run the scripted simulation execution sequence to compile final performance scores for thesis verification, including downloading a browser-printable PDF report.

## Non-Goals & Simulation Boundaries
- **No real liboqs**: Cryptographic operations, key generation times, and resulting hex strings are fully simulated using real-world performance baseline bounds to ensure ease of deployment.
- **SQLite Database**: Designed to be lightweight and zero-config.
- **Local LLM**: Integrated via Ollama HTTP API with robust rule-based local fail-safes.
