#! /bin/bash

echo "copying important files and folders from old project to new project"
mv /home/zubhub-backend/zubhub_backend/.env /home/zubhub-backend/zubhub/zubhub_backend/.env
cp -r /home/zubhub-backend/zubhub_backend/zubhub/creators/migrations/ /home/zubhub-backend/zubhub/zubhub_backend/zubhub/creators/migrations/
cp -r /home/zubhub-backend/zubhub_backend/zubhub/projects/migrations/ /home/zubhub-backend/zubhub/zubhub_backend/zubhub/projects/migrations/
echo "copying important files and folders from old project to new project"

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
cd /home/zubhub-backend/zubhub_backend/
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
echo "Updated backend"
# EOT
