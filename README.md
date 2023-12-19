![CI/CD](https://github.com/unstructuredstudio/zubhub/actions/workflows/build_deploy_backend.yml/badge.svg)

<img src="logo.png" width="350">

# Intro

**ZubHub** is an open-source, documentation & collaboration tool for activity-based learning. It is available for custom use for schools, libraries, hackerspaces, educational organizations, etc. Imagine your own online community built around your educational activities! 

Zubhub is designed and developed by [Unstructured Studio](https://unstructured.studio). We are an educational non-profit organization incorporated in Canada and India. We have our own ZubHub and we use it to expand access to low-cost creative learning opportunities to children and educators. On our ZubHub, children, and educators can get inspired by a collection of activity ideas and projects, learn how to build with the materials and tools that they already have access to, and share their creations with others. Some of the primary features are creator portfolios, community-curated projects, discussion-based collaboration, and workshops. ZubHub takes inspiration from the research conducted on the [Build In Progress](https://www.media.mit.edu/projects/build-in-progress/overview/) platform at the MIT Media Lab. :smiley:

| ZubHub is currently in public beta. A public ZubHub instance is hosted here: https://zubhub.unstructured.studio |
| --------------------------------------------------------------------------------------------------------------- |

Want to know more about ZubHub and our feature roadmap? Head to 👉 [ZubHub Wiki](https://github.com/unstructuredstudio/zubhub/wiki)!

<img width="800" alt="screenshot" src="https://user-images.githubusercontent.com/288353/216785034-05025129-fd99-414a-868d-7103fc38bf68.png">


# Development Setup

Follow the instructions below to set up your local development environment

## Steps

1. Install [Git](https://git-scm.com/downloads). ( [jump to section](#install-git) )
2. [Fork](https://github.com/unstructuredstudio/zubhub/fork) and clone zubhub repository. ( [jump to section](#fork-and-clone-zubhub-repository) )
3. Install [docker](https://docs.docker.com/get-docker/). ( [jump to section](#install-docker) )
4. Install [docker-compose](https://docs.docker.com/compose/install/). ( [jump to section](#install-docker-compose) )
5. Install [Node.js 14 and npm 7 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/). ( [jump to section](#install-node-and-npm) )
6. Install make. ( [jump to section](#install-make) )
7. Setup Backend. ( [jump to section](#setup-backend) )
8. Setup Frontend. ( [jump to section](#setup-frontend) )

<br/>
<br/>

## Windows Specific Setup

- Install **Docker** and **Docker Compose** by installing [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/).

- **Install tools (git, make, cygwin):**
  The easiest way is to use a package manager like [Chocolatey](https://chocolatey.org/install). Follow the installation instructions for Windows Powershell (Admin), then run `choco install make git cygwin` to install all packages.
  Follow the prompt requests allowing script execution. In the end, verify that packages are available with `make --version` and `git --version`, it should return a version for each command. Contributors also reported that installing [MozillaBuild](https://wiki.mozilla.org/MozillaBuild) automates the installation of a number of these tools.
  At this point, you need to disable the config **core.autocrlf** before cloning the **zubhub** repository, otherwise, all files will use Windows line-endings (CRLF), and docker images will fail to build. To do so, open a Powershell as Admin (right-click on the Start Menu, select Windows Powershell (Admin)), and run:

```sh
git config --system --unset core.autocrlf
git config --global core.autocrlf false
```

You can use `git config -l` to verify that the value for **core.autocrlf** is correctly set.

<br/>
<br/>

## Install Git

> **_NOTE:_** You can skip this step if you already have **git** installed on your machine. To check if **git** is running on your machine, run the following command `git --version`.

- click on this [link](https://git-scm.com/downloads), select your operating system from the options given, then download and install **git** on your local machine.

<br/>
<br/>

## Fork and clone Zubhub repository

- [fork](https://github.com/unstructuredstudio/zubhub/fork) the **zubhub** repository to your Github account.

- On the homepage of the cloned repository in your own Github account, click on the **code** button, copy the URL in the dropdown then run the following code in your computer terminal:

```sh
      $ git clone <copied url>
```

The copied URL will have the format of `https://github.com/<your github username>/zubhub.git`

<br/>
<br/>

## Install Docker

> **_NOTE:_** You can skip this step if you already have **docker** installed on your machine. To check if **docker** is running on your machine, run the following command `docker --version`.

- Click on this [link](https://docs.docker.com/get-docker/), select your operating system from the options given, then download and install docker on your local machine.

<br/>
<br/>

## Install Docker Compose

> **_NOTE:_** You can skip this step if you already have **docker-compose** installed on your machine. To check if **docker-compose** is running on your machine, run the following command `docker-compose --version`.

- Click on this [link](https://docs.docker.com/compose/install/), go through the page and select your operating system from the options given, then follow the given instructions to download and install **docker-compose** on your local machine.

<br/>
<br/>

## Install Node and NPM

> **_NOTE:_** You can skip this step if you already have **node** and **npm** installed on your machine. To check if **node** and **npm** are already installed on your machine, run the following command `node --version` and `npm --version`.

- Click on this [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) and follow the given instructions to install **node** and **npm** on your local machine.

<br/>
<br/>

## Install Make

> **_NOTE:_** You can skip this step if you already have **make** installed on your machine. To check if **make** is running on your machine, run the following command `make --version`.

- If you are on a Linux machine, you can install **make** through this [link](https://www.gnu.org/software/make/).
- If you are on a Mac machine, you can google the specific steps of installing **make** on a mac machine.
- If you are on a Windows machine, you should refer to the **Windows Specific Setup** section at the beginning of the **Developer Setup** section.

<br/>
<br/>

## Setup Backend

> **_NOTE_**: For windows users, before running the commands below switch to bash (available through [WSL](https://docs.microsoft.com/en-us/windows/wsl/install)), you can achieve that by typing bash to your command line.

- From the root of the repository, run:

```sh
       $ cd ./zubhub_backend
```

- Run:

```sh
       $ make init
```

This will run all the initial setups required and start the server, generate the minimal **.env file** required to run the backend, spins-up all containers defined in the backend docker-compose file, applies all necessary migrations to the database, and creates a default admin user with username and password of **dummy** and **dummy_password** respectively.

In case you're facing issues after running the above, like make: Error,
kindly run this before the above command:

```sh
       $ docker-compose up
```

- Run the server:

Subsequently, to start and stop the docker containers, you run the following

To start:

```sh
       $ make start
```

To stop:

- Stop the running container

```sh
       $ make stop
```

- Stop & remove the running container

```sh
       $ make down
```

You can run test by running `make test`.
> **_NOTE_**: While running tests, follow these steps if you encounter an error whose last line in the traceback is: 
```sh
amqp.exceptions.AccessRefused: (0, 0): (403) ACCESS_REFUSED - Login was refused using authentication mechanism AMQPLAIN. For details see the broker logfile.
```
1. From the command line, get the rabbitmq container id from the list of running containers and copy it. You can get the list by running: ```$ docker ps```
2. Copy the configuration file from the docker container to a path in your local machine you can use:
```sh
$ docker cp <container ID>:/etc/rabbitmq/rabbitmq.conf .
```
3. Open the `rabbitmq.conf` file from where you've copied it to in your local machine, with a text editor. 
4. Change `loopback_users.admin` to `false`, save the file, and then close it.
5. Copy the `rabbitmq.conf` back to its original location in the container. You can do this via:
```sh
$ docker cp rabbitmq.conf <container ID>:/etc/rabbitmq/rabbitmq.conf
```
6. Restart the container, and then run `make test` again.

**Note**: Alternatively, if you have a text editor configured with your Docker, you could just do only step 4 and then restart the container. 

For other make commands: run **make help**

Visit http://localhost:8000 on your browser to access the API documentation.

<br/>
<br/>

## Setup Frontend

- On your terminal/command line, navigate to **./zubhub/zubhub_frontend/zubhub** directory

- Create a file named **.env** in the frontend root folder (same directory with package.json), with the following content

```sh
#.env
REACT_APP_NODE_ENV=developement
REACT_APP_BACKEND_DEVELOPMENT_URL=http://127.0.0.1:8000
```

### **Using npm**

This is advisable for a better development experience.

- Run `npm install --legacy-peer-deps` to install the dependencies.
- Run `npm start` to start the frontend.

### **Using the Docker Container**

Use this when you are done with making your changes and you want to test your code on the Docker container.

- Run `make start` to spin up the frontend container.

Visit **localhost:3000** on your browser to access the frontend.

<br/>
<br/>

# Deployment

ZubHub is currently deployed on its main website using Github Actions that act as our build and deployment tooling. If you are interested in deploying Zubhub on your VM for testing and hosting purposes, follow the [Single VM Deployment](./single_vm_deployment/DEPLOYMENT.md) instructions.

<br/>
<br/>

# API Documentation

- [Architecture Overview](./zubhub_backend/zubhub/docs/docs/overview.md)
- [Web Server](./zubhub_backend/zubhub/docs/docs/web_container.md)
- [Media Server](./zubhub_backend/zubhub/docs/docs/media_container.md)
- [Database and ER Diagram](./zubhub_backend/zubhub/docs/docs/others.md)
- [Background Tasks](./zubhub_backend/zubhub/docs/docs/others.md)
- [Reverse-Proxy](./zubhub_backend/zubhub/docs/docs/others.md)

<br/>
<br/>

# Contributions

Contributions are welcome! We suggest you first go through the [Contribution Guidelines and Code of Conduct](CONTRIBUTING.md) and the [Feature Roadmap and Ideas](https://github.com/unstructuredstudio/zubhub/wiki/Feature-Roadmap-&-Ideas-2022) we have been working on. Search the Issues to see there are no duplicates or overlaps before filing new feature requests and bugs.

> **_NOTE:_** If you are interested in the API documentation instead, you need to follow the [instructions](#setup-backend) above about running the backend on your local machine and afterward visit **localhost:8000** on your browser to view the API documentation.
