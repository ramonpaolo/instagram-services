import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

class FirebaseMessaging():
    def __init__(self):
        global default_app
        try:
            cred = credentials.Certificate("./credentials.json")
            default_app = firebase_admin.initialize_app(cred)
            print("Conectado com sucesso")
        except:
            print("Falha ao se conectar")

    def send_notification(self, text: str, image: str, title: str, tokens: list):
        try:
            for token in tokens:
                message = messaging.Message(notification=messaging.Notification(title=title, body=text, image=image), data={}, token=token)
                messaging.send(message)
        except:
            print("Falha ao enviar notificação")