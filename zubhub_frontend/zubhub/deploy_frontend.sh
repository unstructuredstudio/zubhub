#! /bin/bash

echo "copying .env file and ssl folder"
mv /home/zubhub-frontend/zubhub_frontend/zubhub/.env /home/zubhub-frontend/zubhub/zubhub_frontend/zubhub/.env
# mv /home/zubhub-frontend/zubhub_frontend/zubhub/.ssl-data /home/zubhub-frontend/zubhub/zubhub_frontend/zubhub/
echo "done copying .env file and ssl folder"

echo "removing old project folder"
rm -rf /home/zubhub-frontend/zubhub_frontend
echo "removing old project folder"

echo "copying new project folder"
cp -r /home/zubhub-frontend/zubhub/zubhub_frontend/ /home/zubhub-frontend/zubhub_frontend/
echo "done copying new project folder"

# echo "changing permission of cert storage folder"
# sudo chown -R nobody:nogroup /home/zubhub-frontend/zubhub_frontend/zubhub/.ssl-data/storage
# echo "done changing permission of cert storage folder"

echo "removing uneccessary files and folders"
rm -rf /home/zubhub-frontend/zubhub
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/.env.example
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/Dockerfile
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/docker-compose.yml
rm -rf /home/zubhub-frontend/zubhub_frontend/zubhub/nginx/dev
echo "done removing uneccessary files and folders"




echo "stopping and rebuilding the containers"
cd /home/zubhub-frontend/zubhub_frontend/zubhub/
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
echo "Updated frontend"
# EOT
