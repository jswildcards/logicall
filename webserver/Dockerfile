# build stage
FROM node:12.18.4-alpine as build-stage

LABEL maintainer="js.wildcards@gmail.com"

WORKDIR /html
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY ./frontend .
RUN yarn build && yarn export

# production stage
FROM nginx:1.19.2-alpine as production-stage
COPY --from=build-stage /html/out /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./volumes/etc/nginx/ /etc/nginx/

CMD ["nginx"]
