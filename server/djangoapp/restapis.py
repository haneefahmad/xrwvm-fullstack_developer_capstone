import os
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv('backend_url', default='http://localhost:3030')
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default='http://localhost:5050/',
)
searchcars_url = os.getenv(
    'searchcars_url',
    default='http://localhost:3050/',
)


def get_request(endpoint, **kwargs):
    request_url = f"{backend_url}{endpoint}"
    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url, params=kwargs if kwargs else None, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print('Network exception occurred')
        return []


def searchcars_request(endpoint, **kwargs):
    request_url = f"{searchcars_url}{endpoint}"
    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url, params=kwargs if kwargs else None, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print('Network exception occurred')
        return []


def analyze_review_sentiments(text):
    encoded_text = quote(text, safe='')
    request_url = f"{sentiment_analyzer_url}analyze/{encoded_text}"
    try:
        response = requests.get(request_url, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print('Network exception occurred')
        return {'sentiment': 'neutral'}


def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=15)
        response.raise_for_status()
        print(response.json())
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print('Network exception occurred')
        return None
