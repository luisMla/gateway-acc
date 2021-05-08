FROM node:14.16.1-alpine

WORKDIR /app

ENV NODE_ENV development
COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3002

CMD [ "yarn", "start:dev" ]
