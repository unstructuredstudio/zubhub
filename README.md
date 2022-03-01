![CI/CD](https://github.com/unstructuredstudio/zubhub/actions/workflows/build_deploy_backend.yml/badge.svg)

<img src="logo.png" width="350">

ZubHub is a free web platform that expands access to low-cost creative learning and collaboration opportunities globally to children in underserved communities.

It is available for custom use for your school, library, hackerspace, or educational organization. It can be hosted in low or no internet bandwidth locations to create a small virtual hub. These hubs can be interconnected to form an extensive distributed creative education network. You can think of it like [Mastodon](https://en.wikipedia.org/wiki/Mastodon_(software)) social-network but specifically intended for showcasing and collaborating on creative educational projects. Or maybe like [Hackaday.io](https://hackaday.io/), but for children :smiley:  

| ZubHub is currently in public beta. A public ZubHub instance is hosted here: https://zubhub.unstructured.studio |
| --- |

Zubhub is designed and developed by [Unstructured Studio](https://unstructured.studio), an educational non-profit organization incorporated in Canada and India. Want to know more about ZubHub and our feature roadmap? Head to 👉 [ZubHub Wiki](https://github.com/unstructuredstudio/zubhub/wiki)!

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

## Documentation
- [Architecture Overview](./zubhub_backend/zubhub/docs/overview.md)
- [Web Server](./zubhub_backend/zubhub/docs/web_container.md)
- [Media Server](./zubhub_backend/zubhub/docs/media_container.md)
- [Database and ER Diagram](./zubhub_backend/zubhub/docs/others.md)
- [Background Tasks](./zubhub_backend/zubhub/docs/others.md)
- [Reverse-Proxy](./zubhub_backend/zubhub/docs/others.md)

## Contributions
Contributions are welcome! We suggest you first go through the [Contribution Guidelines and Code of Conduct](CONTRIBUTING.md) and the [Feature Roadmap and Ideas](https://github.com/unstructuredstudio/zubhub/wiki/Feature-Roadmap-&-Ideas-2022) we have been working on. Search the Issues to see there are no duplicates or overlaps before filing new feature requests and bugs.  

> **_NOTE:_** If you are interested in the API documentation instead, you need to follow the [instructions](#backend) above about running the backend on your local machine and afterward visit `localhost:8000` on your browser to view the API documentation.
