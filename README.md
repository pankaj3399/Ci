# RentAll Cars CI/CD

This project is a full-stack application consisting of a Node.js backend and a React frontend, designed to be deployed on Digital Ocean using Docker. This README provides an overview of the project structure, setup instructions, and deployment guidelines.

## Project Structure

```
rentall-cars-cicd
├── .github
│   └── workflows
│       ├── backend-deploy.yml
│       ├── frontend-deploy.yml
│       └── full-deploy.yml
├── docker
│   ├── backend
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   ├── frontend
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   └── docker-compose.yml
├── scripts
│   ├── setup-mysql.sh
│   ├── deploy-backend.sh
│   ├── deploy-frontend.sh
│   └── health-check.sh
├── infrastructure
│   ├── digital-ocean
│   │   ├── droplet-config.yml
│   │   └── mysql-setup.yml
│   └── terraform
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── .env.example
├── docker-compose.prod.yml
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd rentall-cars-cicd
   ```

2. **Environment Variables**
   - Copy the `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

3. **Docker Setup**
   - Ensure Docker is installed and running on your machine.
   - Build the Docker images for both backend and frontend.
   ```bash
   docker-compose -f docker/docker-compose.yml build
   ```

4. **Run the Application Locally**
   ```bash
   docker-compose -f docker/docker-compose.yml up
   ```

## Deployment Guidelines

### CI/CD with GitHub Actions

- The project uses GitHub Actions for CI/CD. The workflows are defined in the `.github/workflows` directory:
  - **backend-deploy.yml**: Deploys the Node.js backend.
  - **frontend-deploy.yml**: Deploys the React frontend.
  - **full-deploy.yml**: Deploys both backend and frontend.

### MySQL Setup

- The MySQL server is set up using the `setup-mysql.sh` script located in the `scripts` directory. This script creates the necessary databases and users.

### Digital Ocean Configuration

- The infrastructure for Digital Ocean is defined in the `infrastructure/digital-ocean` directory, including droplet configuration and MySQL setup.

## Additional Scripts

- **Health Check**: The `health-check.sh` script can be used to verify that the services are running correctly after deployment.


## Conclusion

This README provides a comprehensive overview of the RentAll Cars CI/CD project. Follow the setup instructions to get started, and refer to the deployment guidelines for deploying the application on Digital Ocean.