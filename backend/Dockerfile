FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./app ./app

EXPOSE 5000
CMD [ "python", "-m", "uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "5000" ]
 