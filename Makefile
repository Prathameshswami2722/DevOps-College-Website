.PHONY: install check test build run docker monitoring clean

install:
	npm ci

check:
	npm run check

test:
	npm test

build:
	npm run build

run:
	npm run serve

docker:
	docker compose up --build website

monitoring:
	docker compose --profile monitoring up --build

clean:
	rm -rf dist
