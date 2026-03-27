"""
Hotel M — FastAPI Application Entry Point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import guests, rooms, bookings, auth
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="Hotel M API",
    description="Backend API for Hotel Management System",
    version="1.0.0",
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    logger.info(f"Incoming request: {request.method} {request.url} | Origin: {origin}")
    response = await call_next(request)
    
    # Manually ensure CORS headers for trusted origins if needed
    trusted_origins = [
        "https://hotelm-frontend-final.vercel.app",
        "https://hotel-m-frontend-v6.vercel.app",
        "http://localhost:3000"
    ]
    if origin in trusted_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        
    return response

import traceback
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = f"Unhandled exception: {exc}"
    logger.error(error_msg)
    logger.error(traceback.format_exc())
    
    # Return CORS headers even on 500 errors so the browser can read the response
    origin = request.headers.get("origin", "*")
    headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
    }
    
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc), "traceback": traceback.format_exc()},
        headers=headers
    )

# CORS middleware
origins = [origin.strip() for origin in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(guests.router, prefix="/api/guests", tags=["Guests"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["Rooms"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Hotel M API", "docs": "/docs"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
