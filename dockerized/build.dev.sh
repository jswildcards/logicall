docker kill some-db some-adminer
docker rm some-db some-adminer
docker rmi -f dev_db:latest
docker-compose -f docker-compose.dev.yml -p dev up -d
