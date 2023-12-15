from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from datetime import datetime
import db 
import os

app = Flask(__name__)
CORS(app) 
app.config['STATIC_FOLDER'] = 'static'

# routes here
@app.route('/')
def index():
    print('connected')
    return render_template('index.html')
@app.route('/getCardList')
def get_card_list(directory_path = 'static/images/cards'):
    # api to reads all card names
    try:
        files = os.listdir(directory_path)
        print('accessed card list')
        return jsonify({'cards': files})
    except Exception as e:
        print(f"Error reading directory: {e}")
        return jsonify({'error': e}), 500
@app.route('/addRecord', methods=['POST'])
def addNewRecord():
    #return jsonify({'new_record':'good'})
    data = request.get_json()
    player = data.get('player')
    time = data.get('time')
    new_record = db.save_to_leading_board(player,time)
    return jsonify({'message':'new record added'})
@app.route('/getRecord', methods=['GET'])
def getAllRecord():
    records = db.get_leading_board()
    sorted_records = sorted(records, key=lambda x: datetime.strptime(x['record'], '%H:%M:%S'))
    return jsonify({'records':sorted_records[:10]})

def create_app():
    """return an app object"""
    return app

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000)