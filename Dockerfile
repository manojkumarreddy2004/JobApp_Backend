# Use Node LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose application port (adjust if needed)
EXPOSE 5000

# Start the app
CMD ["node", "src/app.js"]
