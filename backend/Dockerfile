FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY GearShare/mvnw .
COPY GearShare/pom.xml .
COPY GearShare/.mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:resolve
COPY GearShare/src ./src
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]
