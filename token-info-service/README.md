
---

### README.md for `token-info-service`

```markdown
# Web3 Token Information Service

A NestJS-based microservice for retrieving mock Web3 token information based on access keys. It enforces rate limits, validates key expiration, and logs requests. It syncs key data asynchronously with the Access Key Management Service via Redis Pub/Sub.

## Description

This microservice is part of a Proof of Concept (POC) for an Access Key Management and Token Information Retrieval System. It uses SQLite for storing key data and request logs, and subscribes to Redis for key updates from the first microservice. Authentication is assumed to be handled by an external gateway.

## Prerequisites

- Node.js (v16 or higher)
- npm
- Redis (running on `localhost:6379`)
- Docker (optional, for Redis)

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

# The service runs on http://localhost:3001.

## API Endpoints
GET /tokens?key=<key>: Retrieve mock token information (e.g., { "tokenId": "bitcoin", "name": "Bitcoin", "price": 60000, "marketCap": 1200000000000 })

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
This is a POC with mock token data (not fetched from CoinGecko).

Key data is duplicated from the access-key-service via Redis.

Tests cover token info retrieval and rate limiting.

## License
MIT



