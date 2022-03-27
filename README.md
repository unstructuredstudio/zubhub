![CI/CD](https://github.com/unstructuredstudio/zubhub/actions/workflows/build_deploy_backend.yml/badge.svg)

<img src="logo.png" width="350">

ZubHub is a free web platform that expands access to low-cost creative learning and collaboration opportunities globally to children in underserved communities.

It is available for custom use for your school, library, hackerspace, or educational organization. It can be hosted in low or no internet bandwidth locations to create a small virtual hub. These hubs can be interconnected to form an extensive distributed creative education network. You can think of it like [Mastodon](https://en.wikipedia.org/wiki/Mastodon_(software)) social-network but specifically intended for showcasing and collaborating on creative educational projects. Or maybe like [Hackaday.io](https://hackaday.io/), but for children :smiley:  

| ZubHub is currently in public beta. A public ZubHub instance is hosted here: https://zubhub.unstructured.studio |
| --- |

Zubhub is designed and developed by [Unstructured Studio](https://unstructured.studio), an educational non-profit organization incorporated in Canada and India. Want to know more about ZubHub and our feature roadmap? Head to 👉 [ZubHub Wiki](https://github.com/unstructuredstudio/zubhub/wiki)!

<img src="screenshot.png">

## Developer Setup
Follow the instructions below to set up your local development environment
### Prerequisites

1. install [docker](https://docs.docker.com/get-docker/).
2. install [docker-compose](https://docs.docker.com/compose/install/).
3. Install [Node.js 14 and npm 7 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/).
4. Install [make](https://www.gnu.org/software/make/) using either your system’s package manager (Linux) or Xcode command line developer tools (OSX). On Windows, you can use [MozillaBuild](https://wiki.mozilla.org/MozillaBuild).

### Quick Start
The following describes how to set up an instance of the site on your computer for development with Docker and docker-compose.

1. Clone the [zubHub repository](https://github.com/unstructuredstudio/zubhub)
 ```sh
       $ git clone https://github.com/mozilla/pontoon.git
 ```
> **_NOTE:_** ❗  : To contribute changes to the project, you will need to [fork](<https://help.github.com/en/github/getting-started-with-github/fork-a-repo>) the repository under your own GitHub account.

#### Backend
2. From the root of the repository, run:
```sh
       $ cd ./zubhub_backend
 ```
3. Run:

```sh
       $ make init
```
This will run all  the initial setups required and start the server.generates the minimal `.env file` required to run the backend, spins-up all containers defined in the backend docker-compose file,applies all necessary migrations to the database,and creates a default admin user with username and password of `dummy` and `dummy_password` respectively.

Incase you're facing issues after running the above, like make: Error,
kindly run this before the above command:

```sh
       $ docker-compose up
```

4. Run the server:

Subsequently to start and stop the docker containers, you run the following

To start: 
```sh
       $ make start
```
To stop: 
```sh
       $ make stop or make down
```
For other make commands: run `make help`

Visit  http://localhost:8000 on your browser to access the API documentation.

#### Frontend
- Create a file named .env in the frontend root folder (same directory with package.json)
- Copy the content of .env.example and paste into the new .env file.
- Run `make start` to spin up the frontend container.
- Visit `localhost:3000` on your browser to access the frontend.

### Installing Docker on Windows Pro/Enterprise/Education
- Install Docker [Desktop for Windows](https://docs.docker.com/desktop/windows/install/).

#### Install tools (git, make, cygwin)
The easiest way is to use a package manager like [Chocolatey](https://chocolatey.org/install). Follow the installation instructions for Windows Powershell (Admin), then run `choco install make git cygwin` to install all packages.

Follow the prompt requests allowing script execution. At the end, verify that packages are available with `make --version` and `git --version`, it should return a version for each command.

At this point you need to disable the config `core.autocrlf` before cloning the **zubhub** repository, otherwise all files will use Windows line-endings (CRLF), and docker images will fail to build. To do so, open a Powershell as Admin (right click on the Start Menu, select Windows Powershell (Admin)), and run:

```sh
git config --system --unset core.autocrlf
git config --global core.autocrlf false
```
You can use `git config -l` to verify that the value for `core.autocrlf` is correctly set.

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
