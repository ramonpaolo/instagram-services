import json
import time
from send_notification import FirebaseMessaging
from dotenv import load_dotenv
from os import environ
import pika
from sender import PikaSender

load_dotenv()

class PikaConsumer():
    queue = ''
    def __init__(self, queue: str):
        self.queue = queue

        global channel
        global connection
        global firebaseMessaging
        global connectionSender

        connectionSender = PikaSender(queue="token")

        firebaseMessaging = FirebaseMessaging()

        URL = environ.get("URL")
        connection = pika.BlockingConnection(pika.URLParameters(URL))
        channel = connection.channel()
        # self.consumer()

    def on_message(self, ch, method, header, body):
        payload = json.loads(body)
        print(payload)
        if method.routing_key == 'notification':
            _id = payload["_idOwner"]
            text = payload["text"]
            image = payload["images"][0]

            connectionSender.sender_messages(json.dumps({'_id': _id, 'text': text, 'image': image}))

        elif method.routing_key == 'token-notification':
            _id = payload["_id"]
            text = payload["text"]
            image = payload["image"]
            tokens = payload["tokens"]

            tokens = tokens + [payload["self-token"]]

            author = payload["author"]
            title = 'Publicação nova de ' + author

            time.sleep(5)
            firebaseMessaging.send_notification(title=title, image=image, text=text, tokens=tokens)

        channel.basic_ack(delivery_tag=method.delivery_tag)

    def consumer(self):
        print("Iniciando consumers...")
        time.sleep(5)
        channel.basic_consume('token-notification', on_message_callback=self.on_message)
        channel.basic_consume('notification', on_message_callback=self.on_message)
        channel.start_consuming()
        # try:
        # except KeyboardInterrupt:
        #     channel.stop_consuming()
        #     channel.close()