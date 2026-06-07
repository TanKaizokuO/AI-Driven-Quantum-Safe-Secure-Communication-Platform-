# Agent Specification: AI-Driven Quantum-Safe Secure Communication Platform (Demo/Simulation Mode)

## Core Philosophy

**SIMULATION OVER IMPLEMENTATION.** This is a research demonstration platform, not a production system.
Every cryptographic, AI, and network operation should be VISUALLY CONVINCING but internally simulated
with realistic fake data, delays, and animations. The goal is to showcase the *concept* to thesis reviewers,
not to deploy real cryptography.

---

## Architecture Overview

### Backend: FastAPI (Python)
### Frontend: Next.js + TypeScript + TailwindCSS + ShadCN
### AI: Ollama (local LLM) via HTTP API at http://localhost:11434
### Database: SQLite (no Postgres/Redis needed — keep it simple)
### Monitoring: Simulated in-UI charts (no real Prometheus/Grafana)

---

## SIMULATION RULES (READ CAREFULLY)

Apply these rules everywhere:

### Rule 1: Fake Cryptographic Values
Never implement real cryptography. Use hardcoded/randomly generated hex strings.

```python
# Instead of: actual_key = mlkem768.keygen()
# Do this:
import secrets
import asyncio

async def simulate_keygen():
    await asyncio.sleep(0.8)  # Simulate computation time
    return {
        "public_key": secrets.token_hex(32),
        "private_key": secrets.token_hex(32),
        "algorithm": "ML-KEM-768",
        "keygen_time_ms": round(random.uniform(12.4, 18.9), 2)
    }
```

### Rule 2: Fake AI Analysis via Ollama
Use Ollama (llama3 or mistral) for all "AI" outputs. Send structured prompts, parse JSON responses.

```python
import httpx

async def ai_analyze_threat(session_data: dict) -> dict:
    prompt = f"""
You are a cryptographic security AI. Analyze this session and respond ONLY with valid JSON:
{{
  "threat_score": <float 0.0-1.0>,
  "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "anomaly_type": "<description>",
  "recommended_action": "<MONITOR|ROTATE_KEY|TERMINATE_SESSION>",
  "reasoning": "<one sentence>"
}}

Session data: {json.dumps(session_data)}
"""
    response = await httpx.AsyncClient().post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )
    return json.loads(response.json()["response"])
```

### Rule 3: Fake Network Simulation
Don't use `tc`/`netem`. Simulate delays in Python:

```python
NETWORK_PROFILES = {
    "normal":   {"latency_ms": 10,  "packet_loss": 0.0},
    "wan":      {"latency_ms": 100, "packet_loss": 0.01},
    "mobile":   {"latency_ms": 250, "packet_loss": 0.03},
    "adverse":  {"latency_ms": 500, "packet_loss": 0.05},
}

async def simulate_network(profile: str):
    p = NETWORK_PROFILES[profile]
    await asyncio.sleep(p["latency_ms"] / 1000)
    if random.random() < p["packet_loss"]:
        raise SimulatedPacketLoss()
```

### Rule 4: Frontend Visual Feedback
Every "slow" operation must show:
1. A multi-step loading animation with descriptive steps (e.g., "Generating ML-KEM-768 keypair...", "Performing X25519 handshake...", "Deriving hybrid shared secret via HKDF...")
2. Realistic timing (800ms–3s per step)
3. A final success state showing fake hex values and timing metrics

### Rule 5: Fake Benchmark Data
Pre-generate or randomly generate all benchmark numbers at runtime. Store in SQLite.

---

## Project Structure

```
quantum-comm-platform/
├── backend/
│   ├── main.py                    # FastAPI app entry
│   ├── routers/
│   │   ├── auth.py                # /register, /login
│   │   ├── session.py             # /session/create, /session/connect
│   │   ├── message.py             # /message/send (WebSocket)
│   │   ├── metrics.py             # /metrics
│   │   ├── ai.py                  # /ai/analyze, /ai/predict-rotation
│   │   └── benchmark.py          # /benchmark/run, /benchmark/results
│   ├── simulation/
│   │   ├── crypto_sim.py          # Fake KEM operations with delays
│   │   ├── network_sim.py         # Network profile simulator
│   │   ├── anomaly_sim.py         # Synthetic anomaly data generator
│   │   └── benchmark_sim.py      # Benchmark data generator
│   ├── ai/
│   │   └── ollama_client.py       # Ollama HTTP client for all AI calls
│   ├── models/
│   │   └── database.py            # SQLite via SQLAlchemy
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Landing/Login
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx     # Main hub
│   │   ├── chat/page.tsx          # Encrypted chat simulation
│   │   ├── performance/page.tsx   # Benchmark charts
│   │   ├── threats/page.tsx       # Anomaly/threat monitor
│   │   └── experiment/page.tsx   # One-click research demo
│   ├── components/
│   │   ├── KeygenAnimation.tsx    # Multi-step crypto operation UI
│   │   ├── ThreatFeed.tsx         # Live threat score feed
│   │   ├── MetricsChart.tsx       # Recharts-based charts
│   │   ├── NetworkSelector.tsx    # Network profile switcher
│   │   └── HandshakeVisualizer.tsx # Animated handshake flow diagram
│   └── lib/
│       ├── api.ts                 # Backend API client
│       └── websocket.ts           # WS connection manager
│
├── docker-compose.yml
└── README.md
```

