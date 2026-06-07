from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from backend.models.database import get_db, BenchmarkResult, ThreatLog
from backend.simulation.benchmark_sim import generate_benchmark_row
from backend.simulation.anomaly_sim import generate_synthetic_logs
from backend.ai.ollama_client import analyze_anomaly

router = APIRouter()

@router.post("/benchmark/run")
async def run_benchmark(db: DBSession = Depends(get_db)):
    # Delete old results so we only showcase the latest benchmark run
    db.query(BenchmarkResult).delete()
    
    modes = ["x25519", "mlkem768", "hybrid"]
    profiles = ["normal", "wan", "mobile", "adverse"]
    
    results = []
    for mode in modes:
        for profile in profiles:
            row = generate_benchmark_row(mode, profile)
            res = BenchmarkResult(
                mode=row["mode"],
                network_profile=row["network_profile"],
                keygen_ms=row["keygen_ms"],
                handshake_ms=row["handshake_ms"],
                cpu_pct=row["cpu_pct"],
                memory_kb=row["memory_kb"],
                security_score=row["security_score"],
                bandwidth_bytes=row["bandwidth_bytes"],
                deployment_score=row["deployment_score"]
            )
            db.add(res)
            results.append(row)
            
    # Also generate synthetic anomaly logs to seed the threat assessment table
    synthetic_logs = generate_synthetic_logs(15)
    # Perform a couple of threat assessments to have content in ThreatLog
    # We choose 3 random batches to analyze and store
    for i in range(3):
        slice_logs = synthetic_logs[i*5:(i+1)*5]
        analysis = await analyze_anomaly(slice_logs)
        log_entry = ThreatLog(
            session_id=slice_logs[0]["session_id"],
            threat_score=analysis["threat_score"],
            severity=analysis["severity"],
            action=analysis["action"],
            reasoning=analysis["reasoning"]
        )
        db.add(log_entry)
        
    db.commit()
    return {"status": "success", "results": results}

@router.get("/benchmark/results")
def get_benchmark_results(db: DBSession = Depends(get_db)):
    results = db.query(BenchmarkResult).all()
    # If empty, return generated defaults
    if not results:
        modes = ["x25519", "mlkem768", "hybrid"]
        profiles = ["normal", "wan", "mobile", "adverse"]
        for mode in modes:
            for profile in profiles:
                row = generate_benchmark_row(mode, profile)
                res = BenchmarkResult(
                    mode=row["mode"],
                    network_profile=row["network_profile"],
                    keygen_ms=row["keygen_ms"],
                    handshake_ms=row["handshake_ms"],
                    cpu_pct=row["cpu_pct"],
                    memory_kb=row["memory_kb"],
                    security_score=row["security_score"],
                    bandwidth_bytes=row["bandwidth_bytes"],
                    deployment_score=row["deployment_score"]
                )
                db.add(res)
        db.commit()
        results = db.query(BenchmarkResult).all()
        
    return results

@router.get("/threats/feed")
def get_threats_feed(db: DBSession = Depends(get_db)):
    feed = db.query(ThreatLog).order_by(ThreatLog.timestamp.desc()).limit(50).all()
    return feed
