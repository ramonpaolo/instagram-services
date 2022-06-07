import amqplib from 'amqplib'

// Controllers
import { getDataUser } from '../controllers/user-controller';

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
            if(queue === 'token'){

                console.log(JSON.parse(message.content.toString('utf-8')))
                const {_id, text, image}: { _id: string, text: string, image: string} = JSON.parse(message.content.toString('utf-8'))

                const tokens: string[] = [''];
    
                const user = await getDataUser(_id)

                if(user === false) return ;

                const followers = user.followers

                await Promise.all(followers.map(async (v) => {
                    const data = await getDataUser(v)
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