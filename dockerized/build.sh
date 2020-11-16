docker kill backend db webserver frontend
docker rm backend db webserver frontend
docker rmi -f logicall_db:latest logicall_backend:latest logicall_webserver:latest logicall_frontend:latest
docker-compose -p logicall up -d
