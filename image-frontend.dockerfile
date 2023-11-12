FROM public.ecr.aws/docker/library/node:lts-alpine3.17 AS build
RUN mkdir -p /app
WORKDIR /app
COPY src/webapp/package*.json ./
RUN npm install --force
COPY src/webapp/ ./
RUN npm run build

FROM public.ecr.aws/nginx/nginx:1.19 AS base
COPY src/webapp/nginx/nginx.conf etc/nginx/nginx.conf

COPY --from=build /app/build/ /usr/share/nginx/html/