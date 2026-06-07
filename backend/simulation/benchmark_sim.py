import random

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
    base["deployment_score"] = round(base["security_score"] - (base["handshake_ms"] / 10.0), 1)
    return base
