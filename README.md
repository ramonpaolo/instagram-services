# Clone Instagram Using Microservices

![Banner Instagram Services](https://ik.imagekit.io/9t3dbkxrtl/Instagram_Services_vYFxKTYm-.png?ik-sdk-version=javascript-1.4.3&updatedAt=1654200062817)

![GitHub top language](https://img.shields.io/github/languages/top/ramonpaolo/instagram-services)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ramonpaolo/instagram-services)
![GitHub](https://img.shields.io/github/license/ramonpaolo/instagram-services)

---

# Indices
- [O que é esse projeto?](#o-que-é-esse-projeto)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Como o projeto funciona?](#como-o-projeto-funciona)
    - [Serviços de terceiros utilizados](#serviços-de-terceiros-utilizados)
    - [First Service - Authentication](#first-service---authentication)
    - [Second Service - Resize-Image](#second-service---resize-image)
    - [Third Service - Publication](#third-service---publication)
    - [Fourth Service - Notification](#fourth-service---notification)
- [App Mobile](#app-mobile)

# O que é esse projeto?
Esse projeto simula 4 serviços do funcionamento do backend do Instagram, usando a arquitetura microservices.

Vai desde a parte da criação do usuário(authentication), até a parte de notificação push(mobile) para todos os seguidores do usuário.

O projeto consiste em utilizar boas práticas da arquitetura microservices, com: deploy independente, auto scaling independente e ponto de falha único.

# Tecnologias utilizadas
- NodeJs
    - ExpressJs
    - TypeScript
    - Supertest
    - HTTP/2.0
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
    - AWS EFS
    - AWS Fargate
- Firebase
    - Firebase FCM
- Docker
- Docker Compose

# Como o projeto funciona?

## Serviços de terceiros utilizados
O projeto, utiliza 3 serviços de terceiros, sendo o uso do RabbitMQ, AWS e Firebase.

Estou utilizando o serviço da Nuvem: [Cloud AMQP](https://www.cloudamqp.com/), no qual possui os seguintes benefícios:
- 1 milhão de mensagens gratuitas por mês
- 20 Conexões simultâneas(temos apenas 5 serviços, dá para o gasto)
- 100 Tópicos/queues

Também estou utilizando, a AWS para fazer deploy na nuvem, usando os serviços: AWS ECS, AWS ELB, AWS S3, AWS EFS e AWS Fargate.

Estou utilizando o Firebase, especificamente para pegar o Token do celular do usuário, e mandar notificação para os celulares.

Para mais informações sobre criação de um sistema de arquivos na nuvem(AWS EFS), e sobre o RabbitMQ, consulte o meu artigo: [Criação e uso do AWS EFS](https://medium.com/@ramonpaolo) e [O que é o RabbitMQ, e para que serve?](https://medium.com/@ramonpaolo)

## First Service - Authentication
O primeiro serviço, é o serviço responsável por fazer a autenticação do usuário, como criar o usuário no banco de dados.

Temos um banco de dados próprio para esse serviço. Isso é uma boa prática da arquitetura microservices, pois damos a responsabilidade dos dados apenas para um serviço.

Esse serviço também apresenta endpoints, para acesso das publicações que serão consumidas no aplicativo mobile.

Endpoints:
- POST /user
    - Cria usuário no banco de dados
- GET /user/:id
    - Retorna um usuário em específico
- PUT /user/:id
    - Atualiza um usuário em específico
- DELTE /user/:id
    - Deleta um usuário em específico

No banco de dados MongoDB, são gravados os dados do usuário, como:
- Name
- Token Notification
- Followers
- Following
- ID do usuário

O único serviço que tem a permissão, e as credenciais para se comunicar com esse banco de dados, é o serviço authentication. Qualquer serviço que deseje utilizar os dados desse serviço(dados do usuário), terá que fazer uma chamada via RabbitMQ(AMQP) para o serviço Authentication, aí o serviço Authentication irá pegar os dados do usuário, e mandar para o tópico onde ele foi requisitado.

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>authentication</kbd>, estão definidos 2 serviços, sendo eles:
- NodeJs
- MongoDB


## Second Service - Resize-Image
O segundo serviço, será responsável por fazer o upload das imagens, na nuvem AWS S3.

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

Por problemas técnicos, esse serviço não consegue rodar em um conteiner docker. Quando você o roda em um conteiner, a aplicação simplesmente trava.

Para execução desse serviço, execute os comandos:
```bash
# Entrando na pasta do serviço
$ cd services/notification

# Habilitando o venv
$ ./venv/Scripts/activate

# Instalando as dependências
$ pip install -r requirements.txt

# Rodando o código
$ python main.py
```

# App Mobile
O projeto, conta um aplicativo Mobile, desenvolvido em Flutter, para utilização do backend.

O App pode ser encontrado [aqui](https://github.com/ramonpaolo/instagram-app)