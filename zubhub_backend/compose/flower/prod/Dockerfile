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


WORKDIR /flower

# copying neccessary files to work directory
COPY ./compose/flower/requirements.txt /flower/

RUN pip install --upgrade pip wheel \
  # Requirements are installed here to ensure they will be cached.
  && pip install -r /flower/requirements.txt

# copy project
COPY ./zubhub/ /flower/zubhub/

COPY ./compose/flower/prod/start-flower /flower/start-flower
RUN sed -i 's/\r$//g' /flower/start-flower
RUN chmod +x /flower/start-flower

ENTRYPOINT [ "/flower/start-flower" ]
