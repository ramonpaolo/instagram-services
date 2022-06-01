from dotenv import load_dotenv
from os import environ
import pika

load_dotenv()

class PikaSender():
    queue = ''
    def __init__(self, queue: str):
        self.queue = queue

        global channel
        global connection

        URL = environ.get("URL")
        connection = pika.BlockingConnection(pika.URLParameters(URL))
        channel = connection.channel()
        channel.queue_declare(queue=self.queue, durable=True)

    def sender_messages(self, message: str):
        try:
            channel.basic_publish(exchange="", body=message, routing_key=self.queue)
        except:
            print("Mensagem não enviada no RabbitMQ")