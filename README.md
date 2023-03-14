![CI/CD](https://github.com/unstructuredstudio/zubhub/actions/workflows/build_deploy_backend.yml/badge.svg)

<img src="logo.png" width="350">

# Intro

**ZubHub** is an open-source, documentation & collaboration tool for activity-based learning. It is available for custom use for schools, libraries, hackerspaces, educational organizations, etc. Imagine your own online community built around your educational activities! 

Zubhub is designed and developed by [Unstructured Studio](https://unstructured.studio). We are an educational non-profit organization incorporated in Canada and India. We have our own ZubHub and we use it to expand access to low-cost creative learning opportunities to children and educators. On our ZubHub, children, and educators can get inspired by a collection of activity ideas and projects, learn how to build with the materials and tools that they already have access to, and share their creations with others. Some of the primary features are creator portfolios, community-curated projects, discussion-based collaboration, and workshops. ZubHub takes inspiration from the research conducted on the [Build In Progress](http://web.mit.edu/ttseng/www/portfolio/build_in_progress/index.html) platform at the MIT Media Lab. :smiley:

| ZubHub is currently in public beta. A public ZubHub instance is hosted here: https://zubhub.unstructured.studio |
| --------------------------------------------------------------------------------------------------------------- |

Want to know more about ZubHub and our feature roadmap? Head to 👉 [ZubHub Wiki](https://github.com/unstructuredstudio/zubhub/wiki)!

<img width="800" alt="screenshot" src="https://user-images.githubusercontent.com/288353/216785034-05025129-fd99-414a-868d-7103fc38bf68.png">


# Development Setup

Follow the instructions below to set up your local development environment

## Steps

1. Install [Git](https://git-scm.com/downloads). ( [jump to section](#install-git) )
2. [Fork](https://github.com/unstructuredstudio/zubhub/fork) and clone zubhub repository. ( [jump to section]
(#fork-and-clone-zubhub-repository) )
3. Install [docker](https://docs.docker.com/get-docker/). ( [jump to section](#install-docker) )
4. Install [docker-compose](https://docs.docker.com/compose/install/). ( [jump to section]
(#install-docker-compose) )
5. Install [Node.js 14 and npm 7 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/). ( [jump to section](#install-node-and-npm) )
6. Install make. ( [jump to section](#install-make) )
7. Setup Backend. ( [jump to section](#setup-backend) )
8. Setup Frontend. ( [jump to section](#setup-frontend) )

<br/>
<br/>

## Installation and Project Software Requirement Setup

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

Docker is a platform that allows you to build, test, and deploy applications as containers. Containers are lightweight, portable, and self-contained units that run applications and their dependencies.
You can skip this step if you already have Docker installed on your machine. To check if Docker is running on your machine, run the following command docker --version.
The steps to install Docker on your machine will vary depending on your operating system.
- Click on this [link](https://docs.docker.com/get-docker/), select your operating system from the options given, then download docker and follow the steps below to install on your local machine.

> **_NOTE:_** You can skip this step if you already have **docker** installed on your machine. To check if **docker** is running on your machine, run the following command `docker --version`.

MacOS

1. Download the Docker Desktop for Mac installer from the Docker website on this [link](https://docs.docker.com/get-docker/).
2. Double-click the downloaded .dmg file to open the installer.
3. Drag the Docker icon to the Applications folder.
4. Double-click the Docker icon in the Applications folder to start Docker Desktop.

Windows

1. Download the Docker Desktop for Windows installer from the Docker website on this [link](https://docs.docker.com/get-docker/).
2. Double-click the downloaded .exe file to start the installer.
3. Follow the prompts to install Docker Desktop.
4. When the installation is complete, Docker Desktop starts automatically.

Linux

1. Follow the instructions on the Docker website on this [link](https://docs.docker.com/get-docker/) to install Docker Engine for your Linux distribution.
2. Once Docker is installed, start the Docker service by running the command `sudo systemctl start docker`.

After you have installed Docker, you can verify the installation by running the following command in your terminal or command prompt: docker --version

If Docker is installed correctly, this command will display the version number of Docker that is installed on your machine.

<br/>
<br/>

## Install Docker Compose

Docker Compose is a tool that allows you to define and run multi-container Docker applications.
You can skip this step if you already have Docker Compose installed on your machine. To check if Docker Compose is running on your machine, run the following command docker-compose --version.
To install Docker Compose, follow the instructions below:

> **_NOTE:_** You can skip this step if you already have **docker-compose** installed on your machine. To check if **docker-compose** is running on your machine, run the following command `docker-compose --version`.


Install Docker Compose on Linux systems
Follow the steps below to install Docker Compose on a Linux system:

1. Open a terminal window.
2. Run the following command to download the current stable release of Docker Compose: 

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

This command downloads the latest version of Docker Compose and saves it to the /usr/local/bin directory.
3. Apply executable permissions to the Docker Compose binary:

sudo chmod +x /usr/local/bin/docker-compose

4. Test the installation by running the following command:

docker-compose --version

This command displays the version of Docker Compose that you installed.

Install Docker Compose on macOS
Follow the steps below to install Docker Compose on a macOS system:

1. Open a terminal window.
2. Run the following command to download the Docker Compose binary:

curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

This command downloads the latest version of Docker Compose and saves it to the /usr/local/bin directory.

3. Apply executable permissions to the Docker Compose binary:
 
chmod +x /usr/local/bin/docker-compose

4. Test the installation by running the following command:

docker-compose --version

This command displays the version of Docker Compose that you installed.


Install Docker Compose on Windows systems
Follow the steps below to install Docker Compose on a Windows system:

1. Download the Docker Compose installer from the official Docker website: https://docs.docker.com/compose/install/#install-compose-on-windows-desktop-systems.
2. Run the installer and follow the instructions to complete the installation.
3. Test the installation by running the following command in a command prompt:

docker-compose --version

This command displays the version of Docker Compose that you installed.


- Click on this [link](https://docs.docker.com/compose/install/), go through the page and select your operating system from the options given, then follow the given instructions to download and install **docker-compose** on your local machine.

<br/>
<br/>

## Install Node and NPM

> **_NOTE:_** You can skip this step if you already have **node** and **npm** installed on your machine. To check if **node** and **npm** are already installed on your machine, run the following command `node --version` and `npm --version`.

- Click on this [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) and follow the given instructions to install **node** and **npm** on your local machine.

1. Go to the Node.js download page and download the appropriate installer for your operating system.
2. Run the installer and follow the prompts to install Node.js.
3. Open a terminal or command prompt and run the following command to check that Node.js and npm are installed correctly:

node -v
npm -v

If the version numbers are displayed, Node.js and npm are installed correctly.

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

```sh
       $ make stop or make down
```

You can run test by running `make test`.
For other make commands: run **make help**

Visit http://localhost:8000 on your browser to access the API documentation.

<br/>
<br/>

## Setup Frontend

- Create a file named **.env** in the frontend root folder (same directory with package.json)
- Copy the content of **.env.example** and paste into the new .env file.
- On your terminal/command line, navigate to **./zubhub/zubhub_frontend/zubhub** directory

### **Using npm**

This is advisable for a better development experience.

- Run `npm install` to install the dependencies.
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
