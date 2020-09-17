FROM node:14.11.0

WORKDIR /app/server
ENV TZ Asia/Hong_Kong

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN npx tsc

EXPOSE 3000
RUN cat dist/index.js
CMD ["node", "dist/index.js"]