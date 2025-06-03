# RentAll Cars CI/CD

This project is a full-stack application consisting of a Node.js backend and a React frontend, designed to be deployed on Digital Ocean using GitHub Actions CI/CD. This README provides an overview of the project structure, setup instructions, and deployment guidelines.

## Required Secrets for GitHub Actions

Before deploying, you need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Server Configuration
- `SSH_PRIVATE_KEY` - Private SSH key for server access
- `DROPLET_IP` - IP address of your main Digital Ocean droplet
- `SQL_DROPLET_IP` - IP address of your MySQL database droplet

### Database Configuration
- `DATABASE_USERNAME` - MySQL database username
- `DATABASE_PASSWORD` - MySQL database password
- `DATABASE_DBNAME` - MySQL database name

### Application Secrets
- `JWT_SECRET` - Secret key for JWT token generation
- `SITENAME` - Name of your application/site

### Custom Domain & SSL
- `CUSTOM_DOMAIN` - Your custom domain (e.g., `example.com`)
- `SSL_EMAIL` - Email address for Let's Encrypt SSL certificate

### Payment Integration
- `STRIPE_SECRET` - Stripe secret key for payment processing
- `PAYPAL_RETURN_URL` - PayPal return URL after successful payment
- `PAYPAL_CANCEL_URL` - PayPal cancel URL for cancelled payments
- `PAYPAL_SUCCESS_REDIRECT_URL` - PayPal success redirect URL

### External APIs
- `GOOGLE_MAP_SERVER_API` - Google Maps API key for server-side usage
- `GOOGLE_MAP_CLIENT_API` - Google Maps API key for client-side usage
- `COINBASE_URL` - Coinbase API URL for cryptocurrency payments
- `PLACE_DETAILS_URL` - Google Places API URL for place details
- `PLACES_AUTOCOMPLETE_URL` - Google Places API URL for autocomplete

### System Configuration
- `CRON_TIMEZONE` - Timezone for cron jobs (e.g., `America/New_York`)

## Custom Domain Setup

### DNS Configuration

1. **Configure A Record:**
   - Point your root domain to your droplet IP
   - Example: `example.com` → `YOUR_DROPLET_IP`

2. **Configure CNAME Record:**
   - Point www subdomain to your root domain
   - Example: `www.example.com` → `example.com`

### Domain Verification

Before running the deployment, ensure your domain is properly configured:

```bash
# Check if domain resolves to your server
nslookup your-domain.com

# Test HTTP connectivity
curl -I http://your-domain.com
```

### SSL Certificate

The deployment automatically configures SSL certificates using Let's Encrypt:
- Certificates are automatically requested during deployment
- Auto-renewal is configured via crontab
- Both root domain and www subdomain are included in the certificate

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd rentall-cars-cicd
   ```

2. **Configure GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to `Settings > Secrets and variables > Actions`
   - Add all the required secrets listed above

3. **Prepare Your Digital Ocean Droplets**
   - Create a main droplet for the application
   - Create a separate droplet for MySQL database
   - Ensure both droplets can communicate with each other
   - Set up SSH key access for both droplets

4. **Environment Variables**
   - Copy the `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

5. **Docker Setup (for local development)**
   - Ensure Docker is installed and running on your machine.
   - Build the Docker images for both backend and frontend.
   ```bash
   docker-compose -f docker/docker-compose.yml build
   ```

6. **Run the Application Locally**
   ```bash
   docker-compose -f docker/docker-compose.yml up
   ```

## Deployment Guidelines

### GitHub Actions CI/CD

The project uses GitHub Actions for automated deployment. The workflows are defined in the `.github/workflows` directory:

- **full-deploy.yml**: Complete deployment workflow that:
  - Sets up MySQL database on separate droplet
  - Deploys Node.js backend with SSR support
  - Deploys React frontend with Server-Side Rendering
  - Configures Nginx reverse proxy
  - Sets up SSL certificates with Let's Encrypt
  - Configures custom domain with HTTPS redirect

### Deployment Process

1. **Automatic Trigger**: Push to `main` branch triggers deployment
2. **Database Setup**: MySQL is configured on the database droplet
3. **Application Deployment**: Both backend and frontend are deployed
4. **SSL Configuration**: Let's Encrypt certificates are automatically configured
5. **Health Checks**: Automated verification of all services

### Manual Deployment

If you need to deploy manually:

```bash
# SSH into your server
ssh root@YOUR_DROPLET_IP

# Navigate to application directory
cd /var/www/rentall-cars

# Check PM2 processes
pm2 status

# Restart services if needed
pm2 restart all

# Check Nginx status
sudo systemctl status nginx

# View application logs
pm2 logs
```

### SSL Certificate Management

SSL certificates are automatically managed:
- Initial certificate creation during deployment
- Automatic renewal via crontab (runs daily at 12:00)
- Nginx automatically reloads after certificate renewal

To manually renew certificates:
```bash
sudo certbot renew --quiet --deploy-hook 'systemctl reload nginx'
```

## Architecture Overview

### Frontend (React SSR)
- Server-Side Rendering for better SEO
- Runs on port 3000
- Proxied through Nginx

### Backend (Node.js API)
- RESTful API server
- Runs on port 4000
- Socket.io support on port 4001

### Database (MySQL)
- Separate droplet for database
- Remote connections enabled
- Automated backup and restore

### Reverse Proxy (Nginx)
- SSL termination
- Static file serving
- Load balancing
- Security headers

## Monitoring and Logs

### PM2 Process Manager
```bash
# View all processes
pm2 status

# View logs
pm2 logs

# Monitor processes
pm2 monit

# Restart specific process
pm2 restart rentall-frontend-ssr
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Status
```bash
# Check certificate expiration
sudo certbot certificates

# Test SSL configuration
sudo nginx -t
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Failed**
   - Verify domain DNS points to correct IP
   - Check firewall allows port 80/443
   - Manually run: `sudo certbot --nginx`

2. **Application Not Starting**
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check build artifacts exist

3. **Database Connection Issues**
   - Verify MySQL service: `sudo systemctl status mysql`
   - Check firewall allows port 3306
   - Test connection: `mysql -h SQL_DROPLET_IP -u username -p`

## Additional Scripts

- **Health Check**: The `health-check.sh` script can be used to verify that the services are running correctly after deployment.
- **MySQL Setup**: The `setup-mysql.sh` script automates MySQL server configuration.

## Security Considerations

- SSH key-based authentication only
- MySQL on separate droplet
- SSL/TLS encryption
- Security headers configured
- Firewall rules implemented
- Regular security updates via apt

## Conclusion

This README provides a comprehensive overview of the RentAll Cars CI/CD project. Follow the setup instructions to get started, configure all required secrets, set up your custom domain DNS records, and the GitHub Actions workflow will handle the complete deployment process automatically.