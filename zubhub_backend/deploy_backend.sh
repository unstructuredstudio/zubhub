#! /bin/bash

echo "copying .env file and ssl folder"
mv /home/zubhub-backend/zubhub_backend/.env /home/zubhub-backend/zubhub/zubhub_backend/.env
echo "done copying .env file and ssl folder"

echo "removing old project folder"
rm -rf /home/zubhub-backend/zubhub_backend
echo "done removing old project folder"

echo "coping new project folder"
cp -r /home/zubhub-backend/zubhub/zubhub_backend/ /home/zubhub-backend/zubhub_backend/
echo "done coping new project folder"

echo "removing uneccessary files and folders"
rm -rf /home/zubhub-backend/zubhub/ /home/zubhub-backend/zubhub_backend/.env.example
echo "done removing uneccessary files and folders"

echo "rebuilding containers"
docker-compose -f /home/zubhub-backend/zubhub_backend/docker-compose.prod.yml down
docker-compose -f /home/zubhub-backend/zubhub_backend/docker-compose.prod.yml up -d --build
echo "Updated backend"
# EOT