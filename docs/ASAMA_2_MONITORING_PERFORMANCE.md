# Aşama 2: Monitoring, Alerting ve Performance Optimization

## 1. Monitoring Stack

```
┌─────────────────────────────────────────────────┐
│         Monitoring & Observability Stack        │
└─────────────────────────────────────────────────┘

Application Layer:
├─ Sentry (Error Tracking)
├─ DataDog (APM)
└─ New Relic (Performance)

Infrastructure Layer:
├─ Prometheus (Metrics)
├─ Grafana (Dashboards)
└─ CloudWatch (AWS Metrics)

Logging Layer:
├─ ELK Stack (Elasticsearch, Logstash, Kibana)
├─ Papertrail (Log Aggregation)
└─ Splunk (Log Analysis)

Uptime Monitoring:
├─ UptimeRobot
├─ Pingdom
└─ StatusPage
```

---

## 2. Error Tracking (Sentry)

### Setup

```bash
# Install Sentry
npm install @sentry/node @sentry/tracing

# Initialize
```

### Backend Integration

```javascript
// src/index.js
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app: true,
      request: true
    })
  ]
});

// Add middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

### Frontend Integration

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

## 3. Application Performance Monitoring (APM)

### DataDog Setup

```bash
# Install DataDog
npm install dd-trace

# Initialize
```

### Backend APM

```javascript
// src/index.js
const tracer = require('dd-trace').init({
  service: 'fkod-backend',
  env: process.env.NODE_ENV,
  version: '1.0.0'
});

const express = require('express');
const app = express();

// Middleware for tracing
app.use((req, res, next) => {
  const span = tracer.startSpan('http.request', {
    resource: `${req.method} ${req.path}`,
    tags: {
      'http.method': req.method,
      'http.url': req.url,
      'span.kind': 'web'
    }
  });

  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    span.finish();
  });

  next();
});
```

---

## 4. Metrics Collection (Prometheus)

### Prometheus Setup

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'fkod-backend'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'

  - job_name: 'fkod-database'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'fkod-redis'
    static_configs:
      - targets: ['localhost:9121']
```

### Express Prometheus Metrics

```javascript
const promClient = require('prom-client');

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
});

// Expose metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

---

## 5. Dashboards (Grafana)

### Create Grafana Dashboard

```json
{
  "dashboard": {
    "title": "F-Kod Production",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds)"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~'5..'}[5m])"
          }
        ]
      },
      {
        "title": "Database Connections",
        "targets": [
          {
            "expr": "pg_stat_activity_count"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "targets": [
          {
            "expr": "redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)"
          }
        ]
      }
    ]
  }
}
```

---

## 6. Alerting

### Alert Rules (Prometheus)

```yaml
# alert_rules.yml
groups:
  - name: fkod_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~'5..'}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 5m
        annotations:
          summary: "High response time detected"

      - alert: DatabaseConnectionHigh
        expr: pg_stat_activity_count > 80
        for: 5m
        annotations:
          summary: "High database connections"

      - alert: DiskSpaceRunningOut
        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
        for: 5m
        annotations:
          summary: "Disk space running out"

      - alert: HighMemoryUsage
        expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.2
        for: 5m
        annotations:
          summary: "High memory usage"
```

### Alert Channels

```bash
# Slack
# Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Email
# SMTP Configuration

# PagerDuty
# Integration Key: your-pagerduty-key

# SMS
# Twilio API Key
```

---

## 7. Performance Optimization

### Database Query Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created ON community_posts(created_at DESC);

-- Optimize slow queries
-- 1. Add indexes
-- 2. Use LIMIT
-- 3. Use pagination
-- 4. Cache results
```

### API Response Optimization

```javascript
// Implement caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/courses', async (req, res) => {
  // Check cache
  const cached = await client.get('courses');
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch from database
  const courses = await Course.find();

  // Cache for 1 hour
  await client.setex('courses', 3600, JSON.stringify(courses));

  res.json(courses);
});
```

### Frontend Performance

```javascript
// Code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

// Image optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  quality={80}
/>

// Lazy loading
<img src="image.jpg" loading="lazy" />
```

### Bundle Size Optimization

```bash
# Analyze bundle
npm run build
npm run analyze

# Reduce bundle size
# 1. Remove unused dependencies
# 2. Use dynamic imports
# 3. Tree shaking
# 4. Minification
# 5. Compression (gzip, brotli)
```

---

## 8. Load Testing

### K6 Load Testing

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['<0.1']
  }
};

export default function () {
  const res = http.get('https://api.fkod.com/api/courses');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
```

### Run Load Test

```bash
# Install k6
brew install k6

# Run test
k6 run load-test.js

# With specific VUs
k6 run --vus 50 --duration 5m load-test.js
```

---

## 9. Uptime Monitoring

### UptimeRobot

```
1. Create account: https://uptimerobot.com
2. Add monitor
3. URL: https://api.fkod.com/health
4. Interval: 5 minutes
5. Alert contacts: Email, Slack, SMS
```

### Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});
```

---

## 10. Logging

### Structured Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', { error: err.message });
```

### Log Aggregation (ELK Stack)

```yaml
# docker-compose.yml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
```

---

## 11. Monitoring Checklist

- [ ] Sentry configured for error tracking
- [ ] DataDog or New Relic for APM
- [ ] Prometheus for metrics collection
- [ ] Grafana for dashboards
- [ ] Alert rules configured
- [ ] Alert channels set up (Slack, Email, PagerDuty)
- [ ] UptimeRobot for uptime monitoring
- [ ] Health check endpoint created
- [ ] Structured logging implemented
- [ ] Log aggregation set up
- [ ] Database query optimization done
- [ ] API caching implemented
- [ ] Frontend performance optimized
- [ ] Load testing completed
- [ ] Performance baselines established
- [ ] On-call rotation set up
- [ ] Incident response plan ready

---

## 12. Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 200ms |
| API Response Time (p99) | < 500ms |
| Error Rate | < 0.1% |
| Uptime | > 99.9% |
| Database Query Time | < 100ms |
| Cache Hit Rate | > 80% |
| Frontend Load Time | < 3s |
| Lighthouse Score | > 90 |

---

## 13. Sonraki Adımlar

1. ✅ Monitoring ve performance optimization planı oluşturuldu
2. ⏳ Sentry konfigüre et
3. ⏳ Prometheus ve Grafana kur
4. ⏳ Alert rules oluştur
5. ⏳ UptimeRobot konfigüre et
6. ⏳ Load testing yap
7. ⏳ Performance optimize et
8. ⏳ Backup ve disaster recovery
