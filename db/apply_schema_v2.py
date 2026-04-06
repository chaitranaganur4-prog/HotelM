import psycopg2
import sys
import os

def apply_schema(connection_string, schema_file):
    try:
        conn = psycopg2.connect(connection_string)
        curr = conn.cursor()
        
        with open(schema_file, 'r') as f:
            schema_sql = f.read()
            
        curr.execute(schema_sql)
        conn.commit()
        print("✅ Schema applied successfully!")
        
        # Add sample staff/user profile
        # Password hash for 'password123' (using a common bcrypt hash for testing)
        password_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36XUfP.FWh6Tf4f.Nf.f.u."
        
        curr.execute("""
            INSERT INTO staff (first_name, last_name, email, role, password_hash)
            VALUES ('Admin', 'User', 'admin@hotelm.com', 'admin', %s)
            ON CONFLICT (email) DO NOTHING;
        """, (password_hash,))
        
        curr.execute("""
            INSERT INTO users (email, password_hash, role)
            VALUES ('admin@hotelm.com', %s, 'admin')
            ON CONFLICT (email) DO NOTHING;
        """, (password_hash,))
        
        conn.commit()
        print("✅ Sample user profiles created!")
        
        curr.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    db_url = "postgresql://hotelm_admin:HotelMPassword2026@ep-fragrant-recipe-anxkxifu.c-6.us-east-1.aws.neon.tech/HotelM?sslmode=require"
    schema_path = "c:\\Hotel M\\db\\schema.sql"
    apply_schema(db_url, schema_path)
