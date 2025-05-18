# Parker Backend

This is a NestJS monolith application that acts as the backend for Parker, a parking lot management app.

## Local Development


### Run the server with Docker

1. Make sure that the Docker daemon is running.
2. Run `make up` to build and run the relevant services.
3. Run `curl localhost:3000/health` to verify that the server is running.
4. If you are having issues due to the database not being configured, check the following sections.

### Database setup
```
make db-migrate
```

### Seed mock data
```
make seed-dev
```

### Running tests

```
make test-e2e
```

## Service management

A Grafana and a Prometheus instance are configured to monitor the application.
To access them, run:
```
make up
```

Then navigate to `localhost:3030` for Grafana and `localhost:9090` for Prometheus.
