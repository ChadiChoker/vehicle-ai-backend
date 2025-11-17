# Use official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files (cached install)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy all source code
COPY . .

# Expose app port
EXPOSE 8000

# Start the app (no nodemon)
CMD ["node", "src/index.js"]
