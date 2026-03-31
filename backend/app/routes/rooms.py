"""
Hotel M — Room Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


# --- Pydantic Schemas ---

class RoomTypeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    base_price: float
    capacity: int

    class Config:
        from_attributes = True


class RoomTypeInfo(BaseModel):
    name: str
    base_price: float
    capacity: int

    class Config:
        from_attributes = True


class RoomResponse(BaseModel):
    id: int
    room_number: str
    room_type_id: int
    floor: Optional[int] = None
    status: str
    room_type: Optional[RoomTypeInfo] = None

    class Config:
        from_attributes = True


# --- Endpoints ---

@router.get("/", response_model=list[RoomResponse])
def get_rooms(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Room)
    if status:
        query = query.filter(models.Room.status == status)
    return query.all()


@router.get("/types", response_model=list[RoomTypeResponse])
def get_room_types(db: Session = Depends(get_db)):
    return db.query(models.RoomType).all()


@router.get("/{room_id}", response_model=RoomResponse)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.patch("/{room_id}/status")
def update_room_status(room_id: int, status: str, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room.status = status
    db.commit()
    return {"message": f"Room {room.room_number} status updated to {status}"}
