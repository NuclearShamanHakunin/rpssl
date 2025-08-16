from fastapi import APIRouter
from .random_service import get_random_number

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


@router.get("/choices")
async def get_choices():
    return VALID_CHOICES


@router.get("/choice")
async def get_choice():
    random_number = await get_random_number()
    choice_index = random_number % len(VALID_CHOICES)
    return VALID_CHOICES[choice_index]


@router.post("/play")
async def play():
    return ""
