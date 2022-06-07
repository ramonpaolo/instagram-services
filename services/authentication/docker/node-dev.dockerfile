FROM node:14.17-alpine

WORKDIR /app

EXPOSE 3000

COPY ./package.json ./

RUN yarn install

CMD ["yarn", "dev"]