FROM node:14.17-alpine AS appbuild

WORKDIR /app

COPY ./ ./

RUN yarn build

# ---------

FROM node:14.17-alpine

WORKDIR /app

EXPOSE 3000

COPY --from=appbuild /app/dist ./dist
COPY --from=appbuild /app/server.* /app/package.json /app/yarn.lock /app/.env ./

RUN mkdir ./images/ && yarn install --production

RUN chown node -R /app

USER node

CMD ["yarn", "start"]