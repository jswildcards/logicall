FROM node:12.18.4-alpine as build-stage

LABEL maintainer="js.wildcards@gmail.com"

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
