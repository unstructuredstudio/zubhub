FROM python:3.8-slim-buster

ENV PYTHONUNBUFFERED 1

# Python build stage

RUN apt-get update \
  # dependencies for building Python packages
  && apt-get install -y build-essential procps netcat \
  # psycopg2 dependencies
  && apt-get install -y libpq-dev \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*


WORKDIR /celery

# copying neccessary files to work directory
COPY ./compose/celery/requirements.txt /celery/

RUN pip install --upgrade pip wheel \
  # Requirements are installed here to ensure they will be cached.
  && pip install -r /celery/requirements.txt


# copy project
COPY ./zubhub/ /celery/zubhub/

COPY ./compose/celery/prod/start-celeryworker /celery/start-celeryworker
RUN sed -i 's/\r$//g' /celery/start-celeryworker
RUN chmod +x /celery/start-celeryworker

COPY ./compose/docker_secrets_expand.sh /docker_secrets_expand.sh
RUN sed -i 's/\r$//g' /docker_secrets_expand.sh
RUN chmod +x /docker_secrets_expand.sh

ENTRYPOINT [ "/celery/start-celeryworker" ]