---

## Module-by-Module Instructions

### Module 1: Hybrid KEM Engine (Simulated)

`backend/simulation/crypto_sim.py`:

```python
import asyncio, secrets, random, time

async def simulate_x25519_keygen():
    await asyncio.sleep(random.uniform(0.005, 0.012))
    return {"public_key": secrets.token_hex(32), "time_ms": round(random.uniform(0.8, 1.2), 3)}

async def simulate_mlkem768_keygen():
    await asyncio.sleep(random.uniform(0.012, 0.020))
    return {
        "public_key": secrets.token_hex(800),
        "private_key": secrets.token_hex(2400),
        "time_ms": round(random.uniform(13.2, 18.7), 3)
    }

async def simulate_hybrid_handshake(network_profile="normal"):
    network_delays = {"normal": 0.01, "wan": 0.1, "mobile": 0.25, "adverse": 0.5}
    steps = []
    
    t0 = time.time()
    x = await simulate_x25519_keygen()
    steps.append({"step": "X25519 KeyGen", "time_ms": x["time_ms"]})
    
    mlkem = await simulate_mlkem768_keygen()
    steps.append({"step": "ML-KEM-768 KeyGen", "time_ms": mlkem["time_ms"]})
    
    await asyncio.sleep(network_delays.get(network_profile, 0.01))
    encap_time = round(random.uniform(15.0, 22.0), 3)
    steps.append({"step": "ML-KEM-768 Encapsulation", "time_ms": encap_time})
    
    await asyncio.sleep(0.008)
    decap_time = round(random.uniform(14.0, 20.0), 3)
    steps.append({"step": "ML-KEM-768 Decapsulation", "time_ms": decap_time})
    
    hkdf_time = round(random.uniform(0.2, 0.5), 3)
    shared_secret = secrets.token_hex(32)
    steps.append({"step": "HKDF Shared Secret Derivation", "time_ms": hkdf_time})
    
    total = round((time.time() - t0) * 1000, 2)
    return {
        "shared_secret": shared_secret,
        "total_handshake_time_ms": total,
        "network_profile": network_profile,
        "steps": steps
    }
```

---

### Module 2: Backend API

Use FastAPI with WebSockets. Keep all state in-memory + SQLite.

**Key endpoints:**

```
POST /register             → Store user (SQLite), return JWT
POST /login                → Verify, return JWT
POST /session/create       → Simulate hybrid handshake, return session_id + crypto metrics
POST /session/connect      → Join session via session_id
POST /message/send         → Simulate AES-256-GCM encryption, store message
GET  /metrics              → Return all stored benchmark metrics
POST /ai/analyze-threat    → Send session data to Ollama, return threat JSON
POST /ai/predict-rotation  → Send key age/usage to Ollama, return rotation recommendation
POST /benchmark/run        → Run all 3 modes (X25519 / ML-KEM / Hybrid) across all 4 network profiles
GET  /benchmark/results    → Return stored benchmark table
WS   /ws/{session_id}      → Real-time encrypted chat
```

**Message encryption simulation:**

```python
async def simulate_encrypt_message(plaintext: str):
    await asyncio.sleep(random.uniform(0.001, 0.003))
    return {
        "ciphertext": secrets.token_hex(len(plaintext) + 16),
        "iv": secrets.token_hex(12),
        "tag": secrets.token_hex(16),
        "algorithm": "AES-256-GCM",
        "encrypt_time_ms": round(random.uniform(0.1, 0.4), 3)
    }
```

---

### Module 3: AI Key Management via Ollama

`backend/ai/ollama_client.py`:

Implement two functions:

**predict_key_rotation(key_data):**
Send key age, session count, traffic volume, failed logins, CPU/memory usage to Ollama.
Ask it to return JSON: `{"risk_level": "Safe|Rotate Soon|Immediate Rotation", "reason": "...", "confidence": 0.87}`

**analyze_anomaly(session_logs):**
Send last N log entries. Ask Ollama to return:
`{"threat_score": 0.0-1.0, "severity": "LOW|MEDIUM|HIGH|CRITICAL", "anomaly_type": "...", "action": "MONITOR|ROTATE_KEY|TERMINATE_SESSION", "reasoning": "..."}`

