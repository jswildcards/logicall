docker kill backend db webserver adminer frontend
docker rm backend db webserver adminer frontend
docker rmi -f logicall_backend:latest logicall_webserver:latest logicall_frontend:latest
docker-compose -p logicall up -d
