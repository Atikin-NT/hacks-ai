FROM python:3.8-alpine

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

ADD repositories /etc/apk/repositories
RUN apk add --update python python-dev gfortran py-pip build-base py-numpy@community

RUN pip install -r requirements.txt

COPY . /app

ENTRYPOINT ["python"]
CMD ["app.py"]
