#! /bin/bash

mv zubhub_backend/.env zubhub/zubhub_backend/.env
rm -rf zubhub_backend
cp -r zubhub/zubhub_backend/ zubhub_backend/
rm -rf zubhub/ zubhub_backend/.env.example
cd zubhub_backend
docker-compose down
docker-compose -f ./docker-compose.prod.yml up -d --build
echo "Updated backend"
# EOT