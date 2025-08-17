from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, ForeignKey, desc
from sqlalchemy.orm import relationship
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import UserType
from .database import Base, get_db
from .user import User, get_current_user


router = APIRouter()


class Highscore(Base):
    __tablename__ = "highscore"
    id = Column(Integer, primary_key=True)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="highscore", lazy="joined")

    def add_win(self):
        self.wins += 1

    def add_loss(self):
        self.losses += 1


class HighscoreRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_top(self, limit: int = 10):
        try:
            result = await self.db.execute(
                select(Highscore)
                .join(User)
                .order_by(desc(Highscore.wins - Highscore.losses))
                .limit(limit)
            )
            return result.scalars().all()
        except Exception:
            return None

    async def reset_all(self):
        try:
            await self.db.execute(Highscore.__table__.update().values(wins=0, losses=0))
            await self.db.commit()
            return True
        except Exception:
            await self.db.rollback()
            return False

    async def get_by_user_id(self, user_id: int) -> Highscore | None:
        result = await self.db.execute(
            select(Highscore).where(Highscore.user_id == user_id)
        )
        return result.scalars().first()


def get_highscore_repo(db: AsyncSession = Depends(get_db)) -> HighscoreRepository:
    return HighscoreRepository(db)


@router.get("/highscores")
async def get_highscores(
    limit: int = 10,
    repo: HighscoreRepository = Depends(get_highscore_repo),
):
    highscores_data = await repo.get_top(limit)
    if highscores_data is None:
        raise HTTPException(status_code=500, detail="Failed to retrieve highscores.")

    return [
        {"username": hs.user.username, "wins": hs.wins, "losses": hs.losses}
        for hs in highscores_data
    ]


@router.post("/highscores/reset")
async def reset_highscores(
    repo: HighscoreRepository = Depends(get_highscore_repo),
    current_user: User = Depends(get_current_user),
):
    if current_user.user_type != UserType.ADMIN:
        raise HTTPException(
            status_code=403, detail="Not authorized to reset highscores"
        )
    if await repo.reset_all():
        return {"msg": "All highscores have been reset."}
    else:
        raise HTTPException(status_code=500, detail="Failed to reset highscores.")
