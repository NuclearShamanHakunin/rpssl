from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_db, engine, Base
from .highscore import Highscore
from . import auth

# FastAPI app
app = FastAPI()

app.include_router(auth.router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/api")
def hello():
    return "Hello from the backend!"

@app.get("/choices")
def get_choices():
    return []

@app.get("/choice")
def get_choice():
    return ""

@app.post("/play")
def play():
    return ""

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
async def reset_highscores(db: AsyncSession = Depends(get_db)):
    if await Highscore.reset_all(db):
        return {"msg": "All highscores have been reset."}
    else:
        raise HTTPException(status_code=500, detail="Failed to reset highscores.")
