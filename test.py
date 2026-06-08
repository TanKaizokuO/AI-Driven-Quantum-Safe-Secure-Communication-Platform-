import json
import secrets
import httpx
import time
from datetime import datetime

# Color configurations for terminal output
RESET = "\033[0m"
BOLD = "\033[1m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
CYAN = "\033[36m"
MAGENTA = "\033[35m"

API_URL = "http://localhost:8001/ai/analyze-threat"

# Define the synthetic scenarios matching user requirements
scenarios = [
    {
        "name": "Normal Traffic",
        "description": "Standard communication behavior under normal system utilization.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "operator_alpha",
                "handshake_count": 2,
                "failed_attempts": 0,
                "network_latency_ms": 45.2,
                "key_rotations": 1,
                "status": "success",
                "reason": "Established session with hybrid X25519 + ML-KEM-768 KEM."
            }
        ]
    },
    {
        "name": "Brute-Force Login Attack",
        "description": "Repeated authentication failures on a single operator account in a short duration.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "admin",
                "handshake_count": 1,
                "failed_attempts": 15,
                "network_latency_ms": 12.4,
                "key_rotations": 0,
                "status": "failed",
                "reason": "15 consecutive password authentication failures from IP 192.168.1.105 on operator admin."
            }
        ]
    },
    {
        "name": "Credential Stuffing",
        "description": "Multiple authentication failures across various account usernames.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "multi_user_attempt",
                "handshake_count": 1,
                "failed_attempts": 30,
                "network_latency_ms": 18.1,
                "key_rotations": 0,
                "status": "failed",
                "reason": "Rapid authentication failures across 10 different usernames from single subnet client 10.0.4.52."
            }
        ]
    },
    {
        "name": "Session Hijacking Attempt",
        "description": "Unauthorized attempt to access session with anomalous user agent/IP parameters.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "operator_beta",
                "handshake_count": 1,
                "failed_attempts": 2,
                "network_latency_ms": 280.5,
                "key_rotations": 0,
                "status": "unauthorized",
                "reason": "Session token presented from anomalous IP address location and browser user-agent difference."
            }
        ]
    },
    {
        "name": "DDoS-like Traffic Spikes",
        "description": "Extreme request floods taxing network and handshake processors.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "unknown_client",
                "handshake_count": 1500,
                "failed_attempts": 0,
                "network_latency_ms": 850.3,
                "key_rotations": 0,
                "status": "flooded",
                "reason": "Unusually high traffic spike: 1,500 endpoint handshake packets received in 3-second window."
            }
        ]
    },
    {
        "name": "Excessive Handshake Requests",
        "description": "Flood of cryptographic negotiations without final shared secret derivation.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "operator_gamma",
                "handshake_count": 450,
                "failed_attempts": 3,
                "network_latency_ms": 120.0,
                "key_rotations": 0,
                "status": "re-negotiating",
                "reason": "Continuous PQC key encapsulation requests without establishing final symmetric shared secret."
            }
        ]
    },
    {
        "name": "Suspicious Key Usage Patterns",
        "description": "Relying on deprecated or expired cryptographic key profiles without rotation.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "operator_delta",
                "handshake_count": 12,
                "failed_attempts": 0,
                "network_latency_ms": 35.1,
                "key_rotations": 0,
                "status": "active",
                "reason": "Continuous cryptographic data encryption requests using private key generated 180 days ago (expired policy)."
            }
        ]
    },
    {
        "name": "Unauthorized Session Access",
        "description": "Accessing chat resources or decryption nodes without holding valid key token signatures.",
        "logs": [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "unauthenticated_guest",
                "handshake_count": 1,
                "failed_attempts": 5,
                "network_latency_ms": 55.4,
                "key_rotations": 0,
                "status": "forbidden",
                "reason": "Attempted to access message decrypted buffer with invalid or missing session key signatures."
            }
        ]
    }
]

def format_json(data):
    return json.dumps(data, indent=2)

def print_banner():
    print(f"{CYAN}{BOLD}" + "="*70)
    print("      POST-QUANTUM SECURE COMMUNICATION PLATFORM - THESIS SIMULATOR")
    print("                  Synthetic Threat Generator & AI Analyzer")
    print("="*70 + f"{RESET}\n")

async def run_simulation():
    print_banner()
    
    async with httpx.AsyncClient() as client:
        for idx, scenario in enumerate(scenarios, 1):
            session_id = secrets.token_hex(8)
            print(f"{BOLD}{MAGENTA}[Scenario {idx}/{len(scenarios)}] {scenario['name']}{RESET}")
            print(f"{CYAN}Description:{RESET} {scenario['description']}")
            print(f"{CYAN}Generating logs payload...{RESET}")
            
            # Print sample of the logs
            print(f"{YELLOW}Log Signature:{RESET}\n{format_json(scenario['logs'])}")
            
            payload = {
                "session_id": session_id,
                "session_logs": scenario["logs"]
            }
            
            print(f"{CYAN}Sending logs to AI Threat Analyzer...{RESET}")
            try:
                response = await client.post(API_URL, json=payload, timeout=15.0)
                if response.status_code == 200:
                    result = response.json()
                    
                    # Style severity
                    severity = result.get("severity", "LOW")
                    if severity == "CRITICAL":
                        sev_color = f"{RED}{BOLD}"
                    elif severity == "HIGH":
                        sev_color = RED
                    elif severity == "MEDIUM":
                        sev_color = YELLOW
                    else:
                        sev_color = GREEN
                        
                    print(f"{GREEN}✔ AI Analysis Received!{RESET}")
                    print(f"┌────────────────────────────────────────────────────────")
                    print(f"│ {BOLD}Threat Score:{RESET} {result.get('threat_score')} / 1.0")
                    print(f"│ {BOLD}Severity:{RESET}     {sev_color}{severity}{RESET}")
                    print(f"│ {BOLD}Action:{RESET}       {result.get('action')}")
                    print(f"│ {BOLD}Reasoning:{RESET}    {result.get('reasoning')}")
                    print(f"└────────────────────────────────────────────────────────\n")
                else:
                    print(f"{RED}❌ Failed: API returned status code {response.status_code}{RESET}")
                    print(response.text)
            except httpx.ConnectError:
                print(f"{RED}❌ Connection Error: Backend server is not running on {API_URL}.{RESET}")
                print(f"{YELLOW}Please make sure your FastAPI backend is running before executing this script.{RESET}\n")
                break
            except Exception as e:
                print(f"{RED}❌ Error: {e}{RESET}\n")
                
            time.sleep(1)

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_simulation())
