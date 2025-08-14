import os
from flask import Flask, request, session, jsonify
from .database import db
from .user import User
from .highscore import Highscore


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
    db.session.flush() # get new .id

    new_highscore = Highscore(user_id=new_user.id)
    db.session.add(new_highscore)

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
    return jsonify({
        "username": user.username,
        "wins": user.highscore.wins,
        "losses": user.highscore.losses
    })


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


@app.route('/highscores', methods=['GET'])
def get_highscores():
    try:
        limit = int(request.args.get('limit', 10))
    except ValueError:
        return jsonify({"msg": "Invalid limit parameter"}), 400

    highscores_data = Highscore.get_top(limit)

    if highscores_data is None:
        return jsonify({"msg": "Failed to retrieve highscores."}), 500

    result = [
        {
            "username": hs.user.username,
            "wins": hs.wins,
            "losses": hs.losses
        } for hs in highscores_data
    ]
    return jsonify(result)


@app.route('/highscores/reset', methods=['POST'])
def reset_highscores():
    if Highscore.reset_all():
        return jsonify({"msg": "All highscores have been reset."})
    else:
        return jsonify({"msg": "Failed to reset highscores."}), 500


with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(host='0.0.0.0')
