import random
import secrets
from datetime import datetime

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
