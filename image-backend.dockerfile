FROM public.ecr.aws/docker/library/openjdk:17

RUN mkdir -p /app

WORKDIR /app

COPY /build/libs/cssundays-0.0.1.jar cssundays-0.0.1.jar

EXPOSE 8080

CMD ["java", "-jar", "-Dspring.profiles.active=prod", "cssundays-0.0.1.jar"]