db-generate: start
	docker compose exec server drizzle-kit generate --name $(NAME)

db-migrate: start
	docker compose exec server drizzle-kit migrate

db-reset: start
	docker compose down db
	docker volume rm parker-back_db-data
	docker compose up db -d

build-e2e:
	docker compose -f test/e2e/compose.yaml up -d --build

start-e2e:
	docker compose -f test/e2e/compose.yaml up -d
	docker compose --env-file test/e2e/test.env -f test/e2e/compose.yaml exec testdb npm run db:migrate

test-e2e: start-e2e
	docker compose --env-file test/e2e/test.env -f test/e2e/compose.yaml exec testdb npm run test:e2e -- --runInBand --detectOpenHandles --forceExit
	docker compose -f test/e2e/compose.yaml down

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
