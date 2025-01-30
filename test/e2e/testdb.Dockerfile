FROM postgres:17

RUN apt-get update

RUN apt-get install -y\
  postgresql-common\
  postgis\
  curl

# Set working directory
WORKDIR /usr/src/app

# Add package management files
COPY ./package*.json ./

# Copy source code
COPY . .

ENV NODE_VERSION 20.18.2

# Download and install nvm:
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
  && . ~/.bashrc\
  && nvm install $NODE_VERSION\
  && npm ci

ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
