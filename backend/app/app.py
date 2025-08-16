from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .database import get_db, engine, Base, SessionLocal
from .highscore import Highscore
from .auth import router as auth_router
from .game import router as game_router
from .user import router as user_router, User, UserType, get_current_user
from .config import ADMIN_USERNAME, ADMIN_PASSWORD


app = FastAPI()
app.include_router(auth_router)
app.include_router(game_router)
app.include_router(user_router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.username == ADMIN_USERNAME))
        db_user = result.scalars().first()
        if not db_user:
            admin_user = User(username=ADMIN_USERNAME, user_type=UserType.ADMIN)
            admin_user.set_password(ADMIN_PASSWORD)
            session.add(admin_user)
            await session.flush()

            new_highscore = Highscore(user_id=admin_user.id)
            session.add(new_highscore)

            await session.commit()


@app.get("/api")
def hello():
    return "Hello from the backend!"


@app.get("/highscores")
async def get_highscores(limit: int = 10, db: AsyncSession = Depends(get_db)):
    highscores_data = await Highscore.get_top(db, limit)
    if highscores_data is None:
        raise HTTPException(status_code=500, detail="Failed to retrieve highscores.")
    
    return [
        {
            "username": hs.user.username,
            "wins": hs.wins,
            "losses": hs.losses
        } for hs in highscores_data
    ]


@app.post("/highscores/reset")
async def reset_highscores(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_type != UserType.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to reset highscores")
    if await Highscore.reset_all(db):
        return {"msg": "All highscores have been reset."}
    else:
        raise HTTPException(status_code=500, detail="Failed to reset highscores.")
