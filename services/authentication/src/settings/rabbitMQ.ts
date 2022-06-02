import amqplib from 'amqplib'

// Controllers
import { getDataUser } from '../controllers/user-controller';
// import IPublication from '../interfaces/publication-interface';

export default class RabbitMQ {
    private channel: amqplib.Channel | undefined;

    public rabbitConn: amqplib.Connection | undefined

    async connection() {
        this.rabbitConn = await amqplib.connect(String(process.env.URL_RABBITMQ))
        this.channel = await this.rabbitConn.createChannel()

        return true;
    }

    async sender(queue: string, message: string) {
        await this.channel?.assertQueue(queue)
        this.channel?.sendToQueue(queue, Buffer.from(message))
        return true
    }

    async consumer(queue: string) {
        await this.channel?.assertQueue(queue)
        this.channel?.consume(queue, async (message) => {
            if (message === null) return null;

            // const messageJSON: { users: { _id: number }[]} = JSON.parse(message.content.toString('utf-8'))

            if(queue === 'user'){
                // const tokens: string[] = [''];
    
                // await Promise.all(messageJSON.users.map(async (v) => {
                //     const data = await getDataUser(v._id)
                //     if (data !== false) {
                //         tokens.push(data['token-notification'])
                //     }
    
                // }))
    
                // tokens.shift()
    
                // await this.sender('token-notification', JSON.stringify({
                //     tokens, publication: {
                //         text: 'Chegando em sorocaba!!!',
                //         image: 'https://cdn.pixabay.com/photo/2022/05/18/10/27/sea-7204955__340.jpg',
                //         author: 'Ramon',
                //         title: 'Publicação nova de Ramon'
                //     }
                // }))
            }else if(queue === 'token'){
                const {_id, text, image}: { _id: number, text: string, image: string} = JSON.parse(message.content.toString('utf-8'))

                const tokens: string[] = [''];
    
                const user = await getDataUser(_id)

                if(user === false) return this.channel?.cancel(message.fields.consumerTag)

                console.log('Followers: ', user.followers)

                const followers = user.followers

                await Promise.all(followers.map(async (v) => {
                    const data = await getDataUser(Number(v))
                    if (data !== false) {
                        tokens.push(data['token-notification'])
                    }
                }))
    
                tokens.shift()
    
                await this.sender('token-notification', JSON.stringify({
                    tokens, _id, text, image, author: user.name.split(' ').shift(), 'self-token': user['token-notification']
                }))
                console.log('Enviado no tópico "token-notification"')
            }

            this.channel?.ack(message)

        })
    }
}