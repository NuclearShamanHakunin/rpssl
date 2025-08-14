import os
from flask import Flask, request, session, jsonify
from .database import db
from .user import User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_default_secret_key')
db.init_app(app)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({"msg": "Logged in successfully"})

    return jsonify({"msg": "Invalid username or password"}), 401


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({"msg": "Logged out successfully"})


@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return jsonify({"msg": "Unauthorized"}), 401

    user = User.query.get(session['user_id'])
    return jsonify({"username": user.username})


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


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0')
