# build stage
FROM node:14.11.0 as build-stage

LABEL maintainer="js.wildcards@gmail.com"

WORKDIR /html
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY ./frontend .
RUN yarn build

# production stage
FROM nginx:1.19.2 as production-stage
COPY --from=build-stage /html/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./etc/nginx/ /etc/nginx/

CMD ["nginx"]
