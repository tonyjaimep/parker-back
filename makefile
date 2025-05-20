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

deploy-local: build
	eval $(minikube -p minikube docker-env)
	minikube start
	kubectl apply -f k8s/deploy

local-service-mesh: build
	minikube start
	./istio-setup.sh
