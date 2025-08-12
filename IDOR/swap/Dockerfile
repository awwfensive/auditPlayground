# Use official Node.js LTS Alpine image for a small footprint
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all application files
COPY . .

# Expose the port the app runs on (change if needed)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
