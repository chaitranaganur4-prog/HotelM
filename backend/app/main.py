"""
Hotel M — FastAPI Application Entry Point
"""

from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import guests, rooms, bookings, auth, customer
from app import database, models
from sqlalchemy.orm import Session
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
    
    # Automatically trust any Vercel deployment or localhost
    is_trusted = False
    if origin:
        if origin.endswith(".vercel.app") or origin == "http://localhost:3000":
            is_trusted = True

    if is_trusted:
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
app.include_router(customer.router, prefix="/api/customer", tags=["Customer"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Hotel M API", "docs": "/docs"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

@app.get("/api/stats")
def get_stats(db: Session = Depends(database.get_db)):
    from sqlalchemy import func
    # 1. Room Stats
    total_rooms = db.query(models.Room).count()
    occupied_rooms = db.query(models.Room).filter(models.Room.status == 'occupied').count()
    available_rooms = db.query(models.Room).filter(models.Room.status == 'available').count()
    
    # 2. Booking Stats
    total_bookings = db.query(models.Booking).count()
    
    # 3. Revenue Stats
    total_revenue = db.query(func.sum(models.Booking.total_amount)).filter(models.Booking.payment_status == 'paid').scalar() or 0
    
    # 4. Guest Stats
    total_guests = db.query(models.Guest).count()
    
    # 5. Room Type analysis
    room_types = db.query(models.RoomType.name, func.count(models.Room.id)).join(models.Room).group_by(models.RoomType.name).all()
    
    return {
        "room_stats": {
            "total": total_rooms,
            "occupied": occupied_rooms,
            "available": available_rooms,
            "occupancy_rate": round((occupied_rooms / total_rooms * 100), 1) if total_rooms > 0 else 0
        },
        "booking_stats": {
            "total": total_bookings
        },
        "revenue_stats": {
            "total": float(total_revenue)
        },
        "guest_stats": {
            "total": total_guests
        },
        "room_type_data": [
            {"type": rt[0], "count": rt[1]} for rt in room_types
        ]
    }

