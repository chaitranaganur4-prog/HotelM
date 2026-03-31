import sys
import os

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

def seed():
    db = SessionLocal()
    try:
        # 1. Create Room Types
        types = [
            {"name": "Standard Single", "base_price": 80.00, "capacity": 1, "description": "Cozy room for one."},
            {"name": "Standard Double", "base_price": 110.00, "capacity": 2, "description": "Comfortable room for two."},
            {"name": "Deluxe Double", "base_price": 150.00, "capacity": 2, "description": "Spacious room with better view."},
            {"name": "Suite", "base_price": 250.00, "capacity": 4, "description": "Luxury living room + bedroom."},
            {"name": "Premium Suite", "base_price": 400.00, "capacity": 4, "description": "Top floor luxury with private bar."},
        ]
        
        db_types = []
        for t in types:
            existing = db.query(models.RoomType).filter(models.RoomType.name == t["name"]).first()
            if not existing:
                new_type = models.RoomType(**t)
                db.add(new_type)
                db_types.append(new_type)
                print(f"Added room type: {t['name']}")
            else:
                db_types.append(existing)

        db.commit()

        # 2. Add Rooms
        # Map types for easy access
        type_map = {t.name: t.id for t in db_types}
        
        rooms = [
            # Floor 1
            {"room_number": "101", "room_type_id": type_map["Standard Single"], "floor": 1},
            {"room_number": "102", "room_type_id": type_map["Standard Double"], "floor": 1},
            {"room_number": "103", "room_type_id": type_map["Standard Single"], "floor": 1},
            {"room_number": "104", "room_type_id": type_map["Deluxe Double"], "floor": 1},
            # Floor 2
            {"room_number": "201", "room_type_id": type_map["Deluxe Double"], "floor": 2},
            {"room_number": "202", "room_type_id": type_map["Suite"], "floor": 2},
            {"room_number": "203", "room_type_id": type_map["Standard Single"], "floor": 2},
            {"room_number": "204", "room_type_id": type_map["Deluxe Double"], "floor": 2},
            # Floor 3
            {"room_number": "301", "room_type_id": type_map["Suite"], "floor": 3},
            {"room_number": "302", "room_type_id": type_map["Deluxe Double"], "floor": 3},
            {"room_number": "303", "room_type_id": type_map["Suite"], "floor": 3},
            {"room_number": "304", "room_type_id": type_map["Standard Double"], "floor": 3},
            # Floor 4
            {"room_number": "401", "room_type_id": type_map["Premium Suite"], "floor": 4},
            {"room_number": "402", "room_type_id": type_map["Premium Suite"], "floor": 4, "status": "occupied"},
            {"room_number": "403", "room_type_id": type_map["Premium Suite"], "floor": 4},
        ]

        for r in rooms:
            existing = db.query(models.Room).filter(models.Room.room_number == r["room_number"]).first()
            if not existing:
                db.add(models.Room(**r))
                print(f"Added room: {r['room_number']}")
        
        db.commit()
        print("Seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
