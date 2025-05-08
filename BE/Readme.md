# 🚀 Backend Service - Node.js + Express + PostgreSQL

This is the backend service for the modular authentication system. It is built using **Node.js**, **Express.js**, and **PostgreSQL** as the primary database. The architecture is containerized using Docker for consistency across environments.

---

## 🧱 Backend Architecture

The project is organized as follows:

```
src/
│
├── configs/                 # Configuration files for server, app, Swagger, and cron jobs
│   ├── appconfigs.ts
│   ├── cronJobs.ts
│   ├── server.ts
│   └── swaggerConfig.ts
│
├── Controllers/            # Route controllers for various user roles and functionalities
│   ├── adminController.ts
│   ├── authController.ts
│   ├── publicController.ts
│   └── userController.ts
│
├── Db_connection/          # PostgreSQL database configuration
│   └── dbConfig.ts
│
├── helpers/                # Helper utilities for session and login tracking
│   ├── error.ts
│   ├── insertSessionData.ts
│   └── loginAttempts.ts
│
├── lib/                    # Authentication and Redis logic
│   ├── auth.ts
│   └── redis.ts
│
├── middlewares/           # Express middlewares for logging and access control
│   ├── httpLogger.ts
│   ├── isAdmin.ts
│   └── isUserloggedin.ts
│
├── routes/                 # Route definitions
│
├── seeds/                  # Seeding initial data into database
│   └── seedUsers.ts
│
├── utils/                  # Utility functions and libraries
│   ├── common.ts
│   ├── GeoLite2Country.mmdb
│   ├── getLookup.ts
│   └── logger.ts
│
├── app.ts                  # Main app entry point
└── ...
```

---

## 🛠️ Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build and Start in Production

```bash
npm run build
npm start
```

---

## 🧪 Required Environment Variables

The following environment variables are required to run the project:

```env
# App Environment
NODE_ENV=dev

# AWS S3 Config
REGION=
BUCKET_NAME=
AWS_ACCESS_ID=
AWS_SECRET_ACCESS_KEY=

# CORS
CORS_ORIGINS=

# PostgreSQL Config
DB_USER=admin
DB_HOST=localhost         # use postgres-db when outside of container
DB_DATABASE=my_database
DB_PASSWORD=adminpassword
DB_PORT=5433

# Server Port
PORT=5000
```

Make sure to update the `.env` file or Docker environment based on your deployment environment.

---

## 🐳 Docker Support

The backend service includes a `Dockerfile` and `docker-compose.yml` to facilitate containerized development and deployment.