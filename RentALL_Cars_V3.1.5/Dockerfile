FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

RUN touch .env

# Create necessary directories
RUN mkdir -p build/public/assets
RUN mkdir -p images/upload images/banner images/avatar images/document
RUN mkdir -p images/popularLocation images/home images/claims
RUN mkdir -p images/favicon images/whyhost images/logo images/og-image

# Build the application for production
RUN yarn run build

# Expose port
EXPOSE 3000
EXPOSE 3001

# Start command using the production script
CMD ["yarn", "run", "start"]