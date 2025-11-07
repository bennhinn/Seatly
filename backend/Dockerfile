# Development Dockerfile for Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]
