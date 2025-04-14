# Dockerfile for Strapi Application (Mars Lab)
# Multi-stage build for optimized production deployment

# Build stage
FROM node:18-bullseye AS build

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    gcc \
    autoconf \
    automake \
    libtool \
    make \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

# Install dependencies with node-gyp support
RUN npm ci

# Copy application files
COPY . .

# Build the Strapi admin panel
RUN npm run build

# Production stage
FROM node:18-bullseye

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Create a non-root user and switch to it
RUN groupadd -r strapi && \
    useradd -r -g strapi -d /app strapi && \
    chown -R strapi:strapi /app

# Copy from build stage, only the required files/directories
# Copy from build stage, only the required files/directories for Strapi
COPY --from=build --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=build --chown=strapi:strapi /app/package.json ./package.json
COPY --from=build --chown=strapi:strapi /app/package-lock.json ./package-lock.json
COPY --from=build --chown=strapi:strapi /app/.env* ./
COPY --from=build --chown=strapi:strapi /app/public ./public
COPY --from=build --chown=strapi:strapi /app/config ./config
COPY --from=build --chown=strapi:strapi /app/src ./src
COPY --from=build --chown=strapi:strapi /app/database ./database
COPY --from=build --chown=strapi:strapi /app/build ./build
COPY --from=build --chown=strapi:strapi /app/types ./types
# Add any additional Strapi files/folders needed for production

# Set proper permissions
RUN chown -R strapi:strapi /app

# Tell Docker about the port Strapi will be running on
EXPOSE 1337

# Switch to non-root user
USER strapi

# Command to run the application
CMD ["npm", "run", "start"]

