# Stage 1: Build the Angular application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
# The output path is specified in angular.json (dist/avoris-app)
RUN npm run build -- --configuration production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx's web server directory
COPY --from=builder /app/dist/avoris-app/browser /usr/share/nginx/html

# Copy custom Nginx configuration if needed (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf 

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]