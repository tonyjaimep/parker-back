# Parker Backend

This is a NestJS distributed application that acts as the backend for Parker, a parking lot management and reservation app.

## Architecture

- `app-service` acts as a backend-for-frontend for the mobile app. It directs requests to the necessary services
- `identity-service` manages user identity, authentication and authorization
- `lots-service` manages parking lot data and availability
- `reservations-service` manages parking reservations

## Local Development

### Dependencies

- Node 23
- Docker compose (Development)
- Minikube (Development)


### IDE Setup

In each microservice subdirectory, run `npm install` to install the javascript dependencies.

### Run backend with Docker

1. Make sure that the Docker daemon is running.
2. Run `make up` to build and run the relevant services.
3. Run `curl localhost:3000/health` to verify that the server is running.
4. If you are having issues due to the database not being configured, check the following sections.

#### Database setup

This command runs the migration scripts on the microservices that have databases

```
make migrate-dbs
```

## Local Deployment with Minikube

```
make deploy-local
```

This will build Docker images of the microservices and the database, and deploy
them to a local Kubernetes cluster using Minikube.

### Migrate Databases

This command works like `make migrate-dbs`, but in the minikube cluster.
It runs the database migrations specified in the current latest image for each
service.

```
make migrate-k8s-dbs
```

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


### Building and Pushing Microservice Images

To build a Docker image of one of the services, run the following command:

```
cd service-to-build
make build
```

This will generate an image of the service.

To publish an image to the Docker hub, run the following command in the microservice subdirectory:

```
make push
```
