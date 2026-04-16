"""
Hotel M — Booking Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter()


# --- Pydantic Schemas ---

class GuestInfo(BaseModel):
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True


class RoomInfo(BaseModel):
    room_number: str
    floor: Optional[int] = None
    status: str

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    guest_id: Optional[int] = None
    room_id: int
    check_in_date: date
    check_out_date: date
    total_amount: Optional[float] = None


class BookingResponse(BaseModel):
    id: int
    guest_id: int
    room_id: int
    check_in_date: date
    check_out_date: date
    total_amount: Optional[float] = None
    status: str
    payment_status: str
    guest: Optional[GuestInfo] = None
    room: Optional[RoomInfo] = None

    class Config:
        from_attributes = True


# --- Endpoints ---

@router.get("/", response_model=list[BookingResponse])
def get_bookings(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Booking).options(
        joinedload(models.Booking.room),
        joinedload(models.Booking.guest)
    )
    if status:
        query = query.filter(models.Booking.status == status)
    return query.all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.post("/", response_model=BookingResponse, status_code=201)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Booking request: {booking} from user {current_user.email}")
    
    # 1. Resolve guest_id if not provided (for customers)
    resolved_guest_id = booking.guest_id
    if not resolved_guest_id:
        if current_user.role == "customer":
            # Check if guest record exists for this customer
            guest = db.query(models.Guest).filter(models.Guest.email == current_user.email).first()
            if not guest:
                # Create guest record automatically
                logger.info(f"Creating new Guest record for customer {current_user.email}")
                guest = models.Guest(
                    first_name=current_user.first_name,
                    last_name=current_user.last_name,
                    email=current_user.email,
                    phone=current_user.phone
                )
                db.add(guest)
                db.flush() # Get the ID without committing
            resolved_guest_id = guest.id
        else:
            raise HTTPException(status_code=400, detail="guest_id is required for staff-initiated bookings")

    # 2. Verify room is available
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status != "available":
        raise HTTPException(status_code=400, detail="Room is not available")

    # 3. Create booking
    booking_dict = booking.model_dump()
    booking_dict["guest_id"] = resolved_guest_id
    
    # Calculate price if missing
    if not booking_dict.get("total_amount"):
        from decimal import Decimal
        # Get base price from room_type
        room_type = db.query(models.RoomType).filter(models.RoomType.id == room.room_type_id).first()
        base_price = room_type.base_price if room_type else Decimal("100.00")
        booking_dict["total_amount"] = float(base_price * 2) # Default 2 nights

    db_booking = models.Booking(**booking_dict)
    db.add(db_booking)

    # 4. Mark room as occupied
    room.status = "occupied"
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to commit booking: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error during booking creation")
        
    db.refresh(db_booking)
    return db_booking


@router.patch("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "cancelled"
    # Free the room
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if room:
        room.status = "available"

    db.commit()
    return {"message": "Booking cancelled successfully"}


@router.patch("/{booking_id}/checkout")
def checkout_booking(booking_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "checked_out"
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if room:
        room.status = "available"

    db.commit()
    return {"message": "Checkout completed successfully"}
@router.patch("/{booking_id}/pay")
def confirm_payment(booking_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.payment_status = "paid"
    booking.status = "confirmed"
    db.commit()
    return {"message": "Payment confirmed successfully", "status": "confirmed"}
