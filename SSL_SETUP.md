# 🔐 SSL Certificate Setup Guide

## **📋 Environment Overview**

### **Development Environment**
- **No SSL required** ✅
- Frontend: React dev server on port 3000
- Backend: Spring Boot on port 8080
- Communication: HTTP only
- Hot reloading enabled

### **Production Environment**
- **SSL required** 🔒
- Frontend: Nginx on ports 80/443
- Backend: Spring Boot on port 8080
- Communication: HTTPS required
- Static file serving

## **🚀 Let's Encrypt Setup for Production**

### **Prerequisites**
1. Domain ownership: `johnmjkim.com`
2. Domain pointing to your server: `220.233.25.14`
3. Port 80 accessible for verification

### **Step 1: Generate Let's Encrypt Certificates**

```bash
# Navigate to frontend directory
cd financial-tracker-frontend/ssl-certificates

# Generate certificates (requires sudo for port 80 access)
sudo certbot certonly --standalone -d johnmjkim.com --email admin@johnmjkim.com --agree-tos --non-interactive

# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/johnmjkim.com/fullchain.pem nginx-selfsigned.crt
sudo cp /etc/letsencrypt/live/johnmjkim.com/privkey.pem nginx-selfsigned.key

# Set proper ownership
sudo chown $USER:$USER nginx-selfsigned.crt nginx-selfsigned.key

# Set proper permissions
chmod 644 nginx-selfsigned.crt
chmod 600 nginx-selfsigned.key
```

### **Step 2: Certificate Renewal**

Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for automatic renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Step 3: Update Certificates in Project**

After renewal, update your project certificates:

```bash
cd financial-tracker-frontend/ssl-certificates
sudo cp /etc/letsencrypt/live/johnmjkim.com/fullchain.pem nginx-selfsigned.crt
sudo cp /etc/letsencrypt/live/johnmjkim.com/privkey.pem nginx-selfsigned.key
sudo chown $USER:$USER nginx-selfsigned.crt nginx-selfsigned.key
```

## **🔧 Development SSL (Optional)**

If you want HTTPS in development for testing:

```bash
# Generate self-signed certificate for development
cd financial-tracker-frontend/ssl-certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout dev-nginx-selfsigned.key \
  -out dev-nginx-selfsigned.crt \
  -subj "/C=US/ST=State/L=City/O=FinTrack/CN=localhost"
```

## **✅ Verification**

### **Check Certificate Validity**
```bash
openssl x509 -in nginx-selfsigned.crt -text -noout
```

### **Test HTTPS Connection**
```bash
curl -I https://johnmjkim.com
```

## **🚨 Troubleshooting**

### **Certificate Not Found**
- Ensure certificates exist in `financial-tracker-frontend/ssl-certificates/`
- Check file permissions (644 for .crt, 600 for .key)

### **Nginx SSL Errors**
- Verify certificate paths in nginx.conf
- Check certificate validity dates
- Ensure private key matches certificate

### **Let's Encrypt Rate Limits**
- Let's Encrypt has rate limits (50 certificates per domain per week)
- Use `--dry-run` to test without counting against limits

## **📝 Notes**

- **Development**: No SSL setup required
- **Production**: Let's Encrypt certificates required
- **Renewal**: Set up automatic renewal via cron
- **Backup**: Keep certificate files secure and backed up 