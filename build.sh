docker kill node mysql nginx
docker rm node mysql nginx
docker rmi -f logicall_node:latest logicall_nginx:latest logicall_mysql:latest
docker-compose -p logicall up -d
