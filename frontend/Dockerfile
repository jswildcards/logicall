# build stage
FROM node:12.18.4-alpine as build-stage

LABEL maintainer="js.wildcards@gmail.com"

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build && npm prune --production

# production stage
FROM node:12.18.4-alpine as production-stage

WORKDIR /usr/src/app

COPY --from=build-stage /app/.next/ ./.next/
COPY --from=build-stage /app/node_modules/ ./node_modules/
COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/yarn.lock ./

EXPOSE 3000
CMD ["yarn", "start"]
