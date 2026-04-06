import psycopg2
import sys

db_url = "postgresql://neondb_owner:npg_UuVFmfTn40hj@ep-fragrant-recipe-anxkxifu-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def apply_schema():
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        with open('db/schema.sql', 'r') as f:
            schema_sql = f.read()
            
        print("Applying schema...")
        cur.execute(schema_sql)
        conn.commit()
        print("Schema applied successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    apply_schema()
