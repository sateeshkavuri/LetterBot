import json
import requests

def lambda_handler(event, context):
    url = "https://x7edkhpsp5.execute-api.us-east-1.amazonaws.com/stage/modelapi"
    data = {
        "promt": event['promt']
    }
    
    response = requests.post(url, json=data)
    
    return {
        'statusCode': response.status_code,
        'body': response.json()
    }

