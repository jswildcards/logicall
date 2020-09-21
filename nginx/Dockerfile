# build stage
FROM node:14.11.0 as build-stage

LABEL maintainer="js.wildcards@gmail.com"

WORKDIR /html
COPY html/package.json html/yarn.lock ./
RUN yarn install
COPY ./html/ .
RUN yarn build

# production stage
FROM nginx:1.19.2 as production-stage
COPY --from=build-stage /html/dist /usr/share/nginx/html

RUN mkdir /etc/nginx/sites-available && rm /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/
COPY sites /etc/nginx/sites-available

CMD nginx
