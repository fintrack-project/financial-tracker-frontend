# Stage 1: Build the application
FROM node:24-alpine3.20 AS builder

WORKDIR /app

# Install dependencies first for better cache
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Development environment
FROM node:24-alpine3.20 AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# Stage 3: Production environment - Simple web server
FROM node:24-alpine3.20 AS prod

WORKDIR /app

# Install serve package for serving static files
RUN npm install -g serve

# Copy the build output from the builder stage
COPY --from=builder /app/build ./build

EXPOSE 3000

# Serve the React app on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]