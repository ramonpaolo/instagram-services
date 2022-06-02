import amqplib from 'amqplib'

// Interfaces
import IPublication from '../interfaces/publication-interface';

// Controllers
import { createPublication } from '../controllers/publication-controller';

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
            
            const msg = JSON.parse(message.content.toString('utf-8'))

            if(queue === 'publication'){
                const publication: IPublication | false = await createPublication({_idOwner: msg._id, author: msg.author, images: msg.images, text: msg.text});
            
                if(publication === false) return this.channel?.cancel(message.fields.consumerTag)
                this.sender('notification', JSON.stringify(publication))
                console.log('Enviado para \'notification\'')
            }

            this.channel?.ack(message)
        })
    }
}