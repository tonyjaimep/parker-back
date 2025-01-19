# Development stage
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Add package management files
COPY package*.json ./

# Install dependencies with package lock for consistency
RUN npm ci

# Add node_modules/.bin to PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

CMD ["sh", "./entrypoint.sh"]