If Ollama is unavailable, fall back to rule-based simulation:
```python
def fallback_threat_analysis(data):
    score = min(1.0, data["failed_attempts"] * 0.15 + data["handshake_count"] * 0.01)
    return {"threat_score": round(score, 2), "severity": "HIGH" if score > 0.7 else "MEDIUM", ...}
```

---

### Module 4: Anomaly Detection (Simulated + Ollama)

Generate synthetic log data at `/benchmark/run`:

```python
def generate_synthetic_logs(n=1000):
    logs = []
    for i in range(n):
        anomaly = random.random() < 0.05  # 5% anomaly rate
        logs.append({
            "timestamp": datetime.now().isoformat(),
            "user_id": f"user_{random.randint(1, 50)}",
            "session_id": secrets.token_hex(8),
            "handshake_count": random.randint(100, 1000) if anomaly else random.randint(1, 20),
            "failed_attempts": random.randint(10, 50) if anomaly else random.randint(0, 2),
            "network_latency_ms": random.uniform(10, 500),
            "key_rotations": random.randint(0, 10),
            "is_anomaly": anomaly
        })
    return logs
```

Run a simulated IsolationForest by calling Ollama to "classify" batches of logs and return anomaly scores.

---

### Module 5: Benchmarking

`backend/simulation/benchmark_sim.py`:

Generate a comparison table for all 3 modes × 4 network profiles:

```python
BENCHMARK_BASELINES = {
    "x25519": {
        "keygen_ms": 1.1, "encap_ms": 0.0, "decap_ms": 0.0,
        "handshake_ms": 2.3, "cpu_pct": 2.1, "memory_kb": 128,
        "security_score": 60, "bandwidth_bytes": 64
    },
    "mlkem768": {
        "keygen_ms": 15.8, "encap_ms": 18.2, "decap_ms": 16.9,
        "handshake_ms": 52.1, "cpu_pct": 8.4, "memory_kb": 3168,
        "security_score": 90, "bandwidth_bytes": 2400
    },
    "hybrid": {
        "keygen_ms": 16.9, "encap_ms": 18.2, "decap_ms": 16.9,
        "handshake_ms": 54.4, "cpu_pct": 9.1, "memory_kb": 3296,
        "security_score": 100, "bandwidth_bytes": 2464
    }
}

def generate_benchmark_row(mode, network_profile):
    base = BENCHMARK_BASELINES[mode].copy()
    latency_multiplier = {"normal": 1.0, "wan": 5.2, "mobile": 13.8, "adverse": 28.4}[network_profile]
    base["handshake_ms"] = round(base["handshake_ms"] * latency_multiplier + random.uniform(-2, 2), 2)
    base["network_profile"] = network_profile
    base["mode"] = mode
    base["deployment_score"] = round(base["security_score"] - (base["handshake_ms"] / 10), 1)
    return base
```

---

### Module 6: Research Experiment Runner

`/experiment/page.tsx` — One-click demo that runs a scripted simulation with live progress:

Steps to animate (with fake progress, timing, and Ollama-generated commentary):

```
1. [0%]   Initializing simulation environment (1000 virtual clients)
2. [10%]  Generating ML-KEM-768 keypairs for all clients
3. [20%]  Performing X25519 ECDH handshakes
4. [30%]  Deriving hybrid shared secrets via HKDF-SHA256
5. [40%]  Establishing AES-256-GCM encrypted channels
6. [50%]  Simulating 10,000 encrypted message exchanges
7. [60%]  Injecting synthetic anomalies (brute force, flooding, hijacking)
8. [70%]  Running AI threat analysis via LLM
9. [80%]  Triggering automated key rotations
10. [90%] Collecting and aggregating performance metrics
11. [95%] Generating comparison charts
12. [100%] Experiment complete — PDF report available
```

Each step should call the backend and display real (simulated) numbers returned.

---

### Frontend Design Requirements

