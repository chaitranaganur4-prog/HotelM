import os
import psycopg2
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("Error: DATABASE_URL not found in environment variables.")
        return

    # Stripping channel_binding if present
    if "channel_binding" in db_url:
        import re
        db_url = re.sub(r'[?&]channel_binding=[^&]*', '', db_url)
        db_url = re.sub(r'[?&]$', '', db_url)
    
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print("Cleaning up bookings...")
        cur.execute("DELETE FROM bookings;")
        rows_deleted = cur.rowcount
        
        conn.commit()
        print(f"Successfully deleted {rows_deleted} bookings.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
