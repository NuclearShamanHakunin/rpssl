import requests
from pydantic import BaseModel, ValidationError


class RandomNumber(BaseModel):
    random_number: int


class RandomServiceError(Exception):
    """Custom exception for errors from the random service."""
    pass


def get_random_number() -> int:
    """
    Fetches a random number from the remote service.
    Returns a RandomNumber object.
    Raises RandomServiceError on failure.
    """
    try:
        response = requests.get("https://codechallenge.boohma.com/random")
        response.raise_for_status()
        data = response.json()
        random_number_obj = RandomNumber(**data)

        return random_number_obj.random_number
    except requests.exceptions.HTTPError as e:
        raise RandomServiceError(f"HTTP error from random service: {e}") from e
    except requests.exceptions.RequestException as e:
        raise RandomServiceError(f"Failed to get random number: {e}") from e
    except ValidationError as e:
        raise RandomServiceError(f"Invalid data from random service: {e}") from e
