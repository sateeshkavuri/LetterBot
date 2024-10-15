import boto3
import json
import logging

from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def generate_message(bedrock_runtime, model_id, system_prompt, messages, max_tokens):

    body=json.dumps(
        {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "system": system_prompt,
            "messages": messages
        }  
    )  

    
    response = bedrock_runtime.invoke_model(body=body, modelId=model_id)
    response_body = json.loads(response.get('body').read())
   
    return response_body


def main(promt):
    """
    Entrypoint for Anthropic Claude message example.
    """

    try:

        bedrock_runtime = boto3.client(service_name='bedrock-runtime')

        model_id = 'anthropic.claude-v2:1'
        system_prompt = ""
        max_tokens = 1000

        # Prompt with user turn only.
        user_message =  {"role": "user", "content": promt}
        messages = [user_message]

        response = generate_message (bedrock_runtime, model_id, system_prompt, messages, max_tokens)
        print("User turn only.")
        print(json.dumps(response, indent=4))

        # Prompt with both user turn and prefilled assistant response.
        #Anthropic Claude continues by using the prefilled assistant text.
        assistant_message =  {"role": "assistant", "content": "<emoji>"}
        messages = [user_message, assistant_message]
        response = generate_message(bedrock_runtime, model_id,system_prompt, messages, max_tokens)
        #print("User turn and prefilled assistant response.")
        #print(json.dumps(response, indent=4))
        return {         # <---- RETURN THIS RIGHT AWAY
            'statusCode': 200,
            'body': json.dumps(response, indent=4)
        } 

    except ClientError as err:
        message=err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        print("A client error occured: " +
            format(message))
        return {         # <---- RETURN THIS RIGHT AWAY
            'statusCode': 500,
            'body': format(message)
        } 



def lambda_handler(event, context):
   data =  main(event["promt"])
   return data
