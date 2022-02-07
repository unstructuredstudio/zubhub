this := $(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
PROJECT_DIR := $(dir $(this))
help:
	@echo "Make targets:"
	@echo "============="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'
.PHONY: help

start: ## Start the docker-compose containers
	docker-compose -f docker-compose.yml up --detach --build
.PHONY: start

stop:  ## Stop the docker-compose containers
	docker-compose -f docker-compose.yml stop
.PHONY: stop

down:  ## Stop and remove the docker-compose containers
	docker-compose -f docker-compose.yml down
.PHONY: down

restart: stop start  ## Restart the docker-compose containers
.PHONY: restart

status:  ## Show status of the docker-compose containers
	docker-compose -f docker-compose.yml ps
.PHONY: status

node-shell:  ## Get an interactive shell inside the web container
	docker-compose exec zubhub_frontend bash
.PHONY: node-shell

tail:  ## Tail logs from the docker-compose containers
	docker-compose -f docker-compose.yml logs --follow
.PHONY: tail

clean: ## Remove stopped containers, networks not currently in use, images not currently in use, build caches
	yes | docker system prune
.PHONY: clean

deep-clean: ## Remove stopped containers, networks not currently in use, images not currently in use, build caches
	yes | docker system prune -a
.PHONY: deep-clean

destroy:  ## Remove stopped containers, networks not currently in use, images not currently in use, volumes not currently in use, build caches
	yes | docker system prune -a --volumes
.PHONY: destroy