FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Clean up
RUN apt-get autoremove -y && apt-get clean -y
