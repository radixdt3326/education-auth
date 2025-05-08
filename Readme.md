🔐 Auth Service - Modularized Authentication System
This repository is a modularized authentication system extracted from an education platform project. Initially, it consisted of three containerized modules—Frontend, Backend, and Database—built using modern web technologies and Docker for environment consistency.

🚀 Tech Stack
* Frontend: Next.js
* Backend: Node.js with Express.js
* Database: PostgreSQL
* Containerization: Docker
* CI/CD: GitHub Actions
* Cloud Infrastructure: AWS EC2, AWS S3, AWS ECR

📦 Project Structure
* `FE/` - Next.js frontend
* `BE/` - Node.js + Express backend
* `db/` - PostgreSQL container
* `Redis/` - Redis server
* `start-docker.js` - Node script to bootstrap Docker containers

🛠️ Getting Started
1.  Clone the Repository
    ```bash
    git clone [https://github.com/radixdt3326/education-auth](https://github.com/radixdt3326/education-auth)
    cd education-auth
    ```

2.  Run the application:
    ```bash
    node start-docker.js
    ```

## CI/CD Implementation Details

We utilize GitHub Actions for our Continuous Integration and Continuous Deployment (CI/CD) pipelines.  The following describes the actions and deployment pipelines:

### Continuous Integration (CI) Actions

1.  **Build and Push to AWS ECR:**
    * This GitHub Action builds Docker images for the Frontend, Backend, and Database.
    * If all defined test cases pass successfully, these images are pushed to our Amazon Elastic Container Registry (AWS ECR).

2.  **Build and Push to GHCR:**
    * This GitHub Action builds Docker images for the Frontend, Backend, and Database.
    * Upon successful completion of all test cases, these images are pushed to the GitHub Container Registry (GHCR).

### Continuous Deployment (CD) Pipelines

1.  **`backend-deployment`:**
    * This pipeline deploys the latest Backend Docker image from AWS ECR to our Amazon Elastic Compute Cloud (EC2) instances.

2.  **`db-deployment`:**
    * This pipeline deploys the latest Database Docker image from AWS ECR to our designated EC2 instances.

3.  **`front-end-deployment`:**
    * This pipeline deploys the latest Frontend Docker image from AWS ECR to our EC2 instances.

4.  **`Redis-server-deployment`:**
    * This pipeline configures and deploys the Redis server onto our EC2 instances.
