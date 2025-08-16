from enum import Enum
from pydantic import BaseModel


class GameResult(str, Enum):
    WIN = "win"
    LOSE = "lose"
    TIE = "tie"


class UserType(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserCreate(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    username: str
    wins: int
    losses: int


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
    user_type: UserType | None = None


class PlayRequest(BaseModel):
    player: int


class PlayResponse(BaseModel):
    results: GameResult
    player: int
    computer: int
