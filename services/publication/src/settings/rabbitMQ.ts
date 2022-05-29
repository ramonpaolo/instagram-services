import amqplib from 'amqplib'

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
            
            this.channel?.ack(message)
        })
    }
}