import bcrypt
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(256))
    highscore = relationship(
        'Highscore', 
        back_populates='user', 
        uselist=False,
        lazy='joined'
    )

    def set_password(self, password: str):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password: str):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
