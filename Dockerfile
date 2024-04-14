# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy your application files
COPY . .

# Define o comando de execução do front end
CMD ["npm", "start"]
