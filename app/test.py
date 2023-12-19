# tests goes here 
import pytest
from unittest.mock import patch, MagicMock
import db
from app import create_app

@pytest.fixture
def app():
    app_instance = create_app()
    app_instance.config["TESTING"] = True
    return app_instance

@pytest.fixture
def client(app):
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
        assert response.json['error'] == "Error reading directory"

def test_add_record(client):
    """Test the addRecord route."""
    test_data = {'player': 'TestPlayer', 'time': '00:01:23'}
    with patch('db.save_to_leading_board', return_value=True):
        response = client.post("/addRecord", json=test_data)
        assert response.status_code == 200
        assert response.json['message'] == 'new record added'

def test_get_record(client):
    """Test the getRecord route."""
    with patch('db.get_leading_board', return_value=[]):
        response = client.get("/getRecord")
        assert response.status_code == 200
        assert 'records' in response.json
        assert response.json['records'] == []

# Mocking MongoDB interactions
@patch('db.collection.insert_one')
def test_save_to_leading_board(mock_insert_one):
    """Test saving to the leaderboard."""
    mock_insert_one.return_value = MagicMock()
    db.save_to_leading_board('TestPlayer', '00:01:23')
    mock_insert_one.assert_called_once()

@patch('db.collection.find')
def test_get_leading_board(mock_find):
    """Test getting the leaderboard."""
    mock_find.return_value = []
    records = db.get_leading_board()
    assert records == []
    mock_find.assert_called_once()
