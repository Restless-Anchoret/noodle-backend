FROM node:8

WORKDIR /usr/app

COPY package*.json ./
COPY index.js ./
COPY src ./src
COPY migrations ./migrations

RUN npm install

EXPOSE 8080
