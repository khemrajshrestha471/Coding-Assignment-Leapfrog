FROM node:22.14.0

# Accept the port as a build argument
ARG PORT

# Set the port as an environment variable
ENV PORT=${PORT}

# Setting the working directory to /app (root of the frontend project in the container)
WORKDIR /app

# Copy package.json and package-lock.json from the frontend folder to /app in the container
COPY package*.json ./

# Install dependencies in /app/node_modules
RUN npm install

# Copy the rest of the frontend code to /app in the container
COPY . .

# Set the working directory to /app/src/app (my frontend working directory in the container)
WORKDIR /app

# Build the Next.js app
RUN npm run build

# Expose the port
EXPOSE ${PORT}

# Start the application
CMD ["npm", "run", "dev"]