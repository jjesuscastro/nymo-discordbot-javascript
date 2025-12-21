# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port (if needed for health checks or other purposes)
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
