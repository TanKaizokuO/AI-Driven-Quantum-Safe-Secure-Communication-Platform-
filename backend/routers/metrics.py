from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from backend.models.database import get_db, CryptoMetric

router = APIRouter()

@router.get("/metrics")
def get_metrics(db: DBSession = Depends(get_db)):
    metrics = db.query(CryptoMetric).order_by(CryptoMetric.timestamp.desc()).limit(100).all()
    return metrics
