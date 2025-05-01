# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install
# npm install -g --save-dev @types/pm2

# Copy the rest of the application
COPY . .

RUN npm run build

# RUN npm run devseed    // Uncomment this line if you want to prepopulate the database

# Start the app
CMD ["npm", "run" ,"start"]
