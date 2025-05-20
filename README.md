# Parker Backend

This is a NestJS distributed application that acts as the backend for Parker, a parking lot management app.


## Local Development

### Dependencies

- Node 23
- Docker compose (Development)
- Minikube (Development)

### IDE Setup

Run `npm install` to install the javascript dependencies.

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

## Local Deployment

```
make deploy-local
```

This will build Docker images of the server and the database, and deploy them
to a local Kubernetes cluster using Minikube.

### Service Mesh

This command will install `istio` in the current directory, deploy to the
minikube cluster, and configure the application to use Istio for service mesh
capabilities.

```
make local-service-mesh
```

At the end of the command, the output will give the commands to run Grafana and
Kiali, which are the observability tools for Istio.

#### Grafana
![image](https://github.com/user-attachments/assets/7c415dd2-db0a-4f38-a4e8-68a7894b939d)

#### Kiali
![image](https://github.com/user-attachments/assets/fe512832-a051-401c-8fca-3a6db349dac2)
