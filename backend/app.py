import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

@app.route('/api')
def hello():
    return "Hello from the backend!"

if __name__ == '__main__':
    app.run(host='0.0.0.0')
