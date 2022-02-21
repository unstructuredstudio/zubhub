# Welcome to Zubhub!
follow the instructions below to set up your local development environment.

## Backend
- cd into ./zubhub_backend
- run `make init` to do all the initial setups required and start the server.
  `make init` generates the minimal .env file required to run the backend, 
  spins-up all containers defined in the backend docker-compose file,
  applies all necessary migrations to the database,
  and creates a default admin user with 
  username and password of dummy and dummy_password respectively.

  Subsequently to start and stop the docker containers, use `make start`, `make stop`, or `make down`. (run `make help` to see all the available make commands).
- visit `localhost:8000` on your browser to access the API documentation.

## Frontend
- Create a file named .env in the frontend root folder (same directory with package.json)
- Copy the content of .env.example and paste into the new .env file.
- Run `make start` to spin up the frontend container.
- visit `localhost:3000` on your browser to access the frontend.


## To View the documentation, see:
- [Architecture Overview](./zubhub_backend/zubhub/docs/overview.md)
- [Web Server](./zubhub_backend/zubhub/docs/web_container.md)
- [Media Server](./zubhub_backend/zubhub/docs/media_container.md)
- [Database and ER Diagram](./zubhub_backend/zubhub/docs/others.md)
- [Background Tasks](./zubhub_backend/zubhub/docs/others.md)
- [Reverse-Proxy](./zubhub_backend/zubhub/docs/others.md)

> **_NOTE:_** If you are interested in the API documentation instead, you need to follow the [instruction](#backend) above about running the backend on your local machine and afterward visit `localhost:8000` on your browser to view the API documentation.