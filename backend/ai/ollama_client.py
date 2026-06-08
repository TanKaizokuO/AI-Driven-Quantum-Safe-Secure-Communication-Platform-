import os
import json
import httpx
import logging

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
logger = logging.getLogger(__name__)

async def get_ollama_model() -> str:
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            response = await client.get(f"{OLLAMA_URL}/api/tags")
            if response.status_code == 200:
                data = response.json()
                models = data.get("models", [])
                if models:
                    return models[0]["name"]
    except Exception as e:
        logger.warning(f"Failed to auto-detect Ollama model: {e}")
    return "llama3"

async def ask_ollama(prompt: str) -> dict:
    model = await get_ollama_model()
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                }
            )
            if response.status_code == 200:
                resp_json = response.json()
                text = resp_json.get("response", "").strip()
                return json.loads(text)
    except Exception as e:
        logger.warning(f"Ollama request failed: {e}. Falling back to simulation.")
    return None

async def predict_key_rotation(key_data: dict) -> dict:
    prompt = f"""
You are a cryptographic key management assistant. Analyze this key metadata and return ONLY valid JSON:
{{
  "risk_level": "<Safe|Rotate Soon|Immediate Rotation>",
  "reason": "<one sentence description of risk>",
  "confidence": <float between 0.0 and 1.0>
}}

Key Data: {json.dumps(key_data)}
"""
    result = await ask_ollama(prompt)
    if result:
        return result
    
    # Fallback rule-based
    age_days = key_data.get("age_days", 0)
    session_count = key_data.get("session_count", 0)
    failed_logins = key_data.get("failed_logins", 0)
    
    if age_days > 30 or session_count > 1000 or failed_logins > 5:
        risk = "Immediate Rotation"
        reason = "High usage or failed logins exceed threshold."
        conf = 0.95
    elif age_days > 15 or session_count > 500:
        risk = "Rotate Soon"
        reason = "Key age or session count is moderate."
        conf = 0.80
    else:
        risk = "Safe"
        reason = "Key usage and age are within safe thresholds."
        conf = 0.90
        
    return {"risk_level": risk, "reason": reason, "confidence": conf}

async def analyze_anomaly(session_logs: list) -> dict:
    prompt = f"""
You are an AI anomaly detector for a post-quantum hybrid communication network. Analyze the following session logs and return ONLY valid JSON:
{{
  "threat_score": <float 0.0-1.0>,
  "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "anomaly_type": "<description of suspected attack or state>",
  "action": "<MONITOR|ROTATE_KEY|TERMINATE_SESSION>",
  "reasoning": "<one sentence explaining decision>"
}}

Logs: {json.dumps(session_logs)}
"""
    result = await ask_ollama(prompt)
    if result:
        return result
        
    # Fallback rule-based
    max_failed = 0
    max_handshakes = 0
    for log in session_logs:
        max_failed = max(max_failed, log.get("failed_attempts", 0))
        max_handshakes = max(max_handshakes, log.get("handshake_count", 0))
        
    score = min(1.0, max_failed * 0.15 + max_handshakes * 0.002)
    
    if score > 0.8:
        severity = "CRITICAL"
        action = "TERMINATE_SESSION"
        anomaly_type = "Brute Force / DDoS Attack"
        reasoning = f"Severe anomaly detected: {max_failed} failed attempts, {max_handshakes} handshakes."
    elif score > 0.5:
        severity = "HIGH"
        action = "ROTATE_KEY"
        anomaly_type = "Potential Hijack Attempt"
        reasoning = f"Elevated threat level: failed attempts ({max_failed}) or handshakes ({max_handshakes}) are high."
    elif score > 0.2:
        severity = "MEDIUM"
        action = "MONITOR"
        anomaly_type = "Unusual Activity"
        reasoning = "Slightly elevated activity level, monitoring recommended."
    else:
        severity = "LOW"
        action = "MONITOR"
        anomaly_type = "None"
        reasoning = "System metrics look healthy."
        
    return {
        "threat_score": round(score, 2),
        "severity": severity,
        "anomaly_type": anomaly_type,
        "action": action,
        "reasoning": reasoning
    }

async def check_ollama_connection() -> tuple[bool, str]:
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"{OLLAMA_URL}/api/tags")
            if response.status_code == 200:
                data = response.json()
                models = data.get("models", [])
                if models:
                    return True, models[0]["name"]
                return True, "Unknown"
    except Exception:
        pass
    return False, "llama3"

