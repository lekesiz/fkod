# Aşama 2: Backend Deployment (Heroku)

## 1. Heroku Setup

### Step 1: Create Heroku Account
- Go to https://www.heroku.com
- Sign up or log in
- Verify email

### Step 2: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
choco install heroku-cli

# Verify installation
heroku --version
```

### Step 3: Login to Heroku
```bash
heroku login
# Opens browser for authentication
```

---

## 2. Create Heroku App

```bash
# Create app
heroku create fkod-app

# Or specify app name
heroku create fkod-backend

# Verify
heroku apps
```

---

## 3. Configure Environment Variables

```bash
# Set environment variables
heroku config:set NODE_ENV=production --app fkod-app
heroku config:set PORT=5000 --app fkod-app

# Database
heroku config:set DATABASE_URL=postgresql://user:pass@host:5432/fkod --app fkod-app

# Redis
heroku config:set REDIS_URL=redis://host:port --app fkod-app

# JWT
heroku config:set JWT_SECRET=your-very-long-secret-key --app fkod-app
heroku config:set JWT_EXPIRY=7d --app fkod-app

# Email
heroku config:set SENDGRID_API_KEY=your-sendgrid-key --app fkod-app
heroku config:set SENDGRID_FROM_EMAIL=noreply@fkod.com --app fkod-app

# Monitoring
heroku config:set SENTRY_DSN=your-sentry-dsn --app fkod-app

# View all config
heroku config --app fkod-app
```

---

## 4. Prepare Application for Heroku

### Update package.json

```json
{
  "name": "fkod-backend",
  "version": "1.0.0",
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "migrate": "knex migrate:latest",
    "seed": "knex seed:run"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.10.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3"
  }
}
```

### Create Procfile

```
# Procfile
web: npm start
release: npm run migrate
```

### Create .gitignore

```
node_modules/
.env
.env.local
dist/
*.log
.DS_Store
```

---

## 5. Deploy to Heroku

### Option 1: Git Push (Recommended)

```bash
# Add Heroku remote
heroku git:remote -a fkod-app

# Deploy
git push heroku main

# View logs
heroku logs --tail --app fkod-app
```

### Option 2: Using Heroku CLI

```bash
# Deploy from current directory
heroku deploy:git --app fkod-app
```

### Option 3: Connect GitHub (Automatic Deployment)

```bash
# In Heroku Dashboard:
# 1. Go to Deploy tab
# 2. Connect to GitHub
# 3. Select repository
# 4. Enable automatic deploys
```

---

## 6. Database Migration

### Run Migrations on Heroku

```bash
# Run migrations
heroku run npm run migrate --app fkod-app

# Check status
heroku run npm run migrate:status --app fkod-app

# Rollback if needed
heroku run npm run migrate:rollback --app fkod-app
```

### Seed Database (Optional)

```bash
heroku run npm run seed --app fkod-app
```

---

## 7. Health Checks

### Create Health Check Endpoint

```javascript
// src/routes/health.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Configure Heroku Health Checks

```bash
# Set health check path
heroku config:set HEROKU_HEALTH_CHECK_PATH=/health --app fkod-app
```

### Test Health Check

```bash
curl https://fkod-app.herokuapp.com/health
```

---

## 8. Scaling

### Scale Web Dynos

```bash
# Scale to 2 dynos
heroku ps:scale web=2 --app fkod-app

# Scale to 3 dynos
heroku ps:scale web=3 --app fkod-app

# View current dynos
heroku ps --app fkod-app

# Upgrade dyno type
heroku ps:type web=standard-1x --app fkod-app
```

### Dyno Types

| Type | RAM | Cost/month |
|------|-----|-----------|
| eco | 512MB | $5 |
| basic | 512MB | $7 |
| standard-1x | 512MB | $25 |
| standard-2x | 1GB | $50 |
| performance-m | 2.5GB | $250 |

---

## 9. Monitoring

### View Logs

```bash
# Real-time logs
heroku logs --tail --app fkod-app

# Last 100 lines
heroku logs -n 100 --app fkod-app

# Filter by source
heroku logs --source app --app fkod-app
heroku logs --source heroku --app fkod-app
```

### Metrics

```bash
# View metrics
heroku metrics --app fkod-app

# CPU usage
heroku metrics --app fkod-app | grep cpu

# Memory usage
heroku metrics --app fkod-app | grep memory
```

### Add-ons for Monitoring

```bash
# Papertrail (Logging)
heroku addons:create papertrail:choklad --app fkod-app

# New Relic (APM)
heroku addons:create newrelic:wayne --app fkod-app

# Datadog (Monitoring)
heroku addons:create datadog:basic --app fkod-app
```

---

## 10. Troubleshooting

### Application Won't Start

```bash
# Check logs
heroku logs --tail --app fkod-app

# Check for errors
heroku ps --app fkod-app

# Restart app
heroku restart --app fkod-app

# Check procfile
cat Procfile
```

### Database Connection Issues

```bash
# Check DATABASE_URL
heroku config:get DATABASE_URL --app fkod-app

# Test connection
heroku run psql --app fkod-app

# Restart database
heroku addons:destroy heroku-postgresql:standard-0 --app fkod-app
```

### Memory Issues

```bash
# Check memory usage
heroku metrics --app fkod-app

# Upgrade dyno
heroku ps:type web=standard-1x --app fkod-app

# Check for memory leaks
# Add monitoring: New Relic, Datadog
```

---

## 11. Deployment Checklist

- [ ] Heroku account created
- [ ] Heroku CLI installed
- [ ] App created on Heroku
- [ ] Procfile created
- [ ] package.json updated
- [ ] Environment variables configured
- [ ] Database URL set
- [ ] Redis URL set (if using)
- [ ] JWT secret configured
- [ ] Email service configured
- [ ] Monitoring configured
- [ ] Health check endpoint created
- [ ] Database migrations run
- [ ] App deployed successfully
- [ ] Health check passing
- [ ] Logs monitored
- [ ] Metrics checked

---

## 12. Deployment Commands Summary

```bash
# Setup
heroku login
heroku create fkod-app
heroku git:remote -a fkod-app

# Configure
heroku config:set NODE_ENV=production --app fkod-app
heroku config:set DATABASE_URL=... --app fkod-app

# Deploy
git push heroku main

# Monitor
heroku logs --tail --app fkod-app
heroku ps --app fkod-app
heroku metrics --app fkod-app

# Scale
heroku ps:scale web=3 --app fkod-app

# Rollback
heroku releases --app fkod-app
heroku releases:rollback --app fkod-app
```

---

## 13. Sonraki Adımlar

1. ✅ Backend deployment planı oluşturuldu
2. ⏳ Heroku app oluştur
3. ⏳ Environment variables konfigüre et
4. ⏳ Database migration çalıştır
5. ⏳ Backend deploy et
6. ⏳ Health checks doğrula
7. ⏳ Monitoring kur
8. ⏳ Frontend deployment
