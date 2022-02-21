![CI/CD](https://github.com/unstructuredstudio/zubhub/workflows/build_deploy_backend.yml/badge.svg)

<img src="logo.png" width="350">

Zubhub, is a creative education and collaboration platform for young tinkerers, makers & creators. It can be hosted in low or no internet bandwidth locations to create a small virtual creative education Hub where makers creators can showcase and document what they have created, discuss, form workgroups and take part in workshops and events. These hubs can be inter-connected to form a large distributed creative education network.

|  **A live instance of ZubHub is available at https://zubhub.unstructured.studio**  | 
| --- | 

<img src="screenshot.png">

## Development
Follow the instructions below to set up your local development environment

### Backend
- Change directory to `./zubhub_backend`
- Run `make init` to do all the initial setups required and start the server.
  `make init` generates the minimal .env file required to run the backend, 
  spins-up all containers defined in the backend docker-compose file,
  applies all necessary migrations to the database,
  and creates a default admin user with 
  username and password of dummy and dummy_password respectively.

  Subsequently to start and stop the docker containers, use `make start`, `make stop`, or `make down`. (run `make help` to see all the available make commands).
- Visit `localhost:8000` on your browser to access the API documentation.

### Frontend
- Create a file named .env in the frontend root folder (same directory with package.json)
- Copy the content of .env.example and paste into the new .env file.
- Run `make start` to spin up the frontend container.
- Visit `localhost:3000` on your browser to access the frontend.

## Deployment
ZubHub is currently deployed on its main website using Github Actions that act as our build and deployment tooling. If you are interested in deploying Zubhub on your own VM for testing and hosting purposes, follow the [Single VM Deployment](single_vm_deployment) instructions.  

## Documentation:
Various components of Zubhub are presnr
- [Architecture Overview](./zubhub_backend/zubhub/docs/overview.md)
- [Web Server](./zubhub_backend/zubhub/docs/web_container.md)
- [Media Server](./zubhub_backend/zubhub/docs/media_container.md)
- [Database and ER Diagram](./zubhub_backend/zubhub/docs/others.md)
- [Background Tasks](./zubhub_backend/zubhub/docs/others.md)
- [Reverse-Proxy](./zubhub_backend/zubhub/docs/others.md)

## Contributions
Contributions are welcome! We suggest you first go through the [Contribution Guidelines and Code of Conduct](CONTRIBUTING.md) and the [Feature Roadmap and Ideas](https://github.com/unstructuredstudio/zubhub/wiki/Feature-Roadmap-&-Ideas-2022) we have been working on. Search the Issues to see there are no duplicates or overlaps before filing new feature requests and bugs.  

> **_NOTE:_** If you are interested in the API documentation instead, you need to follow the [instructions](#backend) above about running the backend on your local machine and afterward visit `localhost:8000` on your browser to view the API documentation.