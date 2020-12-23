case $1 in
  dev)
    docker kill dev
    docker rm dev
    docker run --name dev \
      -v $(pwd)/volumes/:/docker-entrypoint-initdb.d/ \
      --env-file ./web/.env -dp 5432:5432 postgres:13.1-alpine
    ;;
  test)
    docker-compose -p test build --force-rm --compress --no-cache
    docker-compose -p test up -d
    ;;
  deploy)
    docker stack deploy --compose-file=docker-compose.yml deploy
    ;;
  *)
    cat << EOF 

Usage: sh ./build.sh COMMAND

Commands:
  dev     build docker development-stage database
  test    build docker environment for testing the whole web app (including APIs)
  deploy  build deploy docker containers using docker swarm

EOF
    ;;
esac
