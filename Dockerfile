FROM node:8.9.0-alpine

COPY . /code

WORKDIR /code

RUN npm install --production 

ENTRYPOINT npm start