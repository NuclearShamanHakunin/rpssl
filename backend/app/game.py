from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update

from .random_service import RandomServiceError, get_random_number
from .schemas import PlayRequest, PlayResponse, GameResult
from .user import User, get_current_user
from .database import get_db
from .highscore import Highscore


router = APIRouter()


VALID_CHOICES = [
    {
        "id": 0,
        "name": "rock", 
    },
    {
        "id": 1,
        "name": "paper", 
    },
    {
        "id": 2,
        "name": "scissors", 
    },
    {
        "id": 3,
        "name": "lizard", 
    },
    {
        "id": 4,
        "name": "spock"
    },
]


GAME_LOGIC = [
    [GameResult.TIE,  GameResult.LOSE, GameResult.WIN,  GameResult.WIN,  GameResult.LOSE],    
    [GameResult.WIN,  GameResult.TIE,  GameResult.LOSE, GameResult.LOSE, GameResult.WIN ],
    [GameResult.LOSE, GameResult.WIN,  GameResult.TIE,  GameResult.WIN,  GameResult.LOSE],
    [GameResult.LOSE, GameResult.WIN,  GameResult.LOSE, GameResult.TIE,  GameResult.WIN ],
    [GameResult.WIN, GameResult.LOSE,  GameResult.WIN,  GameResult.LOSE, GameResult.TIE ]
]


@router.get("/choices")
async def get_choices():
    return VALID_CHOICES


@router.get("/choice")
async def get_choice():
    try:
        choice_index = await get_random_number() % len(VALID_CHOICES)
        return VALID_CHOICES[choice_index]
    except RandomServiceError:
        raise HTTPException(status_code=503, detail="Service unavailable")


def calculate_winner(player_choice: int, computer_choice: int) -> str:
    return GAME_LOGIC[player_choice][computer_choice]


@router.post("/play", response_model=PlayResponse)
async def play(
    play_request: PlayRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        computer_choice = await get_random_number() % len(VALID_CHOICES)
    except RandomServiceError:
        raise HTTPException(status_code=503, detail="Service unavailable")

    result = calculate_winner(play_request.player, computer_choice)

    if result != GameResult.TIE:
        column_to_update = (
            "wins" if result == GameResult.WIN else "losses"
        )
        
        await db.execute(
            update(Highscore)
                .where(Highscore.user_id == current_user.id)
                .values({column_to_update: getattr(Highscore, column_to_update) + 1})
        )
        await db.commit()

    return {
        "results": result,
        "player": play_request.player,
        "computer": computer_choice,
    }