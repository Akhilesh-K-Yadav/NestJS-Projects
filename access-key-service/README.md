# Access Key Management Service

A NestJS-based microservice for generating and managing access keys with rate limits and expiration times. This service supports admin operations (create, delete, update, list keys) and user queries (fetch plan details, disable keys). It communicates asynchronously with the Web3 Token Information Service via Redis Pub/Sub.

## Description

This microservice is part of a Proof of Concept (POC) for an Access Key Management and Token Information Retrieval System. It uses SQLite for storage and publishes key updates to Redis for the second microservice to consume. Authentication is assumed to be handled by an external gateway.

## Prerequisites

- Node.js (v16 or higher)
- npm
- Redis (running on `localhost:6379`)
- Docker (for Redis)

## Project Setup

# Install dependencies
npm install

# Ensure Redis is running
docker run -d -p 6379:6379 redis


## Environment Variables
Create a .env file in the project root:

env:
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_PATH=./db.sqlite

## Compile and Run

# Development mode
npm run start:dev

# Production mode
npm run start:prod

# The service runs on http://localhost:3000.

## API Endpoints
POST /keys: Create a new key ({ "rateLimit": 10, "expiration": 1746729600000 })

GET /keys: List all keys

GET /keys/:key: Get key plan details

PUT /keys/:key: Update key ({ "rateLimit": 20 })

DELETE /keys/:key: Delete a key

POST /keys/:key/disable: Disable a key


## Run Tests

# Unit and integration tests
npm run test

# Test coverage
npm run test:cov

## Architecture
Framework: NestJS (TypeScript)

Database: SQLite (TypeORM)

Event Streaming: Redis Pub/Sub

Testing: Jest (unit and integration tests)

## Notes
This is a POC with dummy components (e.g., no authentication).

Key updates are published to Redis for the token-info-service to sync.

Tests cover key creation and API endpoints.

## License
MIT