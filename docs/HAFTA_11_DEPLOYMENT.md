# Hafta 11: Deployment & DevOps

## 1. Docker Setup

### Dockerfile - Backend
```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["node", "src/index.js"]
```

### Dockerfile - Frontend
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: fkod_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: fkod_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fkod_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://fkod_user:${DB_PASSWORD}@postgres:5432/fkod_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/logs:/app/logs

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://localhost:5000

volumes:
  postgres_data:
```

## 2. Environment Configuration

### .env.production
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/fkod_db
DB_POOL_MIN=2
DB_POOL_MAX=10

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=https://fkod.com

# Email
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@fkod.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Node
NODE_ENV=production
```

## 3. Database Migrations

### Migration Script
```javascript
// migrations/001_init_schema.js
export async function up(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      age INTEGER,
      archetype_code VARCHAR(50),
      avatar_url VARCHAR(255),
      is_mentor BOOLEAN DEFAULT FALSE,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_archetype ON users(archetype_code);
  `);
}

export async function down(pool) {
  await pool.query('DROP TABLE IF EXISTS users CASCADE;');
}
```

### Run Migrations
```bash
# Create migration
npm run migrate:create init_schema

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

## 4. CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
      
      - name: Run smoke tests
        run: npm run test:smoke
```

## 5. Heroku Deployment

### Procfile
```
web: node src/index.js
release: npm run migrate:up
```

### Deploy Commands
```bash
# Login to Heroku
heroku login

# Create app
heroku create fkod-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set DATABASE_URL=your-db-url

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Run migrations
heroku run npm run migrate:up
```

## 6. AWS Deployment

### EC2 Setup
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone https://github.com/lekesiz/fkod.git
cd fkod/backend

# Install dependencies
npm ci --only=production

# Start application with PM2
npm install -g pm2
pm2 start src/index.js --name "fkod-backend"
pm2 startup
pm2 save
```

### RDS Database Setup
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier fkod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20

# Get connection string
aws rds describe-db-instances \
  --db-instance-identifier fkod-db \
  --query 'DBInstances[0].Endpoint'
```

## 7. Monitoring & Logging

### Application Monitoring
```javascript
// src/monitoring/sentry.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export default Sentry;
```

### Logging Setup
```javascript
// src/logging/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## 8. Health Checks & Monitoring

### Health Check Endpoint
```javascript
// src/routes/health.js
app.get('/health', async (req, res) => {
  try {
    // Check database
    await pool.query('SELECT 1');
    
    // Check Redis
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      redis: 'connected'
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      error: err.message
    });
  }
});
```

### Monitoring Dashboard
- [ ] Set up Grafana dashboards
- [ ] Configure Prometheus metrics
- [ ] Set up alerts for:
  - [ ] High CPU usage
  - [ ] High memory usage
  - [ ] Database connection pool exhaustion
  - [ ] API response time > 1s
  - [ ] Error rate > 1%

## 9. SSL/HTTPS Setup

### Let's Encrypt with Nginx
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d fkod.com -d www.fkod.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name fkod.com www.fkod.com;

    ssl_certificate /etc/letsencrypt/live/fkod.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fkod.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 10. Backup & Disaster Recovery

### Database Backup
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump $DATABASE_URL > $BACKUP_DIR/fkod_db_$DATE.sql
gzip $BACKUP_DIR/fkod_db_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Restore from Backup
```bash
# Restore database
gunzip < fkod_db_20240101_000000.sql.gz | psql $DATABASE_URL
```

## Deployment Checklist

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Backup system operational
- [ ] Disaster recovery plan documented
- [ ] Team trained on deployment process
- [ ] Rollback plan prepared

## Post-Deployment

- [ ] Monitor error logs
- [ ] Check application metrics
- [ ] Verify all features working
- [ ] Test critical user journeys
- [ ] Monitor performance metrics
- [ ] Collect user feedback
