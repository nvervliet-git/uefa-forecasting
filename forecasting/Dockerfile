#
# Build stage
#
FROM eclipse-temurin:21-jdk-jammy AS build
ENV HOME=/usr/app
RUN mkdir -p $HOME
WORKDIR $HOME
ADD . $HOME
RUN ./mvnw -f $HOME/pom.xml clean package

#
# Package stage
#
FROM eclipse-temurin:21-jre-jammy
ARG JAR_FILE=/usr/app/target/*.jar
COPY --from=build $JAR_FILE /app/runner.jar
EXPOSE 9200
#ENTRYPOINT java -jar /app/runner.jar


ENTRYPOINT ["java","-jar","/app/runner.jar" ]
#-web -webAllowOthers -tcp -tcpAllowOthers -browser