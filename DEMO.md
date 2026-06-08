# Post-Quantum Secure Communication Platform: Deep Dive & Demo Guide

This document provides a comprehensive operational guide, an in-depth architectural catalog, and a deep-dive explanation of the mathematical and logical mechanisms powering the **AI-Driven Quantum-Safe Secure Communication Platform**.

---

## 1. How to Setup the Project

The platform consists of a **FastAPI backend** and a **Next.js React frontend**. You can deploy it locally via manual script execution or by orchestrating containers with Docker.

### Prerequisites
Before proceeding, ensure you have the following installed:
1. **Python 3.12+**
2. **Node.js 18+** & **npm**
3. **Ollama** (for local AI-driven threat analysis)
   - Download and install Ollama from [ollama.com](https://ollama.com).
   - Start the Ollama server, then pull the required model in your terminal:
     ```bash
     ollama pull llama3
     ```
     *(Note: The platform is built to dynamically fallback to high-fidelity rule-based models if Ollama is offline or the model is not found).*

---

### Option A: Manual Setup (Recommended for Development)

#### 1. Backend Configuration
The backend uses a local SQLite database and connects to Ollama on port `11434` by default.

1. Navigate to the root directory and create a virtual environment using `uv` (faster) or `venv`:
   ```bash
   # Using uv
   uv venv
   source .venv/bin/activate

   # Or using standard python venv
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the FastAPI server via Uvicorn (note that it runs on port **8001** to avoid conflict with default dev services):
   ```bash
   uvicorn backend.main:app --reload --port 8001
   ```
   *The Swagger interactive API documentation will be available at `http://localhost:8001/docs`.*

#### 2. Frontend Configuration
The frontend uses Next.js with React, Lucide icons, Tailwind-like vanilla CSS variables, and Recharts for live rendering.

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the secure command center dashboard:
   - URL: [http://localhost:3000](http://localhost:3000)

---

### Option B: Docker Compose Setup

For a zero-dependency setup (excluding Ollama, which should run on the host for GPU acceleration), you can spin up the system using the preconfigured `docker-compose.yml`:

```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API Docs**: `http://localhost:8001/docs`

---

## 2. In-Depth Component & File Guide

Below is a complete description of the system components and the role of each primary file:

```
├── backend/
│   ├── ai/
│   │   └── ollama_client.py   # AI client connection to Ollama LLM with rule fallback
│   ├── models/
│   │   └── database.py        # SQLite schemas for users, sessions, messages, threats
│   ├── routers/
│   │   ├── ai.py              # Endpoints for rotation predictions and threat evaluations
│   │   ├── auth.py            # User registration and token authentication
│   │   ├── benchmark.py       # Cryptographic performance evaluation triggers
│   │   ├── message.py         # Message encryption simulation and SQL saving
│   │   ├── metrics.py         # Top-level operational statistics
│   │   └── session.py         # Channel creation, handshakes, and KEM configuration
│   ├── simulation/
│   │   ├── anomaly_sim.py     # Generates synthetic attack logs for security validation
│   │   ├── benchmark_sim.py   # Synthesizes comparative baseline metrics
│   │   ├── crypto_sim.py      # Core timing simulator for X25519 and ML-KEM-768
│   │   └── network_sim.py     # Emulates latencies (Normal, WAN, Mobile, Adverse)
│   └── main.py                # FastAPI initialization & WebSocket broadcast coordinator
├── frontend/
│   ├── app/
│   │   ├── chat/              # Real-time encrypted WebSocket messaging interface
│   │   ├── dashboard/         # Command terminal monitoring active channels & security status
│   │   ├── experiment/        # Cyber Range Topology and thesis validation suite (PDF export)
│   │   ├── performance/       # Performance analytics visualizing X25519 vs ML-KEM vs Hybrid
│   │   ├── threats/           # Scrolling event log displaying AI threat analyzer outputs
│   │   ├── layout.tsx         # Next.js global frame layout
│   │   └── page.tsx           # Authentication gateway and landing screen
│   └── components/
│       └── Navbar.tsx         # Monospace header with current threat status feeds
```

### Component Analysis:

* **[backend/main.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/main.py)**: Spins up the FastAPI app. Implements a WebSocket `ConnectionManager` that handles room-based broadcasts at `/ws/{session_id}`. It is responsible for echoing client encrypted payloads to connected peers without decrypting them.
* **[backend/simulation/crypto_sim.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/simulation/crypto_sim.py)**: Simulates the execution steps and delays of X25519 and ML-KEM-768. Rather than compiling heavy native bindings, it uses real-world parameters (e.g. ML-KEM-768 key generation taking 13.2–18.7 ms) to ensure instantaneous cross-platform verification.
* **[backend/ai/ollama_client.py](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/backend/ai/ollama_client.py)**: Houses LLM prompts. Interrogates Ollama for key status classification (Safe, Rotate Soon, Immediate Rotation) and anomaly assessment. A local rule-based model computes heuristics if Ollama is unreachable.
* **[frontend/app/experiment/page.tsx](file:///home/tankaizokuo/Code/AI-Driven%20Quantum-Safe%20Secure%20Communication%20Platform/frontend/app/experiment/page.tsx)**: Emulates a virtual SOC (Security Operations Center). Allows researchers to simulate attacks (DDoS handshake floods, insider threats, brute force), trigger automated mitigations (key rotation, blocking IP addresses), and export printable PDF reports for thesis submission.

---

## 3. How It Works Under the Hood

The platform relies on a hybrid cryptographic pipeline, active AI threat mitigation, and real-time streaming sockets.

```
                  HYBRID KEY ENCAPSULATION MECHANISM (KEM)
                  
     [Client]                                               [Server]
        |                                                      |
        |--- 1. Generate X25519 Keypair (0.8 - 1.2 ms) -------->|
        |--- 2. Generate ML-KEM-768 Keypair (13.2 - 18.7 ms) -->|
        |                                                      |
        |                                              (Perform Encapsulation)
        |                                              (15.0 - 22.0 ms)
        |<-- 3. Return ML-KEM-768 Ciphertext ------------------|
        |                                                      |
 (Perform Decapsulation)                                       |
 (14.0 - 20.0 ms)                                              |
        |                                                      |
        +======== Combine Secrets via HKDF-SHA256 =============+
        |                  (0.2 - 0.5 ms)                      |
        v                                                      v
  [Shared Symmetric Key]                                 [Shared Symmetric Key]
```

### A. The Hybrid Cryptographic Pipeline
The core thesis concept is that **classical cryptography** (X25519) is combined with **post-quantum cryptography** (ML-KEM-768) in a dual-protection setup.

1. **X25519 Key Exchange (Classical)**:
   - Uses Elliptic Curve Diffie-Hellman (ECDH) over Curve25519.
   - Generates a 32-byte public key hex string in ~1 millisecond.
2. **ML-KEM-768 (NIST Post-Quantum Standard)**:
   - A lattice-based key encapsulation mechanism based on the hard problem of Module Learning with Errors (M-LWE).
   - Generates public keys (~800 bytes) and private keys (~2400 bytes) in ~15 milliseconds.
   - The server performs **Encapsulation** against the client's public key, generating a ciphertext payload.
   - The client performs **Decapsulation** using its private key to extract the raw secret.
3. **HKDF Shared Secret Derivation**:
   - Both the X25519 secret ($S_{ECC}$) and the ML-KEM-768 secret ($S_{PQC}$) are concatenated.
   - They are passed through a **Hash-based Key Derivation Function (HKDF-SHA256)**:
     $$\text{Key} = \text{HKDF-Extract-and-Expand}(\text{Salt}, S_{ECC} \mathbin{\Vert} S_{PQC}, \text{Info}, 32 \text{ bytes})$$
   - This ensures that if *either* scheme is compromised, the final symmetric key remains secure.
4. **Symmetric Encrypted Communication**:
   - Messages are encrypted client-side using **AES-256-GCM**.
   - Output includes: `ciphertext`, a 12-byte initialization vector (`iv`), and a 16-byte authentication `tag`.

---

### B. Real-Time WebSocket Channel Sync
- When two operators connect to a room, Next.js establishes a persistent duplex WebSocket connection to `/ws/{session_id}`.
- Every message typed is immediately encrypted in the browser, showing the raw encryption lifecycle (Plaintext $\to$ GCM Encryption $\to$ JSON Ciphertext Payload).
- The server acts as a relay node, distributing the encrypted payload. Receiving clients verify the integrity using the GCM authentication tag before decoding.

---

### C. AI-Driven Threat Detection & Key Rotation Heuristics
A major feature of the system is the integration of local LLMs for network defense:

* **Log Window Streaming**: The system monitors failed handshake attempts, network latency fluctuations, and failed login markers.
* **AI Analysis Prompting**:
  - The model parses the data window and identifies indicators (e.g. a burst of handshakes represents a **DDoS Handshake Flood**; multiple wrong passwords represent a **Brute Force Login**).
  - It outputs a structured JSON recommendation (e.g., `ROTATE_KEY` or `TERMINATE_SESSION`).
* **Active Defense Loop**:
  - If a threat score exceeds **0.8 (Critical)**, the system simulates session termination.
  - If the score is **0.5–0.8 (High)**, the system rotates session keys by triggering a fresh hybrid handshake.
  - When Ollama is offline, a local fallback evaluator uses statistical thresholds to compute equivalent threat metrics and returns formatted data instantly.
