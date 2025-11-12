FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY mvnw .
COPY pom.xml .
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:resolve
COPY src ./src
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]
