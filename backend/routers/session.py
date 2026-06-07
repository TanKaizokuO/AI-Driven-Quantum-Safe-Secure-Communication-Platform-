from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from pydantic import BaseModel
import secrets
from backend.models.database import get_db, Session as DbSessionModel, CryptoMetric
from backend.simulation.crypto_sim import simulate_hybrid_handshake

router = APIRouter()

class CreateSessionSchema(BaseModel):
    user_a: str
    user_b: str
    network_profile: str = "normal"

class ConnectSessionSchema(BaseModel):
    session_id: str
    username: str

@router.post("/session/create")
async def create_session(data: CreateSessionSchema, db: DBSession = Depends(get_db)):
    handshake = await simulate_hybrid_handshake(data.network_profile)
    session_id = secrets.token_hex(16)
    
    # Store session in database
    new_session = DbSessionModel(
        id=session_id,
        user_a=data.user_a,
        user_b=data.user_b,
        shared_secret_hash=handshake["shared_secret"][:16], # Simulated hash
        network_profile=data.network_profile,
        status="active"
    )
    db.add(new_session)
    
    # Store crypto metrics in DB
    for step in handshake["steps"]:
        metric = CryptoMetric(
            operation=step["step"],
            algorithm="ML-KEM-768" if "ML-KEM" in step["step"] else "X25519" if "X25519" in step["step"] else "HKDF",
            time_ms=step["time_ms"],
            network_profile=data.network_profile
        )
        db.add(metric)
        
    db.commit()
    
    return {
        "session_id": session_id,
        "shared_secret": handshake["shared_secret"],
        "total_handshake_time_ms": handshake["total_handshake_time_ms"],
        "steps": handshake["steps"],
        "network_profile": data.network_profile
    }

@router.post("/session/connect")
def connect_session(data: ConnectSessionSchema, db: DBSession = Depends(get_db)):
    session = db.query(DbSessionModel).filter(DbSessionModel.id == data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if data.username not in [session.user_a, session.user_b]:
        # Connect user to session by replacing user_b if empty or matching name
        if session.user_b == "":
            session.user_b = data.username
            db.commit()
        else:
            raise HTTPException(status_code=403, detail="Session is full or username unauthorized")
            
    return {
        "session_id": session.id,
        "user_a": session.user_a,
        "user_b": session.user_b,
        "network_profile": session.network_profile,
        "shared_secret_hash": session.shared_secret_hash,
        "status": session.status
    }
