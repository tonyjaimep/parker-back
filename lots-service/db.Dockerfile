FROM postgres:17

RUN apt update

RUN apt install -y\
  postgresql-common\
  postgis

RUN echo "CREATE EXTENSION IF NOT EXISTS postgis;" >> /docker-entrypoint-initdb.d/init-postgis.sql
