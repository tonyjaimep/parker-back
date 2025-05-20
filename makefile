up:
	docker compose up -d --build

start:
	docker compose start

down:
	docker compose down

stop:
	docker compose stop

migrate-dbs:
	docker compose exec identity-service npm run db:push
	docker compose exec lots-service npm run db:push
	docker compose exec reservations-service npm run db:push

deploy-local: build
	eval $(minikube -p minikube docker-env)
	minikube start
	kubectl apply -f k8s/deploy

migrate-k8s-dbs:
	kubectl apply -f ./k8s/jobs/migrate-lots-db-job.yaml
	kubectl apply -f ./k8s/jobs/migrate-identity-db-job.yaml
	kubectl apply -f ./k8s/jobs/migrate-reservations-db-job.yaml

local-service-mesh:
	minikube start
	./istio-setup.sh
