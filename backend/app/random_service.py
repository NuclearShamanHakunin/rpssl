import httpx
import asyncio
import json
from pydantic import BaseModel, Field, ValidationError


NUMBER_OF_RETRIES = 3
RETRY_TIMER_SECONDS = 0.25


class RandomNumber(BaseModel):
    random_number: int = Field(..., ge=1, le=100)


class RandomServiceError(Exception):
    pass


async def get_random_number() -> int:
    async with httpx.AsyncClient() as client:
        for _ in range(NUMBER_OF_RETRIES):
            try:
                response = await client.get(
                    "https://codechallenge.boohma.com/random", timeout=5
                )
                response.raise_for_status()
                data = response.json()
                random_number_obj = RandomNumber(**data)
                return random_number_obj.random_number
            except (
                httpx.RequestError,
                ValidationError,
                json.JSONDecodeError,
                httpx.HTTPStatusError,
            ):
                await asyncio.sleep(RETRY_TIMER_SECONDS)
                continue

        raise RandomServiceError("Failed to get random number after 3 attempts.")
