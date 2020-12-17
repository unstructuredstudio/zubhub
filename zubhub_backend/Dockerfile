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
COPY requirements.txt /zubhub_backend/

RUN pip install --upgrade pip wheel \
  # Requirements are installed here to ensure they will be cached.
  && pip install -r /zubhub_backend/requirements.txt

# copy project
COPY . /zubhub_backend/


COPY /start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY /start-celeryworker /start-celeryworker
RUN sed -i 's/\r$//g' /start-celeryworker
RUN chmod +x /start-celeryworker

COPY /start-flower /start-flower
RUN sed -i 's/\r$//g' /start-flower
RUN chmod +x /start-flower
