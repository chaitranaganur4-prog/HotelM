import psycopg2
import os
from dotenv import load_dotenv

# Load from backend/ folder specifically
load_dotenv(dotenv_path="backend/.env")
db_url = os.getenv("DATABASE_URL")
print(f"Testing connection to: {db_url}")

if not db_url:
    print("DATABASE_URL not found in backend/.env")
    exit(1)

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print(f"Connection successful! {cur.fetchone()[0]}")
    
    # Check if tables exist
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = cur.fetchall()
    print(f"Tables found: {[t[0] for t in tables]}")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
