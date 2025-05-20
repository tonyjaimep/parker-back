up:
	docker compose up -d --build

start:
	docker compose start

down:
	docker compose down

stop:
	docker compose stop

migrate-dbs:
	docker compose exec identity-service npm run db:migrate
	docker compose exec lots-service npm run db:migrate
	docker compose exec reservations-service npm run db:migrate

logs:
	docker compose logs server -f

build:
	npm run build
	docker build -t parker-back-server:latest .
	docker build -t parker-back-db:latest -f ./db.Dockerfile .

deploy-local: build
	eval $(minikube -p minikube docker-env)
	minikube start
	minikube image load parker-back-server:latest
	minikube image load parker-back-db:latest
	kubectl apply -f k8s/deploy

local-service-mesh: build
	minikube start
	minikube image load parker-back-server:latest
	minikube image load parker-back-db:latest
	./istio-setup.sh

minikube-migrate-db:
	kubectl apply -f k8s/jobs/db-migration-job.yaml
