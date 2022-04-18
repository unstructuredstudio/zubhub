# Deploy Fullstack App In One VM.

## Steps to be followed:

1. create a VM and set up the server.
2. clone the repository from Github.
3. run deploy_unscalable_fullstack.sh
4. set appropriate env variables
5. repeat 2 and 3

## Create a VM and set up the server:

(you can skip this step if you already have a server running. Note that we assume that your server is Ubuntu 20.04. The auto-installation of docker and docker-compose might not work as expected on a server that is not Ubuntu 20.04)

1. Head over to your cloud provider of choice and create a VM.
2. When done with VM creation, set up your VM (things like firewall, permissions, etc).
   Note that this deployment should always be done while logged in as root user or else it might fail. Also, ensure that your /home directory is empty, or at least doesn't contain any files or folders named zubhub, zubhub_frontend, or zubhub_backend.

## Clone the repository from Github

1. still logged in as root, cd into/home and clone the repository

```commandline
cd /home
git clone <github repository url>
```

In our case, our repository URL is https://github.com/unstructuredstudio/zubhub
