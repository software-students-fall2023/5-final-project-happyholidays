# tests goes here 
import pytest
from unittest.mock import patch
import db
from app import create_app

@pytest.fixture
def app():
    app_instance = create_app()
    app_instance.config["TESTING"] = True
    return app_instance

@pytest.fixture
def client(app):
    """Create client for testing."""
    return app.test_client()

# Testing Flask routes
def test_index(client):
    """Test index page."""
    response = client.get("/")
    assert response.status_code == 200

def test_get_card_list(client):
    """Test the getCardList route."""
    response = client.get("/getCardList")
    assert response.status_code == 200
    assert 'cards' in response.json
    assert isinstance(response.json['cards'], list)

def test_get_card_list_error(client):
    """Test error scenario for getCardList route."""
    with patch('os.listdir', side_effect=Exception("Error reading directory")):
        response = client.get("/getCardList")
        assert response.status_code == 500
        assert 'error' in response.json

def test_add_record(client):
    """Test the addRecord route."""
    test_data = {'player': 'TestPlayer', 'time': '00:01:23'}
    response = client.post("/addRecord", json=test_data)
    assert response.status_code == 200
    assert response.json['message'] == 'new record added'

def test_add_record_error(client):
    """Test error scenario for addRecord route with invalid data."""
    test_data = {'invalid': 'data'}
    response = client.post("/addRecord", json=test_data)
    assert response.status_code == 400

def test_get_record(client):
    """Test the getRecord route."""
    response = client.get("/getRecord")
    assert response.status_code == 200
    assert 'records' in response.json
    assert isinstance(response.json['records'], list)

def test_get_record_empty(client):
    """Test getRecord route when no records are present."""
    with patch('db.get_leading_board', return_value=[]):
        response = client.get("/getRecord")
        assert response.status_code == 200
        assert response.json['records'] == []

# Mocking MongoDB interactions
@patch('db.MongoClient')
def test_save_to_leading_board(mock_mongo):
    """Test saving to the leaderboard."""
    db.save_to_leading_board('TestPlayer', '00:01:23')
    mock_mongo.assert_called_once_with("mongodb://db:27017")

@patch('db.MongoClient')
def test_get_leading_board(mock_mongo):
    """Test getting the leaderboard."""
    db.get_leading_board()
    mock_mongo.assert_called_once_with("mongodb://db:27017")

@patch('db.MongoClient')
def test_get_leading_board_empty(mock_mongo):
    """Test getting an empty leaderboard."""
    with patch('db.collection.find', return_value=[]):
        records = db.get_leading_board()
        assert records == []
        mock_mongo.assert_called_once_with("mongodb://db:27017")
