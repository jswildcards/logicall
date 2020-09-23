FROM mysql:5.7.31

LABEL maintainer="js.wildcards@gmail.com"

COPY ./data/ /docker-entrypoint-initdb.d/

ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=docker
ENV MYSQL_PASSWORD=docker
ENV MYSQL_ROOT_PASSWORD=root

CMD ["mysqld"]
EXPOSE 3306
