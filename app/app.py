from flask import Flask, render_template, jsonify, request
from datetime import datetime
import db 
import os

app = Flask(__name__)

app.config['STATIC_FOLDER'] = 'static'

# routes here
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/getCardList')
def get_card_list(directory_path = 'app/static/images/cards'):
    # api to reads all card names
    try:
        files = os.listdir(directory_path)
        return jsonify({'cards': files})
    except Exception as e:
        print(f"Error reading directory: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
@app.route('/addRecord', methods=['POST'])
def addNewRecord():
    return jsonify({'new_record':'good'})
    '''data = request.get_json()
    player = data.get('player')
    time = data.get('time')
    new_record = db.save_to_leading_board(player,time)
    return jsonify({'new_record':new_record})'''
@app.route('/getRecord', methods=['GET'])
def getAllRecord():
    records = db.get_leading_board()
    sorted_records = sorted(records, key=lambda x: datetime.strptime(x['time'], '%H:%M:%S'))
    return jsonify({'records':sorted_records[:10]})
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000)