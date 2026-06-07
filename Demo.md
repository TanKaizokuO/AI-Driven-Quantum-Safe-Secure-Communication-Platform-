# Demonstration Guide: AI-Driven Quantum-Safe Secure Communication Platform

This document describes how to set up, launch, and step through a live demonstration of the **AI-Driven Quantum-Safe Secure Communication Platform**. Follow these steps to showcase the system features to reviewers or thesis committees.

---

## 1. Prerequisites & Environment Setup

Ensure the following environments are active on your machine:
1. **Python 3.12+**
2. **Node.js 18+** & **npm**
3. **Ollama** (for AI Threat Analysis and Key Rotation prediction)

### Ollama Configuration
To enable the AI capabilities:
1. Download and run Ollama from [ollama.com](https://ollama.com/).
2. Pull the default model by running in a separate terminal:
   ```bash
   ollama pull llama3
   ```
   *Note: If Ollama is offline or unavailable, the backend automatically transitions to a robust rule-based local simulation to ensure the platform remains fully functional without crashing.*

---

## 2. Launching the Services

You will need to run the **Backend API**, the **Frontend Next.js app**, and the **Ollama engine** concurrently.

### Step A: Start the Backend API (Port 8001)
Open a terminal at the project root and execute:
```bash
# Using uv (recommended)
uv run uvicorn backend.main:app --reload --port 8001
```
The backend server will launch and bind to `http://localhost:8001`. It automatically initializes the SQLite database (`quantum_comm.db`).

### Step B: Start the Frontend Next.js Server (Port 3000)
Open a second terminal, navigate to the `frontend` folder, and launch:
```bash
cd frontend
npm run dev
```
The application will launch at `http://localhost:3000`. 

> [!NOTE]
> The frontend is pre-configured to communicate with the backend at port `8001` via the environment variables in `frontend/.env.local`.

---

## 3. Step-by-Step Demo Guide

Open your browser and navigate to **`http://localhost:3000`** to begin the walkthrough.

### Phase 1: Authentication & Operator Portal
1. **Action**: Click on **Register Credentials** at the bottom of the form if you don't have an operator profile.
2. **Action**: Register a username and password.
3. **Action**: Return to the login portal and authenticate using those credentials.
4. **Visual Highlight**: Note the cyber-security terminal theme, custom styling, and system log formatting during authentication.

---

### Phase 2: System Dashboard Overview
Once authenticated, you will arrive at the **Control Dashboard**:
1. **System Monitors**: Observe real-time indicators for *Active Sessions*, *Key Rotations*, *AI Threat Scores*, and the active security protocol (**Hybrid ML-KEM-768 + X25519**).
2. **Subsystem Feeds**: Note the Ollama AI Subsystem connection status widget displaying the active model and rotation predictions.
3. **Live Feeds**: View the scrolling list of recent AI analysis alerts showing anomaly levels and actions.

---

### Phase 3: Hybrid KEM Session Handshake
1. **Action**: Click **Secure Chat** in the navigation header.
2. **Action**: Select a network simulation profile (e.g., *Normal*, *WAN*, *Mobile*, or *Adverse*).
3. **Action**: Click **Establish Hybrid Session**.
4. **Visual Highlights**: 
   - A multi-stage dialog overlay will trigger, rendering the step-by-step cryptographic setup.
   - Watch the spinner-to-checkmark status transition for *X25519 KeyGen*, *ML-KEM-768 KeyGen*, *ML-KEM Encapsulation*, *ML-KEM Decapsulation*, and *HKDF Derivation*.
   - Observe the real-time latency numbers in milliseconds next to each step.
   - Note the derived **Shared Secret Hex String** (monospace key values) displayed in the session details pane.
   - View the animated **Handshake SVG Flow Diagram** mapping client-to-server payload encapsulation vectors.

---

### Phase 4: WebSocket Encrypted Communication
1. **Action**: Type a message into the chat chamber input box and press **Send**.
2. **Visual Highlights**:
   - The UI briefly captures and renders the client-side encryption state: *Encrypting with AES-256-GCM...*
   - Note the resulting hex representations of the `ciphertext`, initialization vector (`iv`), and authentication `tag`.
   - The message is sent over WebSockets, received instantly, and decrypted safely.
3. **Network Latency Check**: Swap between different network profiles (e.g., *Adverse Network* with 500ms delay and 5% packet loss) to witness the transmission delay during WebSocket message propagation.

---

### Phase 5: AI Key Rotation Management
1. **Action**: Click the **Threat Monitor** page from the navigation bar.
2. **Action**: Enter sample metadata into the **AI Key Rotation Simulator**:
   - Set Key Age to **35 days**.
   - Set Session Count to **1200**.
   - Set Failed Logins to **6**.
3. **Action**: Click **Run Rotation Assessment**.
4. **Response**: Watch the AI agent process this telemetry metadata using the local Ollama LLM and return a formatted verdict (e.g., `Immediate Rotation` with reasoning: *"High usage or failed logins exceed threshold."*).

---

### Phase 6: Performance Benchmark Analysis
1. **Action**: Click on **Performance Charts** in the navigation header.
2. **Action**: Click **Run Benchmarking Suite**.
3. **Visual Highlights**:
   - The backend runs test routines contrasting **X25519** only, **ML-KEM-768** only, and the **Hybrid** system across all network profiles.
   - Watch the interactive **Recharts graphs** dynamically populate:
     - **Latency comparison**: Showcases the performance impact of post-quantum overhead across networks.
     - **Bandwidth comparison**: Visualizes PQC payload byte scale compared to ECC.
     - **Deployment Score Radar Chart**: Maps security vs. performance trade-offs, demonstrating why Hybrid is the optimal modern choice.

---

### Phase 7: One-Click Research Experiment & Thesis Export
1. **Action**: Navigate to the **Research Runner** page.
2. **Action**: Click **Start Simulation Run**.
3. **Visual Highlights**:
   - Watch the terminal console stream output live logs as it runs a scripted 1,000 virtual client environment test.
   - The progress bar tracks execution across 12 milestone stages, including key generation, traffic simulation, anomaly injection, and automated rotations.
4. **Action**: Once complete, click **Download PDF Report**.
5. **PDF Export**: The button automatically invokes the browser's printable layout view, formatting the report into a clean, document-friendly design suitable for thesis attachment.
