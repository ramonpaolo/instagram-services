cd services/authentication

docker-compose down; docker-compose up -d --build

cd ../notification

docker-compose down; docker-compose up -d --build

cd ../publication

docker-compose down; docker-compose up -d --build

cd ../resize-image

docker-compose down; docker-compose up -d --build