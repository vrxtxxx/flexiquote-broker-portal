
# Insurance Quote Manager API

This is the backend API for the Insurance Quote Manager application, built with Spring Boot.

## Features

- RESTful API for managing insurance quotes
- JWT-based authentication
- PostgreSQL database integration
- Docker support for easy deployment

## Prerequisites

- JDK 17 or later
- Maven 3.6 or later
- PostgreSQL 14 or later (or Docker for containerized deployment)

## Getting Started

### Running Locally

1. Clone the repository
2. Configure the database connection in `src/main/resources/application.properties`
3. Build the project: `mvn clean install`
4. Run the application: `mvn spring-boot:run`

### Running with Docker

1. Build the Docker image: `docker-compose build`
2. Start the services: `docker-compose up`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login

### Quotes

- `GET /api/quotes` - Get all quotes (with optional filtering by broker ID and status)
- `GET /api/quotes/{id}` - Get quote by ID
- `POST /api/quotes` - Create a new quote
- `PUT /api/quotes/{id}` - Update a quote
- `PATCH /api/quotes/{id}/status` - Update quote status
- `DELETE /api/quotes/{id}` - Delete a quote

### Brokers

- `GET /api/brokers` - Get all brokers
- `GET /api/brokers/{id}` - Get broker by ID
- `GET /api/brokers/email/{email}` - Get broker by email
- `POST /api/brokers` - Create a new broker
- `PUT /api/brokers/{id}` - Update a broker
- `DELETE /api/brokers/{id}` - Delete a broker

## Technologies Used

- Spring Boot 3.2.4
- Spring Data JPA
- PostgreSQL
- Lombok
- JWT for authentication
- Docker for containerization

## Project Structure

- `model` - Entity classes representing database tables
- `repository` - Data access interfaces
- `service` - Business logic and data transformation
- `controller` - REST API endpoints
- `dto` - Data Transfer Objects for API communication
- `security` - JWT token provider and security configuration
- `exception` - Global exception handling
- `filter` - JWT authentication filter
