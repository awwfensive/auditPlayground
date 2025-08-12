# Use official Node.js LTS image (small Alpine variant)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose the application port (change if needed)
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
