#! /bin/bash

echo "copying .env file and ssl folder"
mv /home/zubhub-frontend/zubhub_frontend/zubhub/.env /home/zubhub-frontend/zubhub/zubhub_frontend/zubhub/.env
mv /home/zubhub-frontend/zubhub_frontend/zubhub/.ssl-data /home/zubhub-frontend/zubhub/zubhub_frontend/zubhub/
echo "done copying .env file and ssl folder"

echo "removing unneccessary files and folders"
rm -rf /home/zubhub-frontend/zubhub_frontend
cp -r /home/zubhub-frontend/zubhub/zubhub_frontend/ /home/zubhub-frontend/zubhub_frontend/
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/.env.example
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/Dockerfile
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/docker-compose.yml
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/nginx/dev
echo "done removing unneccessary files and folders"


echo "stopping and rebuilding the containers"
docker-compose -f /home/zubhub-frontend/zubhub_frontend/zubhub/docker-compose.prod.yml down
docker-compose -f /home/zubhub-frontend/zubhub_frontend/zubhub/docker-compose.prod.yml up -d --build
echo "Updated frontend"
# EOT
