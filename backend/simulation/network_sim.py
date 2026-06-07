import asyncio
import random

NETWORK_PROFILES = {
    "normal":   {"latency_ms": 10,  "packet_loss": 0.00},
    "wan":      {"latency_ms": 100, "packet_loss": 0.01},
    "mobile":   {"latency_ms": 250, "packet_loss": 0.03},
    "adverse":  {"latency_ms": 500, "packet_loss": 0.05},
}

class SimulatedPacketLoss(Exception):
    pass

async def simulate_network(profile: str):
    p = NETWORK_PROFILES.get(profile, NETWORK_PROFILES["normal"])
    await asyncio.sleep(p["latency_ms"] / 1000.0)
    if random.random() < p["packet_loss"]:
        raise SimulatedPacketLoss("Simulated packet loss occurred")
