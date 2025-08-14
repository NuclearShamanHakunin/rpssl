from .database import db

class Highscore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='highscore')

    def add_win(self):
        self.wins += 1

    def add_loss(self):
        self.losses += 1
