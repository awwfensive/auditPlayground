# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
COPY index.js ./
COPY index.html ./

# Install dependencies
RUN npm install

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
