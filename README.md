# Clone Instagram Using Microservices

# O que é esse projeto?
Esse projeto simula 5 serviços do funcionamento do backend do Instagram, usando a arquitetura microservices.

Vai desde a parte da criação do usuário(authentication), até a parte de notificação push(mobile) para todos os seguidores do usuário.

O projeto consiste em utilizar boas práticas da arquitetura microservices, com: deploy independente, auto scaling independente e ponto de falha único.

# Tecnologias utilizadas
- NodeJs
    - ExpressJs
    - TypeScript
- Python
    - FastAPI
- Flutter
- RabbitMQ(AMQP)
- Arquitetura Microservices
- API REST
- AWS
    - AWS S3
    - AWS ECS
    - AWS ELB
- Firebase
    - Firebase FCM
- Docker
- Docker Compose
- NGINX

# Como o projeto funciona?

## Serviços de terceiros utilizados
O projeto, utiliza 1 serviço de terceiro apenas, sendo o uso do RabbitMQ.
Estou utilizando o serviço da Nuvem: [Cloud AMQP](https://www.cloudamqp.com/), no qual possui os seguintes benefícios:
- 1 milhão de mensagens gratuitas por mês
- 20 Conexões simultâneas(temos apenas 5 serviços, dá para o gasto)
- 100 Tópicos/queues


## First Service - Authentication
O primeiro serviço(authentication), é o serviço responsável por fazer a autenticação do usuário, como criar o usuário no banco de dados.

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>authentication</kbd>, estão definidos 3 serviços, sendo eles:
- MongoDB
- NodeJs
- NGINX

Temos um banco de dados, próprio para esse serviço. Isso é uma boa prática da arquitetura microservices, pois damos a responsabilidade dos dados apenas para um serviço.

No banco de dados MongoDB, são gravados os dados do usuário, como:
- Name
- Token Notification
- Followers
- Following
- ID do usuário

O único serviço que tem a permissão, e as credenciais para se comunicar com esse banco de dados, é o serviço authentication. Qualquer serviço que deseje utilizar os dados desse serviço(dados do usuário), terá que fazer uma chamada via RabbitMQ(AMQP) para o serviço Authentication, aí o serviço Authentication, irá pegar os dados do usuário, e mandar para o tópico onde ele foi requisitado.