# Use official Node.js LTS image
FROM node:lts

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY BACKEND/package*.json ./
RUN npm install --production

# Copy backend source code
COPY BACKEND/ ./

# Copy .env file if present
COPY BACKEND/.env ./

# Expose port (default 3000, change if needed)
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
