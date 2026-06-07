import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quantum_comm.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, index=True) # Hex string
    user_a = Column(String, nullable=False)
    user_b = Column(String, nullable=False)
    shared_secret_hash = Column(String, nullable=False)
    network_profile = Column(String, default="normal")
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active") # active, closed

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    sender = Column(String, nullable=False)
    ciphertext = Column(String, nullable=False)
    iv = Column(String, nullable=False)
    tag = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CryptoMetric(Base):
    __tablename__ = "crypto_metrics"
    id = Column(Integer, primary_key=True, index=True)
    operation = Column(String, nullable=False)
    algorithm = Column(String, nullable=False)
    time_ms = Column(Float, nullable=False)
    network_profile = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ThreatLog(Base):
    __tablename__ = "threat_logs"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, nullable=True)
    threat_score = Column(Float, nullable=False)
    severity = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    action = Column(String, nullable=False) # MONITOR, ROTATE_KEY, TERMINATE_SESSION
    reasoning = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"
    id = Column(Integer, primary_key=True, index=True)
    mode = Column(String, nullable=False) # x25519, mlkem768, hybrid
    network_profile = Column(String, nullable=False)
    keygen_ms = Column(Float, nullable=False)
    handshake_ms = Column(Float, nullable=False)
    cpu_pct = Column(Float, nullable=False)
    memory_kb = Column(Integer, nullable=False)
    security_score = Column(Float, nullable=False)
    bandwidth_bytes = Column(Integer, nullable=False)
    deployment_score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
