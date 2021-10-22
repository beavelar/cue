FROM python:3.9.7

WORKDIR /scrape

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "-u", "./main.py"]