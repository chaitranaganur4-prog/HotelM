import urllib.request
import json
RENDER_TOKEN = 'rnd_PzmSXA96d0fb8n63L2lO3owRNyIB'
url = 'https://api.render.com/v1/services'
headers = {'Authorization': f'Bearer {RENDER_TOKEN}', 'Accept': 'application/json'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        services = json.loads(resp.read().decode())
        for s in services:
            print(s['service']['name'], s['service']['id'])
except Exception as e:
    print("Error:", e)
