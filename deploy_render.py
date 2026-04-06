import urllib.request
import json
import sys

RENDER_TOKEN = "rnd_PzmSXA96d0fb8n63L2lO3owRNyIB"
GITHUB_REPO = "https://github.com/chaitranaganur4-prog/HotelM"
NEON_DB_URL = "postgresql://neondb_owner:npg_NEdwTSRF53zt@ep-twilight-rain-an9eno1t-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def get_owner_id():
    url = "https://api.render.com/v1/owners"
    headers = {"Authorization": f"Bearer {RENDER_TOKEN}", "Accept": "application/json"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            owners = json.loads(resp.read().decode())
            if owners:
                return owners[0]["owner"]["id"]
    except Exception as e:
        print(f"Error getting owner: {e}")
    return None

def create_service(owner_id):
    url = "https://api.render.com/v1/services"
    headers = {
        "Authorization": f"Bearer {RENDER_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "type": "web_service",
        "name": "hotelm-backend",
        "ownerId": owner_id,
        "repo": GITHUB_REPO,
        "branch": "main",
        "autoDeploy": "yes",
        "serviceDetails": {
            "env": "python",
            "envSpecificDetails": {
                "buildCommand": "pip install -r backend/requirements.txt",
                "startCommand": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
            },
            "region": "oregon",
            "plan": "free",
            "envVars": [
                {"key": "DATABASE_URL", "value": NEON_DB_URL},
                {"key": "SECRET_KEY", "value": "hotelm_super_secret_key_2026"},
                {"key": "CORS_ORIGINS", "value": "*"}
            ]
        }
    }
    try:
        data = json.dumps(payload).encode()
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode())
            print(f"✅ Success! Service created on Render:")
            print(f"   URL: {res.get('service', {}).get('serviceDetails', {}).get('url')}")
            return True
    except urllib.error.HTTPError as e:
        print(f"❌ Failed! HTTP {e.code}")
        print(e.read().decode())
    except Exception as e:
        print(f"❌ Error: {e}")
    return False

if __name__ == "__main__":
    owner_id = get_owner_id()
    if owner_id:
        create_service(owner_id)
    else:
        print("Could not find owner ID")
