# Use official Node.js 20 image with native ESM support
FROM node:20

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose app port
EXPOSE 8000

# Start app with nodemon for hot reload
CMD ["npm", "run", "dev"]
