import amqplib from 'amqplib'
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

            const messageJSON: {users: {_idUser: number}[], _idPublication: number} = JSON.parse(message.content.toString('utf-8')) 
            
            const users: object[] = [{}];
            users.pop();

            await Promise.all(messageJSON.users.map(async (v) => {
                const data = await getDataUser(v._idUser)
                if(data === false) return this.channel?.ack(message)
                users.push({'token-notification': data['token-notification'], name: data.name.split(' ').shift()})
            }))

            await this.sender('push-notification', JSON.stringify({users, _idPublication: messageJSON._idPublication}))

            console.table(users)
            
            this.channel?.ack(message)
        })
    }
}