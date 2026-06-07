from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.models.database import init_db
from backend.routers import auth, session, message, metrics, ai, benchmark
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

# Initialize database
init_db()

app = FastAPI(title="AI-Driven Quantum-Safe Secure Communication Platform API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(session.router, tags=["Sessions"])
app.include_router(message.router, tags=["Messages"])
app.include_router(metrics.router, tags=["Metrics"])
app.include_router(ai.router, tags=["AI"])
app.include_router(benchmark.router, tags=["Benchmarks"])

# WebSocket Manager for active sessions
class ConnectionManager:
    def __init__(self):
        # Map: session_id -> list of WebSockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)
        logger.info(f"WebSocket client connected to session: {session_id}. Active: {len(self.active_connections[session_id])}")

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
        logger.info(f"WebSocket client disconnected from session: {session_id}")

    async def broadcast(self, message: str, session_id: str, sender_ws: WebSocket = None):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                # Optionally don't send back to sender
                if connection != sender_ws:
                    try:
                        await connection.send_text(message)
                    except Exception as e:
                        logger.error(f"Error sending WebSocket message: {e}")

manager = ConnectionManager()

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            # We wait for messages from clients
            data = await websocket.receive_text()
            # Broadcast the raw message to all other participants in the room
            await manager.broadcast(data, session_id, sender_ws=websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    except Exception as e:
        logger.error(f"WebSocket endpoint error: {e}")
        manager.disconnect(websocket, session_id)

@app.get("/")
def read_root():
    return {"message": "Quantum-Safe Secure Communication Platform API is running."}
