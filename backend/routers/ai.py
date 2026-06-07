from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from pydantic import BaseModel
from backend.models.database import get_db, ThreatLog
from backend.ai.ollama_client import predict_key_rotation, analyze_anomaly

router = APIRouter()

class KeyRotationSchema(BaseModel):
    age_days: int
    session_count: int
    failed_logins: int

class ThreatAnalysisSchema(BaseModel):
    session_id: str
    session_logs: list

@router.post("/ai/predict-rotation")
async def predict_rotation(data: KeyRotationSchema):
    result = await predict_key_rotation(data.model_dump())
    return result

@router.post("/ai/analyze-threat")
async def analyze_threat(data: ThreatAnalysisSchema, db: DBSession = Depends(get_db)):
    result = await analyze_anomaly(data.session_logs)
    
    # Save threat assessment log in database
    log = ThreatLog(
        session_id=data.session_id,
        threat_score=result["threat_score"],
        severity=result["severity"],
        action=result["action"],
        reasoning=result["reasoning"]
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return {
        "id": log.id,
        "session_id": log.session_id,
        "threat_score": log.threat_score,
        "severity": log.severity,
        "action": log.action,
        "reasoning": log.reasoning,
        "timestamp": log.timestamp.isoformat()
    }
