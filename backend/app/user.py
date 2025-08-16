import bcrypt
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from .database import Base
from enum import Enum


class UserType(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(256))
    user_type = Column(Enum(UserType), nullable=False, default=UserType.USER)
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
