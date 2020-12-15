#! /bin/bash

# ssh -o "StrictHostKeyChecking=no" -i deploy_rsa -A ${DEPLOY_USERNAME}@${DEPLOY_HOST} << EOT
# git clone https://github.com/unsctructuredstudio/zubhub/
echo "Cloned the repository"

mv zubhub_frontend/zubhub/.env zubhub/zubhub_frontend/zubhub/.env
rm -rf zubhub_frontend
mkdir zubhub_frontend
cp -r zubhub/zubhub_frontend/* zubhub_frontend/
rm -rf zubhub/ zubhub_frontend/zubhub/.env.example
cd zubhub_frontend/zubhub/
docker-compose up -d --build
echo "Updated frontend"
# EOT