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
	docker-compose exec web bash -c "python zubhub/manage.py shell"
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

migrate: ## Run `manage.py migrate`
	docker-compose -f docker-compose.yml exec web bash -c "python zubhub/manage.py migrate"
.PHONY: migrate

admin-user:
	@echo "===="
	@echo "== DANGER: don't forget to delete this user after you have created a proper superuser!!! =="
	@echo "===="
	docker-compose -f docker-compose.yml exec web bash  -c "echo 'echo \"import os; from django.contrib.auth import get_user_model;User = get_user_model();superusers = User.objects.filter(is_superuser=True);user = len(superusers) == 0 and User.objects.create_superuser(\\\"dummy\\\", \\\"dummy@mail.com\\\", os.environ[\\\"SUPERUSER_PASSWORD\\\"]);user.is_staff = True;user.save()\" | python /zubhub_backend/zubhub/manage.py shell' > /dummy.sh"
	docker-compose -f docker-compose.yml exec web bash /dummy.sh
	docker-compose -f docker-compose.yml exec web bash -c "rm /dummy.sh"
.PHONY: admin-user

init: start migrate admin-user  ## Initialize docker-compose containers
.PHONY: init

messages:  ## Create/update translatable messages
	@echo "== Make messages =="
	docker-compose exec web sh -c " \
		python zubhub/manage.py makemessages -a \
		&& python zubhub/manage.py compilemessages \
	"
.PHONY: messages


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