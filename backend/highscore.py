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

    @staticmethod
    def get_top(limit=10):
        from .user import User
        try:
            return Highscore.query.join(User).order_by((Highscore.wins - Highscore.losses).desc()).limit(limit).all()
        except Exception:
            return None
    
    @staticmethod
    def reset_all():
        try:
            Highscore.query.update({Highscore.wins: 0, Highscore.losses: 0})
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
