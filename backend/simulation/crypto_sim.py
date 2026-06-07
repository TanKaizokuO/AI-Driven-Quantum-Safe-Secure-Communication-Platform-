import asyncio
import secrets
import random
import time

async def simulate_x25519_keygen():
    await asyncio.sleep(random.uniform(0.005, 0.012))
    return {
        "public_key": secrets.token_hex(32),
        "time_ms": round(random.uniform(0.8, 1.2), 3)
    }

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

async def simulate_encrypt_message(plaintext: str):
    await asyncio.sleep(random.uniform(0.001, 0.003))
    return {
        "ciphertext": secrets.token_hex(len(plaintext) + 16),
        "iv": secrets.token_hex(12),
        "tag": secrets.token_hex(16),
        "algorithm": "AES-256-GCM",
        "encrypt_time_ms": round(random.uniform(0.1, 0.4), 3)
    }
