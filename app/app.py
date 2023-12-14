from flask import Flask, render_template, jsonify
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

    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000)