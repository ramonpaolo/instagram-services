FROM node:14.17-alpine

WORKDIR /app

EXPOSE 3000

CMD ["yarn", "dev"]