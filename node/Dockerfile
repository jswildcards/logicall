FROM node:14.11.0

LABEL maintainer="js.wildcards@gmail.com"

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn tsc

ENV NODE_ENV production
ENV TZ Asia/Hong_Kong

EXPOSE 3000
CMD ["node", "dist/index.js"]
