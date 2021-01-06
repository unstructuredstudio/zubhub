#! /bin/bash

mv zubhub_frontend/zubhub/.env zubhub/zubhub_frontend/zubhub/.env
mv zubhub_frontend/zubhub/.zero-ssl zubhub/zubhub_frontend/zubhub/
rm -rf zubhub_frontend
cp -r zubhub/zubhub_frontend/ zubhub_frontend/
rm -rf zubhub/ zubhub_frontend/zubhub/.env.example
cd zubhub_frontend/zubhub/
docker-compose down
docker-compose up -d --build
echo "Updated frontend"
# EOT