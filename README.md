# RentAll Cars CI/CD

This project is a full-stack application consisting of a Node.js backend and a React frontend, designed to be deployed on Digital Ocean using GitHub Actions CI/CD. This README provides an overview of the project structure, setup instructions, and deployment guidelines.

## Complete Deployment Guide

### Step 1: SSH Key Setup

#### 1.1 Generate SSH Key Pair (if you don't have one)
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
# Save as: ~/.ssh/id_rsa (default)
# Don't set a passphrase for CI/CD usage
```

#### 1.2 You'll need the .pub key while creating droplets(servers)


### Step 2: Create Digital Ocean Droplets

#### .1 Create Main Application Droplet
1. **Login to Digital Ocean**
   - Go to [Digital Ocean](https://www.digitalocean.com/)
   - Sign in to your account

2. **Create New Droplet**
   - Click "Create" → "Droplets"
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Size**: Basic plan, Regular Intel ($12/month, 2GB RAM, 1 vCPU, 50GB SSD)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) ***(As mentioned in STEP 1.2)***
   - **Hostname**: `rentall-app-server`
   - Click "Create Droplet"

#### 2.2 Create MySQL Database Droplet
1. **Create Second Droplet**
   - Follow same steps as above
   - **Hostname**: `rentall-mysql-server`
   - **Size**: You can use smaller size for database ($6/month, 1GB RAM)
  
#### 2.3 Test SSH connections
```bash
# Test connection to both droplets
ssh root@YOUR_APP_DROPLET_IP
ssh root@YOUR_MYSQL_DROPLET_IP
```


### Step 3: Domain Configuration

#### 3.1 Purchase and Configure Domain
1. **Purchase Domain** from your preferred registrar (Namecheap, GoDaddy, etc.)

2. **Configure DNS Records**
   - **A Record**: `@` → `YOUR_APP_DROPLET_IP`
   - **A Record**: `www` → `YOUR_APP_DROPLET_IP`
   - **CNAME Record**: `www` → `yourdomain.com` (alternative to www A record)

3. **Verify DNS Propagation**
   ```bash
   # Check if domain resolves correctly
   nslookup yourdomain.com
   nslookup www.yourdomain.com
   
   # Should return your droplet IP address
   ```

### Step 4: Configure GitHub Repository

#### 4.1 Fork/Clone Repository
```bash
# Clone the repository
git clone <repository-url>
cd rentall-cars-cicd
```

#### 4.2 Configure GitHub Secrets
1. **Go to Repository Settings**
   - Navigate to `Settings > Secrets and variables > Actions`

2. **Add Required Secrets** (click "New repository secret" for each):

**Server Configuration:**
```
SSH_PRIVATE_KEY = [Content of ~/.ssh/id_rsa file]
DROPLET_IP = [Your main application droplet IP]
SQL_DROPLET_IP = [Your MySQL droplet IP]
```

**Database Configuration:**
```
DATABASE_USERNAME = rentall_user
DATABASE_PASSWORD = [Strong password for MySQL]
DATABASE_DBNAME = rentall
```

**Application Secrets:**
```
JWT_SECRET = [Random 32+ character string]
SITENAME = RentAll Cars
```

**Domain & SSL:**
```
CUSTOM_DOMAIN = yourdomain.com
SSL_EMAIL = your-email@example.com
```

**Payment Integration:**
```
STRIPE_SECRET = sk_test_... (or sk_live_...)
PAYPAL_RETURN_URL = /paypal/return
PAYPAL_CANCEL_URL = /paypal/cancel
PAYPAL_SUCCESS_REDIRECT_URL = /booking/success
```

**External APIs:**
```
GOOGLE_MAP_SERVER_API = [Your Google Maps API key]
GOOGLE_MAP_CLIENT_API = [Your Google Maps API key]
COINBASE_URL = https://api.coinbase.com
PLACE_DETAILS_URL = https://maps.googleapis.com/maps/api/place/details/json
PLACES_AUTOCOMPLETE_URL = https://maps.googleapis.com/maps/api/place/autocomplete/json
```

**System Configuration:**
```
CRON_TIMEZONE = America/New_York
```

### Step 5: Pre-Deployment Configuration

#### 5.1 Configure Backend Settings
**IMPORTANT**: Before pushing to main branch, edit the configuration files with required variables: `/RentALL_Cars_V3.1.5/src/config.js` & `/RentALL_Cars_API_V3.1.5/src/config.js`


### Step 6: Deploy the Application

#### 6.1 Final Pre-Deployment Checklist
- [ ] Both droplets are created and accessible via SSH
- [ ] SSH private key is added to GitHub secrets
- [ ] Domain DNS is configured and propagated
- [ ] All GitHub secrets are configured
- [ ] Backend `src/config.js` is updated with your values
- [ ] Frontend config files are updated (if applicable)
- [ ] Google Maps API key is valid and has required permissions
- [ ] Stripe keys are correct (test or live)

#### 6.2 Trigger Deployment
```bash
# Commit your configuration changes
git add .
git commit -m "Configure production settings"

# Push to main branch to trigger deployment
git push origin main
```

#### 6.3 Monitor Deployment
1. **Watch GitHub Actions**
   - Go to `Actions` tab in your repository
   - Monitor the deployment workflow progress

2. **Check Deployment Logs**
   - Click on the running workflow
   - Monitor each step for any errors

### Step 7: Post-Deployment Verification

#### 7.1 Verify Application
```bash
# Check if your domain loads
curl -I https://yourdomain.com

# Should return 200 OK with proper SSL
```

#### 7.2 Monitor Server Health
```bash
# SSH into your server
ssh root@YOUR_DROPLET_IP

# Check PM2 processes
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates
```

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

2. **Follow the Complete Deployment Guide Above**
   - Complete Steps 1-7 for full deployment setup

3. **Environment Variables**
   - Copy the `.env.example` to `.env` and fill in the required values for local development.
   ```bash
   cp .env.example .env
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

4. **Config.js Issues**
   - Ensure all placeholder values are replaced
   - Verify API keys are valid
   - Check domain URLs are correct

## Security Considerations

- SSH key-based authentication only
- MySQL on separate droplet
- SSL/TLS encryption
- Security headers configured
- Firewall rules implemented
- Regular security updates via apt

## Important Notes

- **Never commit sensitive data** like API keys directly to the repository
- **Always use environment variables** for sensitive configuration
- **Test your configuration** in a staging environment before production
- **Keep your dependencies updated** for security
- **Monitor your application** after deployment for any issues

## Conclusion

This README provides a comprehensive overview of the RentAll Cars CI/CD project. Follow the complete deployment guide step-by-step to ensure successful deployment. Make sure to update all configuration files with your actual values before pushing to the main branch.

For any issues during deployment, check the troubleshooting section or review the GitHub Actions logs for detailed error information.