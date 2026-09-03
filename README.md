# Reactive Food Ordering

A small, non-blocking food-ordering API built with Java 21, Spring Boot and Spring WebFlux. This is the application foundation for a production-style DevSecOps project covering CI quality gates, containers, Kubernetes, Argo CD, observability, high availability and disaster recovery.

## Current features

- Create, list, retrieve and confirm food orders
- Reactive APIs using Reactor `Mono` and `Flux`
- Request validation and structured error responses
- Liveness and readiness endpoints
- Prometheus metrics endpoint
- Automated API tests and GitHub Actions CI
- Multi-stage, non-root Docker image
- Responsive React frontend with live filtering, cart calculations and API states

The first version deliberately uses an in-memory repository. PostgreSQL/R2DBC, Kafka, Redis and additional microservices will be introduced incrementally so every architectural change remains understandable and testable.

## Run locally

Requirements: Java 21.

```bash
./mvnw spring-boot:run
```

In another terminal, run the frontend (Node.js 22):

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies API requests to the backend on port 8080.

The React interface is also published as a static demonstration on
[GitHub Pages](https://ravi2001-cell.github.io/reactive-food-ordering/). Pages uses
demo-mode order submission because a static host cannot run the Java backend.

Create an order:

```bash
curl -X POST http://localhost:8080/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Ravi","restaurantName":"Spice Kitchen","items":["Biryani","Raita"],"totalAmount":350.00}'
```

Useful endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /api/orders` | List orders |
| `GET /actuator/health` | Application health |
| `GET /actuator/health/liveness` | Kubernetes liveness probe |
| `GET /actuator/health/readiness` | Kubernetes readiness probe |
| `GET /actuator/prometheus` | Prometheus metrics |

## Planned DevSecOps stages

1. SonarQube analysis and Quality Gate
2. Required PR reviews and protected `main` branch
3. Trivy and OWASP dependency scanning
4. Image publishing to Amazon ECR
5. Helm packaging and Argo CD GitOps deployment
6. Prometheus, Grafana and ELK observability
7. CloudWatch and CloudTrail integration
8. Multi-AZ high availability and regional disaster recovery
