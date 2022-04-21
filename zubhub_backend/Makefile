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

web-shell:  ## Get an interactive shell inside the web container
	docker-compose exec web bash
.PHONY: web-shell

web-django-shell: ## Get a django Ipython shell inside the web container
	docker-compose exec web bash -c "python zubhub/manage.py shell_plus"
.PHONY: web-django-shell

media-shell:  ## Get an interactive shell inside the media container
	docker-compose exec media bash
.PHONY: media-shell

media-django-shell: ## Get a django Ipython shell inside the media container
	docker-compose exec media bash -c "python media/manage.py shell"
.PHONY: media-django-shell

db-shell:  ## Get an interactive shell inside the db container
	docker-compose exec db bash
.PHONY: db-shell

rabbitmq-shell:  ## Get an interactive shell inside the rabbitmq container
	docker-compose exec rabbitmq bash
.PHONY: rabbitmq-shell

celery-shell:  ## Get an interactive shell inside the celery_worker container
	docker-compose exec celery_worker bash
.PHONY: celery-shell

tail:  ## Tail logs from the docker-compose containers
	docker-compose -f docker-compose.yml logs --follow
.PHONY: tail

tail-web: ## Tail logs from web container
	docker-compose -f docker-compose.yml logs --follow web
.PHONY: tail-web

tail-media: ## Tail logs from media container
	docker-compose -f docker-compose.yml logs --follow media
.PHONY: tail-media

tail-db: ## Tail logs from db container
	docker-compose -f docker-compose.yml logs --follow db
.PHONY: db

tail-rabbit: ## Tail logs from rabbitmq container
	docker-compose -f docker-compose.yml logs --follow rabbitmq
.PHONY: tail-rabbit

tail-celery: ## Tail logs from celery container
	docker-compose -f docker-compose.yml logs --follow celery_worker
.PHONY: tail-celery

migrations: ## Run `manage.py makemigrations`
	docker-compose -f docker-compose.yml exec web bash -c "python zubhub/manage.py makemigrations"
.PHONY: migrations

migrate: ## Run `manage.py migrate`
	docker-compose -f docker-compose.yml exec web bash -c "python zubhub/manage.py migrate"
.PHONY: migrate

test: ## Run `manage.py test`
	docker-compose -f docker-compose.yml exec web bash -c "cd zubhub && python manage.py test"
.PHONY: test

admin-user:
	@echo "===="
	@echo "== DANGER: don't forget to delete this user after you have created a proper superuser!!! =="
	@echo "===="
	docker-compose -f docker-compose.yml exec web bash  -c "echo 'echo \"from django.contrib.auth \
	import get_user_model;User = get_user_model();superusers = User.objects.filter(is_superuser=True);\
	user = User.objects.create_superuser(\\\"dummy\\\", \\\"dummy@mail.com\\\", \\\"dummy_password\\\") \
	if superusers.count() == 0 else superusers.none(); \
	hasattr(user, \\\"is_staff\\\") and setattr(user, \\\"is_staff\\\", True); \
	user and user.save(); \
	print(\\\"new super user created successfully\\\") if hasattr(user, \\\"is_staff\\\") \
	else print(\\\"superuser already exists\\\");\" | python /zubhub_backend/zubhub/manage.py shell' > /dummy.sh"

	docker-compose -f docker-compose.yml exec web bash /dummy.sh
	docker-compose -f docker-compose.yml exec web bash -c "rm /dummy.sh"
.PHONY: admin-user

init: .env start migrate admin-user  ## Initialize docker-compose containers
.PHONY: init

search-index:
	docker-compose -f docker-compose.yml exec web bash -c 'echo \
	"from projects.tasks import update_search_index; update_search_index.delay()"\
	| python /zubhub_backend/zubhub/manage.py shell'
.PHONY: search-index

messages:  ## Create/update translatable messages
	@echo "== Make messages =="
	docker-compose exec web sh -c " \
		python zubhub/manage.py makemessages -a \
		&& python zubhub/manage.py compilemessages \
	"
.PHONY: messages

erd: ## Draw Entity Relationship Diagram Of the Data Model In PNG format
	docker-compose -f docker-compose.yml exec web bash -c " \
	python zubhub/manage.py graph_models --rankdir LR -a -g -o zubhub/docs/erd.png \
	"
.PHONY: erd

schema: ## Generate Web Server OpenAPI Schema
	docker-compose -f docker-compose.yml exec web bash -c " \
	python zubhub/manage.py generateschema > zubhub/docs/zubhub-openapi-schema.yml \
	"
.PHONY: schema



clean: ## Remove stopped containers, networks not currently in use, images not currently in use, build caches
	yes | docker system prune
.PHONY: clean

deep-clean: ## Remove stopped containers, networks not currently in use, images not currently in use, build caches
	yes | docker system prune -a
.PHONY: deep-clean

destroy:  ## Remove stopped containers, networks not currently in use, images not currently in use, volumes not currently in use, build caches
	yes | docker system prune -a --volumes
.PHONY: destroy

.env:  ## Generate a .env file for local development
	bash ./compose/make_backend_env.sh ./.env