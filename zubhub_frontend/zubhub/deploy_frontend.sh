#! /bin/bash

echo "copying .env file and ssl folder"
mv zubhub_frontend/zubhub/.env zubhub/zubhub_frontend/zubhub/.env
mv zubhub_frontend/zubhub/.ssl-data zubhub/zubhub_frontend/zubhub/
echo "done copying .env file and ssl folder"

echo "removing unneccessary files and folders"
rm -rf zubhub_frontend
cp -r zubhub/zubhub_frontend/ zubhub_frontend/
rm -rf zubhub/ zubhub_frontend/zubhub/.env.example
rm -rf zubhub/ zubhub_frontend/zubhub/Dockerfile
rm -rf zubhub/ zubhub_frontend/zubhub/docker-compose.yml
rm -rf zubhub/ zubhub_frontend/zubhub/nginx/dev
echo "done removing unneccessary files and folders"

cd zubhub_frontend/zubhub/

echo "stopping and rebuilding the containers"
docker-compose down
docker-compose -f ./docker-compose.prod.yml up -d --build
echo "Updated frontend"
# EOT