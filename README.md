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
    - Pika
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
O projeto, utiliza 3 serviços de terceiros, sendo o uso do RabbitMQ, AWS e Firebase.

Estou utilizando o serviço da Nuvem: [Cloud AMQP](https://www.cloudamqp.com/), no qual possui os seguintes benefícios:
- 1 milhão de mensagens gratuitas por mês
- 20 Conexões simultâneas(temos apenas 5 serviços, dá para o gasto)
- 100 Tópicos/queues

Também estou utilizando, a AWS para fazer deploy na nuvem, usando o serviço AWS ECS, AWS ELB, AWS S3.
Estou utilizando o Firebase, especificamente para pegar o Token do celular do usuário, e mandar mensagem para os tokens(celulares).


## First Service - Authentication
O primeiro serviço(authentication), é o serviço responsável por fazer a autenticação do usuário, como criar o usuário no banco de dados.

Temos um banco de dados próprio para esse serviço. Isso é uma boa prática da arquitetura microservices, pois damos a responsabilidade dos dados apenas para um serviço.

No banco de dados MongoDB, são gravados os dados do usuário, como:
- Name
- Token Notification
- Followers
- Following
- ID do usuário

O único serviço que tem a permissão, e as credenciais para se comunicar com esse banco de dados, é o serviço authentication. Qualquer serviço que deseje utilizar os dados desse serviço(dados do usuário), terá que fazer uma chamada via RabbitMQ(AMQP) para o serviço Authentication, aí o serviço Authentication irá pegar os dados do usuário, e mandar para o tópico onde ele foi requisitado.

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>authentication</kbd>, estão definidos 3 serviços, sendo eles:
- NodeJs
- MongoDB


## Second Service - Resize-Image
O quarto serviço, será responsável por fazer o upload das imagens, na nuvem AWS S3.

Esse serviço irá receber os dados via chamada HTTP direta do aplicativo.

Esse serviço irá receber os dados da chamada HTTP POST do usuário, para criação de conteúdo, e então, irá salvar as imagens no conteiner, até fazer o resize das imagens, e upload das imagens no AWS S3. Após fazer upload da imagem no AWS S3, será retornado a URL do arquivo no S3, então, ele irá mesclar com o serviço AWS CloudFront, para pegar a imagem mais rapidamente(em cache).

Após pegar a imagem, ele irá pegar os dados JSON recebidos pela requisição HTTP, e com as strings das imagens feitas upload, irá enviar uma mensagem para o tópico 'publication', no RabbitMQ.

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>Resize-Image</kbd>, esta definido 1 serviço, sendo ele:
- NodeJs

## Third Service - Publication
O terceiro serviço, é responsável por adicionar os dados da publicação, no banco de dados.

Esse serviço irá ouvir(consumer) as mensagens recebidas do serviço 'resize-image', para criar a publicação no banco de dados. Após criar a publicação no banco de dados, será enviado uma mensagem para o tópico 'notification'.

Esse serviço também apresenta endpoints, para acesso das publicações que serão consumidas no aplicativo mobile.

Endpoints:
- /publications
    - Retorna todas as publicações
- /publication/:id
    - Retorna uma publicação específica
- /publication/user/:idUser
    - Retorna as publicações de um usuário em específico

Temos um banco de dados próprio para esse serviço. Isso é uma boa prática da arquitetura microservices, pois damos a responsabilidade dos dados apenas para um serviço.

No banco de dados MongoDB, são gravados os dados da publication, como:
- ID Publication
- ID Owner Publication User
- text
- images

O único serviço que tem a permissão, e as credenciais para se comunicar com esse banco de dados, é o serviço publication. Qualquer serviço que deseje utilizar os dados desse serviço(dados da publicação), terá que fazer uma chamada via RabbitMQ(AMQP) para o serviço Publication, aí o serviço Publication irá pegar os dados da publicação, e mandar para o tópico onde ele foi requisitado.

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>publication</kbd>, estão definidos 2 serviços, sendo eles:
- MongoDB
- NodeJs

## Fourth Service - Notification
O quarto serviço, é responsável por fazer a notificação mobile(push) dos usuários que estão seguindo o usuário que fez a publicação.

Esse serviço, feito em Python, irá consumir as mensagens recebidas do serviço 'publication', vai receber os dados da publicação, e então, irá enviar uma mensagem para o serviço 'authentication', requerindo os dados(token-notifications), de todos os usuários que estão seguindo o usuário que criou a publicação. Após receber a mensagem com os tokens dos usuários, ele irá enviar as notificações, usando o Firebase FMC.