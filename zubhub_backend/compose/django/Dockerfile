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
COPY ./requirements.txt /zubhub_backend/

RUN pip install --upgrade pip wheel \
  # Requirements are installed here to ensure they will be cached.
  && pip install -r /zubhub_backend/requirements.txt


# copy project
COPY ./zubhub/ /zubhub_backend/zubhub/


COPY ./compose/django/start /zubhub_backend/start
RUN sed -i 's/\r$//g' /zubhub_backend/start
RUN chmod +x /zubhub_backend/start
