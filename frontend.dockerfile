FROM node:alpine3.16

RUN mkdir -p /app

WORKDIR /app

COPY src/js/package*.json ./

RUN npm install

COPY src/js .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]