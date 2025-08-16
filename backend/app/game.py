from fastapi import APIRouter

router = APIRouter()


@router.get("/choices")
async def get_choices():
    return ["rock", "paper", "scissors", "lizard", "spock"]


@router.get("/choice")
async def get_choice():
    return ""


@router.post("/play")
async def play():
    return ""
