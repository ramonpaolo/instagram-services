from receiver import PikaConsumer
import sys
import time

print("Oi")

time.sleep(5)

def main():
    print("Iniciando...")
    pikaConsumer = PikaConsumer("notification")
    print("Vamos consumir")
    time.sleep(5)
    pikaConsumer.consumer()

main()

# if __name__ == "__main__":
#     try:
#         main()
#     except KeyboardInterrupt:
#         print("saindo")
#         sys.exit(0)