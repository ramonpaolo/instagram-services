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

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>authentication</kbd>, estão definidos 3 serviços, sendo eles:
- NodeJs
- NGINX
- MongoDB

Temos um banco de dados próprio para esse serviço. Isso é uma boa prática da arquitetura microservices, pois damos a responsabilidade dos dados apenas para um serviço.

No banco de dados MongoDB, são gravados os dados do usuário, como:
- Name
- Token Notification
- Followers
- Following
- ID do usuário

O único serviço que tem a permissão, e as credenciais para se comunicar com esse banco de dados, é o serviço authentication. Qualquer serviço que deseje utilizar os dados desse serviço(dados do usuário), terá que fazer uma chamada via RabbitMQ(AMQP) para o serviço Authentication, aí o serviço Authentication irá pegar os dados do usuário, e mandar para o tópico onde ele foi requisitado.

## Second Service - Validation Data
O serviço de validação de dados, nada mais, irá validar se o usuário existe no banco de dados, e se os outros campos estão tudo OK, além de receber a original chamada HTTP POST da publicação de conteúdo.

Após esse serviço validar rapidamente o usuário logado e os campos, ele irá enviar uma mensagem para o tópico 'reisze-image'

## Third Service - Resize-Image
O terceiro serviço, é responsável por fazer o resize das imagens recebidas via RabbitMQ(AMQP).

O serviço recebe os dados via RabbitMQ, no formato JSON, junto com os Buffers das imagens do usuário, entre outros dados, como:
- ID do Usuário
- Imagens em Base64
- Texto

Após receber os dados via RabbitMQ, o serviço irá fazer resize das imagens, e após concluído, ele 

## Fourth Service - Deploy on AWS S3

O quarto serviço, será responsável por fazer o upload das imagens, na nuvem AWS S3.

Esse serviço irá receber os dados via 

irá fazer o deploy no S3, onde será retornado uma string para cada objeto/arquivo, feito deploy. Após o deploy de todas as imagens, ele irá enviar uma mensagem para o tópico 'publication', onde ele irá enviar os dados pegos pela API, junto com a URL dos objetos upados no AWS S3.

Ops: Podemos observar, que poderíamos ter feito/usado, outros 2 serviços. Poderíamos ter criado um serviço, especificamente para fazer deploy na AWS S3, afinal, é um processo que pode demorar, e não queremos que o usuário fique na tela esperando a resposta HTTP com um status 200, dependendo do deploy das imagens na AWS S3. Ou um outro jeito, seria criarmos um serviço, que iria servir apenas para receber o conteúdo(imagens) do usuário, e adicionar o JSON recebido do usuário, em um tópico, para um outro serviço de fato dar continuidade, pondendo esse serviço, ser o de resize.

## Third Service - Publication
O terceiro serviço, é responsável por adicionar os dados da publicação, no banco de dados.

No arquivo <kbd>docker-compose.yaml</kbd>, no serviço <kbd>publication</kbd>, estão definidos 3 serviços, sendo eles:
- MongoDB
- NodeJs
- NGINX

Temos um banco de dados próprio para esse serviço. Isso é uma boa prática da arquitetura microservices, pois damos a responsabilidade dos dados apenas para um serviço.

No banco de dados MongoDB, são gravados os dados da publication, como:
- ID Publication
- ID Owner Publication User
- text
- image_1920
- image_1080
- image_720
- image_480

O único serviço que tem a permissão, e as credenciais para se comunicar com esse banco de dados, é o serviço publication. Qualquer serviço que deseje utilizar os dados desse serviço(dados da publicação), terá que fazer uma chamada via RabbitMQ(AMQP) para o serviço Publication, aí o serviço Publication irá pegar os dados da publicação, e mandar para o tópico onde ele foi requisitado.