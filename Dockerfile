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

# Stage 3: Serve the application using a lightweight web server
FROM nginx:1.28.0-alpine-slim AS prod

# Copy the build output from the builder stage to the Nginx web server
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]