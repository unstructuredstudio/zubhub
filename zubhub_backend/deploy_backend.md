# Deploy Zubhub Backend.

## Steps to be followed:

1. create a digitalocean droplet and setup the server.
2. install docker and docker compose.
3. clone the repositiory from github.
4. copy deploy_backend.sh
5. run the copied deploy_backend.sh to deploy.

## Create a DigitalOcean droplet and setup the server properly:

(you can skip this step if you already have a server running. Note that we assume that your server is Ubuntu 20)

To create a DigitalOcean Ubuntu 20 droplet:

1. Follow this link(https://www.digitalocean.com/docs/droplets/how-to/create/) to create your droplet. Ensure that you have added
   ssh public keys to your digitalocean project because we will be working almost entirely through ssh.
2. follow this link(https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04) to setup your Ubuntu 20 server for the first time. While setting up the server, ensure to use zubhub-backend as the name of the new user you will create.

## Install docker and docker compose

(you can skip this step if you already have docker and docker-compose installed. Note that we assume that your server is Ubuntu 20)

1. we assume you are already connected to the server through ssh, if not run `ssh zubhub-backend@<droplet ip address>` to ssh into your droplet.
2. follow this link(https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) to setup docker on your droplet.
3. After installing docker, you also need to install docker-compose. To do this, run

```commandline
sudo apt update && sudo apt install docker-compose
```

**Note** If this server has already been setup by someone else, you can contact them to find out how to obtain the sudo password

## Clone the repository from github

1. still logged in as zubhub-frontend through ssh, run

```commandline
git clone <github repository url>
```

to clone the repo. In our case, our repository url is https://github.com/unstructuredstudio/zubhub

**Note** If this server has already been setup by someone else, you can contact them to find out how to obtain the sudo password

## Copy deploy_backend.sh

1. after you must have cloned the github repository, run the following command to copy the deploy_backend.sh file

```commandline
cp zubhub/zubhub_frontend/zubhub/deploy_backend.sh ./
```

**Note** You need to be in the directory named zubhub-backend. This is the directory you land on when you ssh to the droplet using `ssh zubhub-backend@<droplet ip address>`

## Run the copied deploy_backend.sh to deploy

1. Now all you need to do is to run the following command to deploy your backend

```commandline
sudo bash deploy_backend.sh
```

2. Your backend should be running by now. just visit your backend through the ip address or domain.
