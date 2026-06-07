FROM python:3.12-slim

WORKDIR /app

# Install uv for fast builds
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY backend/requirements.txt .

RUN uv pip install --system -r requirements.txt

COPY backend/ /app/backend/

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
