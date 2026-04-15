import os
import sys
import psycopg2
from dotenv import load_dotenv

# Path to backend .env
env_path = os.path.join(os.getcwd(), 'backend', '.env')
load_dotenv(env_path)

db_url = os.getenv('DATABASE_URL')

if not db_url:
    print("DATABASE_URL not found")
    exit(1)

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    print("Clearing all bookings...")
    cur.execute("DELETE FROM bookings;")
    
    print("Clearing all guests...")
    cur.execute("DELETE FROM guests;")
    
    conn.commit()
    print("Cleanup successful. All guest and booking records have been removed.")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
    if conn:
        conn.rollback()
