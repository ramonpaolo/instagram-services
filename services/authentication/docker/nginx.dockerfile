FROM nginx:1.21-alpine

WORKDIR /etc/nginx/conf.d

RUN rm -rf ./default.conf

COPY ./docker/settings/nginx.conf ./

COPY ./server.key ./server.crt ./../

CMD ["nginx", "-g", "daemon off;"]