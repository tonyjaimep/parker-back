FROM postgres:17

RUN apt update

RUN apt install -y\
  postgresql-common\
  postgis
