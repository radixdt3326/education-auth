# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

RUN apk add curl

# Copy the entire application
COPY . .

# Declare the build-time argument
ARG NEXT_PUBLIC_API_URL

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN npm run build


# Expose the port your app will run on
# EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
