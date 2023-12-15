#tests goes here 
import pytest
import db
from app import create_app

@pytest.fixture
def app():
    app_instance = create_app()
    app_instance.config["TESTING"] = True
    return app_instance

@pytest.fixture
def client(app):
    """create client"""
    return app.test_client()

def test_index(client):
    """test index page"""
    response = client.get("/")
    assert response.status_code == 200