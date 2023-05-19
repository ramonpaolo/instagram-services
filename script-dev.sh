cd services/authentication

docker-compose -f docker-compose-dev.yaml down; docker-compose -f docker-compose-dev.yaml up -d --build

cd ../notification

docker-compose -f docker-compose-dev.yaml down; docker-compose -f docker-compose-dev.yaml up -d --build

cd ../publication

docker-compose -f docker-compose-dev.yaml down; docker-compose -f docker-compose-dev.yaml up -d --build

cd ../resize-image

docker-compose -f docker-compose-dev.yaml down; docker-compose -f docker-compose-dev.yaml up -d --build