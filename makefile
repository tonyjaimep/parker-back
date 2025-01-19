db-generate:
	docker compose exec server drizzle-kit generate --name $(NAME)

db-migrate:
	docker compose exec server drizzle-kit migrate

db-reset:
	docker compose down db
	docker volume rm parker-back_db-data
	docker compose up db -d

up:
	docker compose up -d --build

down:
	docker compose down

stop:
	docker compose stop

start:
	docker compose start

logs:
	docker compose logs server -f
