from fastapi import FastAPI
from .database import engine, Base, SessionLocal
from .highscore import Highscore, router as highscore_router
from .auth import router as auth_router
from .game import router as game_router
from .user import router as user_router, User, UserType, UserRepository
from .config import ADMIN_USERNAME, ADMIN_PASSWORD


app = FastAPI()
app.include_router(auth_router)
app.include_router(game_router)
app.include_router(user_router)
app.include_router(highscore_router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        repo = UserRepository(session)
        db_user = await repo.get_by_username(ADMIN_USERNAME)
        if not db_user:
            admin_user = User(username=ADMIN_USERNAME, user_type=UserType.ADMIN)
            admin_user.set_password(ADMIN_PASSWORD)
            admin_user = await repo.create(admin_user)

            new_highscore = Highscore(user_id=admin_user.id)
            session.add(new_highscore)

            await session.commit()
