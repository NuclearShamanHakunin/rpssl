import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

@app.route('/api')
def hello():
    return "Hello from the backend!"


@app.route('/choices', methods=['GET'])
def get_choices():
    return []


@app.route('/choice', methods=['GET'])
def get_choice():
    return ""


@app.route('/play', methods=['POST'])
def play():
    return ""


if __name__ == '__main__':
    app.run(host='0.0.0.0')
