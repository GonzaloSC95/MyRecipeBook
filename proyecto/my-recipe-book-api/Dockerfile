# 1. Construcción
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Imagen de ejecución
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto por la app
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
