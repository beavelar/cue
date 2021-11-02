FROM python:3.9.7

WORKDIR /realtime

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "-u", "./server.py"]