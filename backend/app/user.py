import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Column, Integer, String, Enum as SQLAlchemyEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship
from sqlalchemy.future import select
from jose import JWTError, jwt
from enum import Enum


from .database import Base, get_db
from .config import SECRET_KEY, ALGORITHM
from .schemas import TokenData, UserOut


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserType(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


router = APIRouter()


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(256))
    user_type = Column(SQLAlchemyEnum(UserType), nullable=False, default=UserType.USER)
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


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        user_type: str = payload.get("user_type")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, user_type=user_type)
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.username == token_data.username))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception
    return user


@router.get("/profile", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "wins": current_user.highscore.wins,
        "losses": current_user.highscore.losses,
    }
