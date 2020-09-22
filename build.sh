docker kill node mysql nginx adminer
docker rm node mysql nginx adminer
docker rmi -f logicall_node:latest logicall_nginx:latest logicall_mysql:latest
docker-compose -p logicall up -d
