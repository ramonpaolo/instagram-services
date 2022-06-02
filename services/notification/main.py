from receiver import PikaConsumer
import sys

def main():
    pikaConsumer = PikaConsumer("notification")
    pikaConsumer.consumer()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("saindo")
        sys.exit(0)