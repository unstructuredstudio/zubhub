#! /bin/bash

echo "copying important files and folders from old project to new project"
cp /home/zubhub-services/zubhub_services/.env /home/zubhub-services/zubhub/zubhub_backend/
# cp -r /home/zubhub-services/zubhub_services/.ssl-data /home/zubhub-services/zubhub/zubhub_backend/
echo "copying important files and folders from old project to new project"

echo "removing old project folder"
rm -rf /home/zubhub-services/zubhub_services
echo "done removing old project folder"

echo "creating new project folder"
mkdir -p /home/zubhub-services/zubhub_services/compose
echo "done creating new project folder"

echo "coping new project folder"
cp /home/zubhub-services/zubhub/zubhub_backend/.env /home/zubhub-services/zubhub_services/
cp /home/zubhub-services/zubhub/zubhub_backend/docker-compose.prod.yml /home/zubhub-services/zubhub_services/
cp /home/zubhub-services/zubhub/zubhub_backend/nginx /home/zubhub-services/zubhub_services/
# cp -r /home/zubhub-services/zubhub/zubhub_backend/.ssl-data /home/zubhub-services/zubhub_services/
cp -r /home/zubhub-services/zubhub/zubhub_backend/compose/prometheus.yml /home/zubhub-services/zubhub_services/compose/
echo "done coping new project folder"

# echo "changing permission of cert storage folder"
# sudo chown -R nobody:nogroup /home/zubhub-services/zubhub_services/.ssl-data/storage
# echo "done changing permission of cert storage folder"

echo "removing uneccessary files and folders"
rm -rf /home/zubhub-services/zubhub/
echo "done removing uneccessary files and folders"

echo "rebuilding containers"
cd /home/zubhub-services/zubhub_services/
docker stack rm zubhub-services

# starting the services stack up immediately leads to failure. Stack will fail to start up
sleep 30s

docker stack deploy --compose-file docker-compose.prod.yml zubhub-services
echo "Updated backend"
# EOT
