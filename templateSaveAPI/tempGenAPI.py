import requests

url = "https://x7edkhpsp5.execute-api.us-east-1.amazonaws.com/stage/modelapi"
data = {
    "promt": "create letter for client on credit card due date"
}

response = requests.post(url, json=data)

if response.status_code == 200:
    print("API call successful!")
    print(response.json())
else:
    print("API call failed!")
    print(response.text)