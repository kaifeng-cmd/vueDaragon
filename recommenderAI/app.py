from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes import recommendation_routes

load_dotenv()

app = FastAPI(
    title="Drama Recommendation API",
    description="API for drama recommendations using cosine similarity",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(recommendation_routes.router, prefix="/api/v1", tags=["recommendations"])

@app.get("/")
async def root():
    return {"message": "Drama Recommendation API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 