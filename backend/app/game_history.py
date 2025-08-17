from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, ForeignKey, desc, Text, func, delete
from sqlalchemy.orm import relationship
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from .database import Base, get_db
from .user import User


router = APIRouter()


class GameHistory(Base):
    __tablename__ = "game_history"
    id = Column(Integer, primary_key=True)
    result_string = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="game_history")


class GameHistoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_last_10_by_user_id(self, user_id: int):
        result = await self.db.execute(
            select(GameHistory)
            .where(GameHistory.user_id == user_id)
            .order_by(desc(GameHistory.id))
            .limit(10)
        )
        return result.scalars().all()

    async def get_last_10_global(self):
        result = await self.db.execute(
            select(GameHistory).order_by(desc(GameHistory.id)).limit(10)
        )
        return result.scalars().all()

    async def add_game_history(self, user_id: int, result_string: str):
        count_result = await self.db.execute(
            select(func.count(GameHistory.id)).where(GameHistory.user_id == user_id)
        )
        count = count_result.scalar_one()

        if count >= 10:
            oldest_game_result = await self.db.execute(
                select(GameHistory)
                .where(GameHistory.user_id == user_id)
                .order_by(GameHistory.id.asc())
                .limit(1)
            )
            oldest_game = oldest_game_result.scalars().first()
            if oldest_game:
                await self.db.delete(oldest_game)

        new_history = GameHistory(user_id=user_id, result_string=result_string)
        self.db.add(new_history)
        await self.db.flush()
        return new_history
    
    async def reset_all(self):
        try:
            await self.db.execute(delete(GameHistory))
            await self.db.commit()
            return True
        except Exception:
            await self.db.rollback()
            return False


@router.get("/gamehistory")
async def get_game_history(db: AsyncSession = Depends(get_db)):
    repo = GameHistoryRepository(db)
    history_data = await repo.get_last_10_global()
    if not history_data:
        return []
    return [{"result": h.result_string} for h in history_data]


@router.post("/gamehistory/reset")
async def reset_game_history(db: AsyncSession = Depends(get_db)):
    repo = GameHistoryRepository(db)
    success = await repo.reset_all()
    if success:
        return {"message": "Game history has been successfully reset."}
    else:
        raise HTTPException(
            status_code=500, detail="Failed to reset game history."
        )