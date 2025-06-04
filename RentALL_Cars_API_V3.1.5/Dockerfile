FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install --only=production

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 4000
EXPOSE 4001

# Command to run the application
CMD ["yarn", "start"]