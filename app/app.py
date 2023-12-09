from flask import Flask, render_template

app = Flask(__name__)

app.config['STATIC_FOLDER'] = 'static'

# routes here
@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000)