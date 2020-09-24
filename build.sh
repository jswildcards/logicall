docker kill backend db webserver adminer
docker rm backend db webserver adminer
docker rmi -f logicall_backend:latest logicall_webserver:latest
docker-compose -p logicall up -d
