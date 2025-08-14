import requests
import asyncio
from pydantic import BaseModel, ValidationError


NUMBER_OF_RETRIES = 3


class RandomNumber(BaseModel):
    random_number: int


class RandomServiceError(Exception):
    pass


async def get_random_number() -> int:
    for _ in range(NUMBER_OF_RETRIES):
        try:
            response = await asyncio.to_thread(requests.get, "https://codechallenge.boohma.com/random", timeout=5)
            response.raise_for_status()
            data = response.json()
            random_number_obj = RandomNumber(**data)
            return random_number_obj.random_number
        except (requests.exceptions.RequestException, ValidationError):
            await asyncio.sleep(0.05)
            continue

    raise RandomServiceError("Failed to get random number after 3 attempts.")
