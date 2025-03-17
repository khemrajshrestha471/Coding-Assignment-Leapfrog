FROM node:22.14.0

# Accept the port as a build argument
ARG PORT

# Set the port as an environment variable
ENV PORT=${PORT}

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backend code
COPY . .

# Copy the database folder
COPY database/ /app/database

# Expose the port (optional, for documentation)
EXPOSE ${PORT}

# Start the application
CMD ["node", "index.js"]