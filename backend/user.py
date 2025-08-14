from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(256))
    highscore = relationship('Highscore', back_populates='user', uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(
            password,
            method='pbkdf2:sha256',
            salt_length=16
        )

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
