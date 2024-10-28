import requests
import json

def generate_ollama_request(
        prompt_system: str,
        prompt_user: str,
        ollama_api_url: str,
        model_options: dict = None,  # Default to None
        request_options: dict = None,  # Default to None
        response_format: str = None,
        seed: int = None,
        model: str = "llama3.2:1b",
        bearer_token: str = None
    ):
    
    ollama_api_endpoint = f"{ollama_api_url}/api/generate/"

    # Ensure options is a dictionary (default empty dictionary if None)
    if model_options is None:
        model_options = {}

    if request_options is None:
        request_options = {}
    
    headers = {'Content-Type': 'application/json'}
    
    # Handle the bearer token with special character encoding
    if bearer_token:
        utf8_bytes = f'Bearer {bearer_token}'.encode('utf-8')
        auth_header_value = utf8_bytes.decode('latin1')
        headers['Authorization'] = auth_header_value

    if response_format not in ['json',None]:
        print('Please select a correct output format, json or None. App select None by default')
        response_format = None
    # Build the data payload
    data = {
        "model": model,
        "system": prompt_system,
        "prompt": prompt_user,
        "stream": False,
        "format": response_format,
        "options": {
            "seed": seed,
            "top_k": model_options.get('top_k', 20),
            "top_p": model_options.get('top_p', 0.9),
            "temperature": model_options.get('temperature', 0.8),
            "repeat_penalty": model_options.get('repeat_penalty', 1.2),
            "presence_penalty": model_options.get('presence_penalty', 1.5),
            "frequency_penalty": model_options.get('frequency_penalty', 1.0),
            "num_ctx": request_options.get('num_ctx', 16384),
            "num_predict": request_options.get('num_predict', 32),
            "batch_size":request_options.get('num_predict', 128),
        }
    }

    try:
        response = requests.post(ollama_api_endpoint, data=json.dumps(data), headers=headers)
        # print(f"Status Code: {response.status_code}")
        # print(f"Response Text: {response.text}")
        return response.json() if response.status_code == 200 else None
    except Exception as error:
        print('-----------------------------------------')
        print('Something went wrong when calling Ollama')
        print(error)
        return None
    
def embeding_ollama_request(
        ollama_api_url: str,
        text_input: str,
        model: str = "llama3.2:1b",
        bearer_token: str = None
    ):

    ollama_api_endpoint = f"{ollama_api_url}/api/embed/"
    
    headers = {'Content-Type': 'application/json'}
    
    # Handle the bearer token with special character encoding
    if bearer_token:
        utf8_bytes = f'Bearer {bearer_token}'.encode('utf-8')
        auth_header_value = utf8_bytes.decode('latin1')
        headers['Authorization'] = auth_header_value
    # Build the data payload
    data = {
        "model": model,
        "input": text_input
    }

    try:
        response = requests.post(ollama_api_endpoint, data=json.dumps(data), headers=headers)
        # print(f"Status Code: {response.status_code}")
        # print(f"Response Text: {response.text}")
        return response.json() if response.status_code == 200 else None
    except Exception as error:
        print('-----------------------------------------')
        print('Something went wrong when calling Ollama')
        print(error)
        return None