FROM python:3.8-slim-buster

ENV PYTHONUNBUFFERED 1

# Python build stage

RUN apt-get update \
  # dependencies for building Python packages
  && apt-get install -y build-essential procps netcat \
  # psycopg2 dependencies
  && apt-get install -y libpq-dev \
  # Translations dependencies
  && apt-get install -y gettext \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*


WORKDIR /zubhub_backend

# copying neccessary files to work directory
<<<<<<< HEAD:zubhub_backend/compose/django/Dockerfile
COPY ./requirements.txt /zubhub_backend/
=======
COPY ./compose/web/requirements.txt /zubhub_backend/
>>>>>>> ef3d01d6f755c24082ab4c2472016d64784233ae:zubhub_backend/compose/web/dev/Dockerfile

RUN pip install --upgrade pip wheel \
  # Requirements are installed here to ensure they will be cached.
  && pip install -r /zubhub_backend/requirements.txt


# copy project
COPY ./zubhub/ /zubhub_backend/zubhub/


<<<<<<< HEAD:zubhub_backend/compose/django/Dockerfile
COPY ./compose/django/start /zubhub_backend/start
=======
COPY ./compose/web/dev/start /zubhub_backend/start
>>>>>>> ef3d01d6f755c24082ab4c2472016d64784233ae:zubhub_backend/compose/web/dev/Dockerfile
RUN sed -i 's/\r$//g' /zubhub_backend/start
RUN chmod +x /zubhub_backend/start

COPY ./compose/docker_secrets_expand.sh /docker_secrets_expand.sh
RUN sed -i 's/\r$//g' /docker_secrets_expand.sh
RUN chmod +x /docker_secrets_expand.sh

ENTRYPOINT [ "/zubhub_backend/start" ]