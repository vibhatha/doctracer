import pytest
from flask import Flask


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_extract_text_endpoint(client):
    # Define the payload with a sample PDF URL
    payload = {
        'pdf_url': 'http://documents.gov.lk/files/egz/2020/12/2205-14_E.pdf'
    }
    
    # Send a POST request to the /extract-text endpoint
    response = client.post('/extract-text', json=payload)
    
    # Assert the response status code
    assert response.status_code == 200
    
    # Assert the response contains the expected data
    data = response.get_json()
    assert 'text' in data
    assert isinstance(data['text'], str)


