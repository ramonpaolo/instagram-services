FROM python

WORKDIR /app

COPY ./ ./.env ./

RUN /usr/local/bin/python -m pip install --upgrade pip && pip install -r requirements.txt

CMD ["python", "./main.py"]