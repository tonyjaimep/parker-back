docker-db-generate:
	docker compose exec lots-service npx drizzle-kit generate --name=$(NAME)

docker-db-migrate:
	docker compose exec lots-service npx drizzle-kit push

start:
	docker compose up -d --build

build:
	npm run build
	docker build -t josejaime5271/parker-lots-service:latest --target=production .

push:
	docker push josejaime5271/parker-lots-service:latest
