FROM public.ecr.aws/nginx/nginx:1.19
COPY src/webapp/nginx/nginx.conf etc/nginx/nginx.conf

FROM public.ecr.aws/docker/library/node:lts-alpine3.17
RUN mkdir -p /app
WORKDIR /app
COPY src/webapp/package*.json ./
RUN npm install
COPY src/webapp/ ./
RUN npm run build

COPY --from=build /app/build/ /usr/share/nginx/html/