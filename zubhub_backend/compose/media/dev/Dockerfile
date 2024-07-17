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

RUN apt-get update && apt-get install ffmpeg -y


WORKDIR /home

# copying neccessary files to work directory
COPY ./compose/media/requirements.txt /home/

RUN pip install --upgrade wheel \
  # pip versions greater than 24.0 fails to install celery 4.4.0. pin pip until we are ready to upgrade celery
  && pip install pip==24.0 \
  # Requirements are installed here to ensure they will be cached.
  && pip install -r /home/requirements.txt


# copy project
COPY ./media/ /home/media/


COPY ./compose/media/dev/start /home/start
RUN sed -i 's/\r$//g' /home/start
RUN chmod +x /home/start

COPY ./compose/docker_secrets_expand.sh /docker_secrets_expand.sh
RUN sed -i 's/\r$//g' /docker_secrets_expand.sh
RUN chmod +x /docker_secrets_expand.sh

ENTRYPOINT [ "/home/start" ]
