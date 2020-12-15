#! /bin/bash

# ssh -o "StrictHostKeyChecking=no" -i deploy_rsa -A ${DEPLOY_USERNAME}@${DEPLOY_HOST} << EOT
# git clone https://github.com/unsctructuredstudio/zubhub/
echo "Cloned the repository"

mv zubhub_backend/.env zubhub/zubhub_backend/.env
rm -rf zubhub_backend
mkdir zubhub_backend
cp -r zubhub/zubhub_backend/* zubhub_backend/
rm -rf zubhub/ zubhub_backend/.env.example
cd zubhub_backend
docker-compose up -d --build
echo "Updated backend"
# EOT