**Theme:** Dark cybersecurity aesthetic. Deep navy/slate background (#0a0f1e). Cyan/green accent (#00ff9d or #0ff). Monospace elements for crypto values. Subtle grid background pattern. Matrix-like animations for key generation.

**KeygenAnimation Component:**
- Multi-step modal/panel that appears during handshake
- Shows each step with a spinner → checkmark transition
- Displays the hex output of each operation (truncated, monospace)
- Shows timing next to each step

**HandshakeVisualizer Component:**
- Animated SVG diagram: Client A → [X25519] → Server → [ML-KEM-768] → Client B
- Arrows animate along the path in sequence
- Color-coded: orange for classical, blue for post-quantum, green for hybrid shared secret

**ThreatFeed Component:**
- Live scrolling feed of AI-generated threat assessments
- Color-coded rows: green (LOW), yellow (MEDIUM), orange (HIGH), red (CRITICAL)
- Shows threat_score as a progress bar
- Shows Ollama's reasoning text

**MetricsChart Component:**
- Use Recharts
- Grouped bar chart: X25519 vs ML-KEM-768 vs Hybrid
- Line chart for latency across network profiles
- Radar chart for security/performance tradeoff

---

### Module 9: Dashboard Page

Show live "system status" with simulated real-time updates (polling every 3s):

```
┌─────────────────────────────────────────────────────┐
│  QUANTUM-SAFE COMM PLATFORM — SYSTEM STATUS         │
├──────────────┬──────────────┬──────────────┬────────┤
│ Active Sesh  │ Key Rotations│ Threat Score │ Mode   │
│     1,247    │     43       │   0.12 LOW   │ HYBRID │
├──────────────┴──────────────┴──────────────┴────────┤
│ CRYPTOGRAPHY STATUS                                  │
│  ML-KEM-768: ACTIVE    X25519: ACTIVE               │
│  Avg Handshake: 54.4ms  Keys Generated: 2,494       │
├─────────────────────────────────────────────────────┤
│ AI SUBSYSTEM (Ollama llama3)                         │
│  Last Analysis: 2s ago  Anomalies Detected: 3       │
│  Next Rotation: key_7f3a (in ~4 min)                │
└─────────────────────────────────────────────────────┘
```

---

### WebSocket Chat Simulation

`/chat/page.tsx`:

When a message is sent:
1. Show "Encrypting with AES-256-GCM..." for 300ms
2. Show the ciphertext hex briefly
3. Deliver message to other client
4. Show "Decrypted" indicator

Display session info panel:
```
Session: a3f9...b12c
Algorithm: Hybrid X25519 + ML-KEM-768
Shared Secret: 7f3a...d901 (256-bit)
Messages: 14 | Rotations: 1
```

---

## Ollama Integration Details

**Model:** Use `llama3` or `mistral` (whichever is pulled). Auto-detect with:
```python
GET http://localhost:11434/api/tags  →  use first available model
```

**Always prompt for JSON output.** Include `"Respond ONLY with valid JSON, no markdown"` in every prompt.

**Fallback:** If Ollama is down, use rule-based fallbacks for all AI features. Never crash.

**Retry:** Max 2 retries with 1s delay. Timeout: 10s.

---

## Database Schema (SQLite)

```sql
CREATE TABLE users (id, username, password_hash, created_at);
CREATE TABLE sessions (id, user_a, user_b, shared_secret_hash, network_profile, created_at, status);
CREATE TABLE messages (id, session_id, sender, ciphertext, iv, tag, timestamp);
CREATE TABLE crypto_metrics (id, operation, algorithm, time_ms, network_profile, timestamp);
CREATE TABLE threat_logs (id, session_id, threat_score, severity, action, reasoning, timestamp);
CREATE TABLE benchmark_results (id, mode, network_profile, keygen_ms, handshake_ms, cpu_pct, memory_kb, security_score, bandwidth_bytes, deployment_score, timestamp);
```

---

## Docker Compose

```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - OLLAMA_URL=http://host.docker.internal:11434
      - DATABASE_URL=sqlite:///./quantum_comm.db
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

Ollama runs on the host machine (not in Docker).

---

## README Requirements

Include:
1. Prerequisites: Python 3.12, Node.js 18+, Ollama with llama3 pulled
2. Setup: `docker-compose up` or manual dev setup
3. Ollama setup: `ollama pull llama3`
4. Screenshots section placeholder
5. Architecture diagram (ASCII is fine)
6. Research context: what each module demonstrates and why

---

## Non-Goals (Explicitly Do NOT Do These)

- Do NOT install liboqs or oqs-python — use hex string simulation
- Do NOT use tc/netem — use asyncio.sleep() delays
- Do NOT use Prometheus/Grafana — build charts in the frontend with Recharts
- Do NOT use Redis or PostgreSQL — SQLite only
- Do NOT train any ML model — use Ollama for all AI outputs
- Do NOT implement real JWT signing with RSA — use simple HMAC-SHA256 tokens
- Do NOT generate real PDFs — show a "Download Report" button that downloads a pre-structured HTML page as PDF via browser print

---

## Success Criteria

A thesis reviewer should be able to:
1. Register and log in
2. See a simulated hybrid KEM handshake with step-by-step animation and timing
3. Send encrypted messages in the chat UI and see simulated ciphertext
4. View benchmark comparison charts (X25519 vs ML-KEM-768 vs Hybrid)
5. See live AI-generated threat assessments from Ollama
6. Run the one-click research experiment and see all 12 steps complete
7. Read a deployment score table showing the security/performance tradeoff

The platform should feel like a polished research tool, not a toy app.
```

