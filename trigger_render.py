import urllib.request
import json
RENDER_TOKEN = 'rnd_PzmSXA96d0fb8n63L2lO3owRNyIB'
services = ['srv-d79kbbggjchc73fm13d0', 'srv-d731accg9agc73bs4glg']

for srv in services:
    url = f'https://api.render.com/v1/services/{srv}/deploys'
    headers = {'Authorization': f'Bearer {RENDER_TOKEN}', 'Accept': 'application/json', 'Content-Type': 'application/json'}
    req = urllib.request.Request(url, data=b"{}", headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f'Triggered deploy for {srv}:', data.get('id', 'Success'))
    except Exception as e:
        print(f"Error for {srv}: {e}")
