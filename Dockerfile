# Use official Node.js 20 image (with native ESM support)
FROM node:20

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all your source code
COPY . .

# Expose the port your app listens on (8000 by default)
EXPOSE 8000

# Start your app
CMD ["node", "src/index.js"]

COPY .env .
