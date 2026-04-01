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
    guest_id: int
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
    # Verify room is available
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status != "available":
        raise HTTPException(status_code=400, detail="Room is not available")

    db_booking = models.Booking(**booking.model_dump())
    db.add(db_booking)

    # Mark room as occupied
    room.status = "occupied"
    db.commit()
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
