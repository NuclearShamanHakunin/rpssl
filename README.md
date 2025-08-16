# RPSSL

A full-stack web application for playing the classic game "Rock, Paper, Scissors, Lizard, Spock".

The project is fully containerized using Docker, making it easy to set up and run in different environments.

-----

## Tech Stack

  * **Backend**: A high-performance API built with **Python** and **FastAPI**. It uses **PostgreSQL** with **SQLAlchemy** for the database and **JWT** for authentication.
  * **Frontend**: A modern user interface created with **React**, **TypeScript**, and the **Material-UI** component library. The development server and build process are managed by **Vite**.
  * **Containerization**: The entire application stack (backend, frontend, database) is managed by **Docker Compose**, with separate profiles for development and production.

-----

## Getting Started

Ensure you have **Docker** and **Docker Compose** installed on your system.

### Development Mode

This mode enables hot-reloading for both the frontend, making it ideal for development.

1.  Clone the repository.
2.  Run the following command from the project root:
    ```bash
    docker-compose --profile dev up --build
    ```
3.  Access the application:
      * Frontend: `http://localhost:3000`
      * Backend API: `http://localhost:5000`

### Production Mode

This command builds the optimized frontend assets and runs the application in a production-like environment.

1.  Run the following command from the project root:

    ```bash
    docker-compose --profile prod up --build
    ```
    
2.  Access the application at `http://localhost:80`.

-----

### User Roles

The application features two distinct user roles:

* **Admin User**
    * **Default Credentials**: `admin` / `admin`
        * These can be changed during setup.
    * **Abilities**: This user is created automatically when the application starts. The admin has the unique ability to reset the high scores for all players from the main game page.
* **Player**
    * **Abilities**: Any user can register for a new account. Once logged in, they can play the game, and their scores will be tracked on the leaderboard.