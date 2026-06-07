from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from pydantic import BaseModel
from backend.models.database import get_db, Message, Session as DbSessionModel
from backend.simulation.crypto_sim import simulate_encrypt_message

router = APIRouter()

class SendMessageSchema(BaseModel):
    session_id: str
    sender: str
    plaintext: str

@router.post("/message/send")
async def send_message(data: SendMessageSchema, db: DBSession = Depends(get_db)):
    session = db.query(DbSessionModel).filter(DbSessionModel.id == data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    encrypted = await simulate_encrypt_message(data.plaintext)
    
    msg = Message(
        session_id=data.session_id,
        sender=data.sender,
        ciphertext=encrypted["ciphertext"],
        iv=encrypted["iv"],
        tag=encrypted["tag"]
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    
    return {
        "id": msg.id,
        "session_id": msg.session_id,
        "sender": msg.sender,
        "ciphertext": msg.ciphertext,
        "iv": msg.iv,
        "tag": msg.tag,
        "timestamp": msg.timestamp.isoformat(),
        "encrypt_time_ms": encrypted["encrypt_time_ms"]
    }
