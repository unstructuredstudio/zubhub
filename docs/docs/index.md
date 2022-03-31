# Quick Start

- Welcome to the Zubhub Dev Docs ! This page will walk you through how to Setup your Developer Environment and Run ZubHub on your local machine.

> Requirements 

> * git 
> * Docker and Docker Compose     

**Cloning Repo**: clone the Zubhub Repo using the following commands

```git
git clone https://github.com/FNNDSC/ChRIS_ui.git
```

**Change** the **Directory** to the zubhub folder using:

```bash
cd zubhub
```

### Backend:

- Change directory to `./zubhub_backend`

- Run `make init` to do all the initial setups required and start the server. `make init` generates the minimal .env file required to run the backend, 
  spins-up all containers defined in the backend docker-compose file,
  applies all necessary migrations to the database,
  and creates a default admin user with 
  username and password of dummy and dummy_password respectively.
  
  Subsequently to start and stop the docker containers, use `make start`, `make stop`, or `make down`. (run `make help` to see all the available make commands).

- Visit `localhost:8000` on your browser to access the API documentation.

### Frontend:

Go inside the Frontend directory by running commands

```bash
cd ..  
```

```bash
cd zubhub_frontend/zubhub
```

- Create a file named .env in the frontend  folder (same directory with package.json)
- Copy the content of .env.example and paste into the new .env file.
- Run `make start` to spin up the frontend container.
- Visit `localhost:3000` on your browser to access the frontend.