FROM python:3.7-alpine

WORKDIR /app

COPY . .

RUN python -m venv /opt/venv

RUN pip install -r requirements.txt

# RUN echo $PATH

CMD ["python", "main.py"]