from sqlalchemy import Column, Integer, ForeignKey, desc
from sqlalchemy.orm import relationship
from sqlalchemy.future import select
from .database import Base
from .user import User
from sqlalchemy.ext.asyncio import AsyncSession

class Highscore(Base):
    __tablename__ = 'highscore'
    id = Column(Integer, primary_key=True)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    user = relationship('User', back_populates='highscore')

    def add_win(self):
        self.wins += 1

    def add_loss(self):
        self.losses += 1

    @staticmethod
    async def get_top(db: AsyncSession, limit: int = 10):
        try:
            result = await db.execute(
                select(Highscore)
                .join(User)
                .order_by(desc(Highscore.wins - Highscore.losses))
                .limit(limit)
            )
            return result.scalars().all()
        except Exception:
            return None

    @staticmethod
    async def reset_all(db: AsyncSession):
        try:
            await db.execute(
                Highscore.__table__.update().values(wins=0, losses=0)
            )
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            return False
