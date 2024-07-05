# forecasting
Java 21 application using the following framework:
- Spring Boot 3.3.0
Uses an in memory H2 DB
# UefaEk2024PronoApp
 Angular 17 app 

# How-to
Run following docker command:
`docker compose -f docker-compose-forecasting.yml up`

After images are pulled & created navigate, in your browser, to: `http://localhost:8080/groups`

## H2 console
Navigate to: `http://localhost:9200/h2-console/`
JDBC URL: `jdbc:h2:mem:forecasting`
User name: `sa`