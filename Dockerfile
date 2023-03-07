FROM node:19-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]