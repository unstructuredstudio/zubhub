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

## Run deploy_unscalable_fullstack.sh

1. after you must have cloned the Github repository, cd into the cloned repo and run the deploy_unscalable_fullstack.sh

```commandline
cd /home/zubhub
sudo bash ./single_vm_deployment/deploy_unscalable_fullstack.sh
```

**Note** You need to be in the path /home/zubhub.

## Set appropriate env variables

1. After the initial build is done, cd into /home/zubhub_backend and edit the .env variable there, adding the appropriate variables

```commandline
cd /home/zubhub_backend
nano .env
```

2. cd into /home/zubhub_frontend/zubhub and edit the .env variable there, adding the appropriate variables

```commandline
cd /home/zubhub_frontend/zubhub
nano .env
```

Note that without the appropriate .env variables, the app won't run correctly

## Repeat 2 and 3

Finally, repeat steps 2 and 3. once done, head over to your browser and try accessing the app with the frontend URL.

1. Once loaded, create a new user (this user will be made the admin later).
2. Open a new tab and input <backend url>/admin,
   When prompted for authentication, input username: dummy, password: dummy_password.
3. Once logged in to the admin, head over to "creators", select the user you created through the frontend and give this user is_admin and is_staff status.
4. Logout of the admin and try logging in to the admin again with the newly created user's username and password,
   if successful you can now delete the dummy user.

Note: It is extremely important that you take this step seriously. Don't forget to delete the dummy user.
Only vetted accounts should have the is_staff and is_admin status.

# DEBUG

If you suddenly start getting ssl errors, it is possible that the ssl volume became corrupted. To fix this, just run the below command on the VM containing the nginx reverse-proxy container, then try re-deploying the project:

```commandline
docker volume rm ssl_data
```
