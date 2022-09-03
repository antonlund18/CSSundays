FROM node:alpine3.16 as build
RUN mkdir -p /app
WORKDIR /app
COPY src/webapp/package*.json .
RUN npm install
COPY src/webapp .
RUN npm run build

FROM nginx:1.19
COPY src/webapp/nginx/nginx.conf etc/nginx/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html