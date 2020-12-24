#!/bin/bash

case $1 in
  init)
    for dir in '.' './web' './app/customer'
    do
      cp "$dir/.env.example" "$dir/.env"
      [ -f "$dir/.env" ] && echo "Created: $dir/.env"
    done
    ;;
  dev)
    docker-compose -p dev -f docker-compose.yml -f docker-compose.dev.yml up -d db adminer
    ;;
  test)
    docker-compose -p test -f docker-compose.yml -f docker-compose.test.yml build --force-rm --compress --no-cache db web
    docker-compose -p test -f docker-compose.yml -f docker-compose.test.yml up -d db web
    ;;
  prod)
    docker kill db web
    docker swarm init
    docker stack deploy -c docker-compose.yml -c stack.yml prod
    ;;
  exit-prod)
    docker stack rm prod
    docker swarm leave --force
    ;;
  *)
    cat << EOF 

Usage: sh ./build.sh COMMAND

Commands:
  init        initialize each app environment variables
  dev         build docker development-stage database
  test        build docker environment for testing the whole web app (including APIs)
  prod        build deploy docker containers using docker swarm
  exit-prod   exit production mode

EOF
    ;;
esac
