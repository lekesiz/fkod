# Aşama 2: SSL/HTTPS ve Security Hardening

## 1. SSL/HTTPS Setup

### Vercel (Frontend)
```
Automatic SSL included:
- Valid for *.vercel.app
- Valid for custom domains
- Auto-renewal
- No additional cost
```

### Heroku (Backend)
```bash
# Add SSL certificate
heroku certs:add server.crt server.key --app fkod-app

# Or use Heroku's automatic SSL
# Already included with all apps
```

### AWS RDS (Database)
```bash
# Enable SSL for database connections
# In connection string: ?sslmode=require

DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

---

## 2. HTTPS Enforcement

### Frontend (Vercel)

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### Backend (Express)

```javascript
// src/middleware/https.js
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  } else {
    next();
  }
});

// Or use helmet middleware
const helmet = require('helmet');
app.use(helmet.hsts({
  maxAge: 63072000,
  includeSubDomains: true,
  preload: true
}));
```

---

## 3. Security Headers

### Content Security Policy (CSP)

```javascript
// Express middleware
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.fkod.com"],
    fontSrc: ["'self'", "https://fonts.googleapis.com"],
    frameSrc: ["'none'"]
  }
}));
```

### Other Security Headers

```javascript
// Helmet middleware
const helmet = require('helmet');

app.use(helmet()); // Enables all default headers

// Individual headers:
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
```

### Vercel Security Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

---

## 4. CORS Configuration

### Express CORS Setup

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

### Preflight Requests

```javascript
// Automatic with cors middleware
// OPTIONS requests are handled automatically

// Or manual:
app.options('*', cors(corsOptions));
app.options('/api/*', cors(corsOptions));
```

---

## 5. Authentication Security

### JWT Best Practices

```javascript
// Generate secure JWT
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  {
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: 'fkod-app',
    audience: 'fkod-users'
  }
);
```

### Password Hashing

```javascript
const bcrypt = require('bcryptjs');

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Session Security

```javascript
// Express session
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const redisClient = createClient();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JavaScript access
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));
```

---

## 6. Input Validation & Sanitization

### Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  body('name').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process valid data
});
```

### Sanitization

```javascript
const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');

// Remove NoSQL injection
app.use(mongoSanitize());

// XSS protection
const sanitized = xss(userInput);
```

---

## 7. Rate Limiting

### Express Rate Limiter

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:'
  })
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  // Login logic
});
```

---

## 8. SQL Injection Prevention

### Parameterized Queries

```javascript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ SAFE
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);

// Using ORM
const user = await User.findOne({ where: { email } });
```

---

## 9. Environment Variables

### Secure Environment Variables

```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Use environment-specific files
.env.production
.env.staging
.env.development
```

### Heroku Environment Variables

```bash
# Set securely
heroku config:set JWT_SECRET=your-secret --app fkod-app

# View (masked)
heroku config --app fkod-app

# Rotate secrets
heroku config:unset JWT_SECRET --app fkod-app
heroku config:set JWT_SECRET=new-secret --app fkod-app
```

---

## 10. Dependency Security

### Check Vulnerabilities

```bash
# NPM audit
npm audit

# Fix vulnerabilities
npm audit fix

# Automated scanning
npm install --save-dev snyk
npx snyk test

# GitHub Dependabot
# Automatically creates PRs for security updates
```

---

## 11. API Security

### API Key Management

```javascript
// Validate API keys
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

app.use('/api/', validateApiKey);
```

### Request Signing

```javascript
const crypto = require('crypto');

// Sign request
function signRequest(data, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(data))
    .digest('hex');
}

// Verify request
function verifyRequest(data, signature, secret) {
  const expected = signRequest(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

---

## 12. Security Checklist

- [ ] HTTPS enforced (all traffic redirected)
- [ ] SSL certificate valid
- [ ] HSTS header enabled
- [ ] CSP header configured
- [ ] X-Frame-Options set to DENY
- [ ] X-Content-Type-Options set to nosniff
- [ ] CORS properly configured
- [ ] JWT secrets strong and rotated
- [ ] Passwords hashed with bcrypt
- [ ] Sessions secure (httpOnly, secure, sameSite)
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] API keys secured
- [ ] Dependencies audited
- [ ] No secrets in code
- [ ] Environment variables configured
- [ ] Monitoring and alerting set up
- [ ] Security headers tested

---

## 13. Security Testing

### OWASP Top 10 Testing

```bash
# 1. Injection
# Test SQL injection, NoSQL injection, OS injection

# 2. Broken Authentication
# Test weak passwords, session fixation

# 3. Sensitive Data Exposure
# Test HTTPS, encryption

# 4. XML External Entities (XXE)
# Test XML parsing

# 5. Broken Access Control
# Test authorization

# 6. Security Misconfiguration
# Test default credentials, unnecessary services

# 7. Cross-Site Scripting (XSS)
# Test input validation

# 8. Insecure Deserialization
# Test object serialization

# 9. Using Components with Known Vulnerabilities
# npm audit

# 10. Insufficient Logging & Monitoring
# Test error handling, logging
```

### Security Scanning Tools

```bash
# OWASP ZAP
# npm install -g zaproxy

# Burp Suite
# https://portswigger.net/burp

# npm audit
npm audit

# Snyk
npm install -g snyk
snyk test

# GitHub Security
# Settings → Security & analysis
```

---

## 14. Incident Response

### Security Incident Plan

```
1. Detect: Monitoring and alerting
2. Respond: Immediate action
3. Investigate: Root cause analysis
4. Remediate: Fix and deploy
5. Document: Post-mortem
6. Communicate: Notify users if needed
```

### Rollback Procedure

```bash
# If security issue detected:
# 1. Identify issue
# 2. Prepare fix
# 3. Test fix
# 4. Deploy fix
# 5. Verify fix
# 6. Monitor closely
# 7. Document incident
```

---

## 15. Sonraki Adımlar

1. ✅ SSL/HTTPS ve security hardening planı oluşturuldu
2. ⏳ SSL certificates konfigüre et
3. ⏳ HTTPS enforce et
4. ⏳ Security headers ekle
5. ⏳ CORS konfigüre et
6. ⏳ Rate limiting kur
7. ⏳ Input validation ekle
8. ⏳ Security audit yap
