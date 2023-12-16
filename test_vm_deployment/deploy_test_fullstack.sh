#! /bin/bash

. /home/zubhub/single_vm_deployment/onetime-setup.sh

[ ! -d "/home/zubhub" ] && { echo >&2 "/home/zubhub dir not available.  Aborting."; exit 1; }
[ ! -d "/home/zubhub_backend" ] && { echo >&2 "/home/zubhub_backend dir not available.  Aborting."; exit 1; }
[ ! -d "/home/zubhub_frontend/zubhub" ] && { echo >&2 "/home/zubhub_frontend/zubhub dir not available.  Aborting."; exit 1; }

echo "copying backend .env file"
cp /home/zubhub_backend/.env /home/zubhub/zubhub_backend/.env
echo "done copying backend .env file"

echo "copying docker-compose file"
cp /home/zubhub/test_vm_deployment/docker-compose.test.yml /home/docker-compose.test.yml
echo "done copying docker-compose file"

echo "removing old frontend folder"
rm -rf /home/zubhub_frontend
echo "removing old frontend folder"

echo "remove old backend folder"
rm -rf /home/zubhub_backend
echo "removing old backend folder"

echo "copying new frontend folder"
cp -r /home/zubhub/zubhub_frontend/ /home/zubhub_frontend/
echo "done copying new frontend folder"

echo "copying new backend folder"
cp -r /home/zubhub/zubhub_backend/ /home/zubhub_backend/
echo "done copying new backend folder"

echo "removing uneccessary files and folders"
rm -rf /home/zubhub
rm -rf /home/zubhub_frontend/zubhub/.env.example
rm -rf /home/zubhub_frontend/zubhub/Dockerfile
rm -rf /home/zubhub_frontend/zubhub/docker-compose.yml
rm -rf /home/zubhub_frontend/zubhub/docker-compose.prod.yml
rm -rf /home/zubhub_frontend/zubhub/deploy_frontend.sh
rm -rf /home/zubhub_frontend/zubhub/deploy_frontend.md
rm -rf /home/zubhub_frontend/zubhub/README.md
rm -rf /home/zubhub_frontend/zubhub/nginx/dev
rm -rf /home/zubhub_backend/.env.example
rm -rf /home/zubhub_backend/docker-compose.prod.yml
rm -rf /home/zubhub_backend/docker-compose.yml
rm -rf /home/zubhub_backend/compose/deploy_backend.sh
rm -rf /home/zubhub_backend/compose/deploy_backend.md
echo "done removing uneccessary frontend files and folders"

echo "stopping and rebuilding the containers"
cd /home/
# pull the latest images defined in the docker-compose file. This is to avoid using stale images
docker-compose -f docker-compose.test.yml --env-file ./zubhub_backend/.env pull
docker-compose -f docker-compose.test.yml --env-file ./zubhub_backend/.env down
sleep 10s
docker-compose -f docker-compose.test.yml --env-file ./zubhub_backend/.env up -d --build
sleep 180s
# create dummy user
docker exec web bash  -c "python /zubhub_backend/zubhub/manage.py create_dummy_admin_user"
# create default theme
docker exec web bash -c "python /zubhub_backend/zubhub/manage.py create_default_theme"
echo "Updated test fullstack"
# EOT

