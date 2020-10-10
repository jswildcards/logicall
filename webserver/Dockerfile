FROM nginx:1.19.2-alpine

LABEL maintainer="js.wildcards@gmail.com"

RUN rm /etc/nginx/conf.d/default.conf
COPY ./volumes/etc/nginx/ /etc/nginx/

CMD ["nginx"]
