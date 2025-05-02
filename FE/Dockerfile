# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Set environment variables
# ENV NEXT_PUBLIC_API_URL=http://localhost:3000/

# Build the Next.js application
RUN npm run build


# Expose the port your app will run on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
