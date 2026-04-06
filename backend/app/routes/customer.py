"""
Hotel M — Customer-Specific Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from app.models import Staff, Guest, Booking
from app.routes.bookings import BookingResponse
from typing import List

router = APIRouter()

@router.get("/bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    db: Session = Depends(get_db), 
    current_user: Staff = Depends(get_current_active_user)
):
    """
    Fetch all bookings for the currently logged-in customer.
    Links the Staff user to a Guest record by email.
    """
    # Find the guest record that matches the user's email
    guest = db.query(Guest).filter(Guest.email == current_user.email).first()
    
    if not guest:
        # If no guest record exists for this email, they haven't made any bookings yet
        return []
        
    bookings = db.query(Booking).filter(Booking.guest_id == guest.id).options(
        joinedload(Booking.room),
        joinedload(Booking.guest)
    ).all()
    
    return bookings

@router.get("/profile")
async def get_my_profile(
    current_user: Staff = Depends(get_current_active_user)
):
    """
    Returns the basic profile info of the logged-in user.
    """
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role
    }
