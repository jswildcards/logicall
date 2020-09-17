FROM node:14.11.0

WORKDIR /app/client
ENV TZ Asia/Hong_Kong

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

EXPOSE 8080
CMD ["yarn", "serve"]
