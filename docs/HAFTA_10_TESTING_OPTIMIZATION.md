# Hafta 10: Testing & Optimization

## 1. Unit Tests

### Backend Unit Tests
```javascript
// tests/auth.test.js
import { User } from '../src/models/User.js';
import bcrypt from 'bcryptjs';

describe('User Authentication', () => {
  test('User registration with valid data', async () => {
    const user = await User.create('test@example.com', 'password123', 'Test User', 18);
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  test('User login with correct password', async () => {
    const user = await User.findByEmail('test@example.com');
    const isValid = await bcrypt.compare('password123', user.password_hash);
    expect(isValid).toBe(true);
  });

  test('User login with incorrect password', async () => {
    const user = await User.findByEmail('test@example.com');
    const isValid = await bcrypt.compare('wrongpassword', user.password_hash);
    expect(isValid).toBe(false);
  });
});
```

### Frontend Unit Tests
```javascript
// tests/components/Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('button click handler works', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalled();
  });

  test('button disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

## 2. Integration Tests

### API Integration Tests
```javascript
// tests/integration/courses.test.js
import request from 'supertest';
import app from '../../src/index.js';

describe('Courses API', () => {
  let token;
  let courseId;

  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = res.body.token;
  });

  test('Create course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Course',
        description: 'Test Description',
        level: 'beginner'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    courseId = res.body.id;
  });

  test('Get course', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Course');
  });

  test('Update course', async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Course' });
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Course');
  });

  test('Delete course', async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
```

## 3. E2E Tests

### User Journey Tests
```javascript
// tests/e2e/user-journey.test.js
import { test, expect } from '@playwright/test';

test.describe('User Registration and Learning Journey', () => {
  test('Complete user journey from registration to course completion', async ({ page }) => {
    // 1. Register
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="archetype"]', 'the-hero');
    await page.click('button[type="submit"]');
    
    // 2. Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 3. View dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // 4. Enroll in course
    await page.click('text=Browse Courses');
    await page.click('button:has-text("Enroll")');
    
    // 5. Complete module
    await page.click('text=Start Learning');
    await page.click('button:has-text("Mark as Complete")');
    
    // 6. View certificate
    await page.click('text=My Certificates');
    await expect(page.locator('text=Certificate of Completion')).toBeVisible();
  });
});
```

## 4. Performance Testing

### Load Testing
```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  // Test API endpoints
  let res = http.get('http://localhost:5000/api/courses');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);

  res = http.get('http://localhost:5000/api/mentors');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

### Lighthouse Performance Audit
```bash
# Run Lighthouse audit
lighthouse http://localhost:3000 --view

# Expected scores:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 90
# - SEO: > 90
```

## 5. Security Testing

### OWASP Top 10 Checks
- [ ] SQL Injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (token validation)
- [ ] Authentication/Authorization (JWT validation)
- [ ] Sensitive data exposure (HTTPS, password hashing)
- [ ] XML External Entities (XXE) - N/A for JSON APIs
- [ ] Broken Access Control (role-based access)
- [ ] Security Misconfiguration (CORS, headers)
- [ ] Using Components with Known Vulnerabilities (npm audit)
- [ ] Insufficient Logging & Monitoring

### Security Audit Commands
```bash
# Check for vulnerable dependencies
npm audit

# OWASP Dependency Check
npm install -g snyk
snyk test

# Security headers check
curl -I http://localhost:3000
```

## 6. Accessibility Testing

### WCAG 2.1 Compliance
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast (WCAG AA minimum)
- [ ] Focus indicators
- [ ] Alt text for images
- [ ] Form labels
- [ ] Error messages

### Accessibility Audit Tools
```bash
# axe DevTools
# WAVE Browser Extension
# Lighthouse Accessibility Audit
```

## 7. Responsive Design Testing

### Breakpoints to Test
- [ ] Mobile: 320px, 375px, 425px
- [ ] Tablet: 768px, 1024px
- [ ] Desktop: 1440px, 1920px

### Testing Checklist
- [ ] Layout adapts correctly
- [ ] Images scale properly
- [ ] Touch targets are adequate (48px minimum)
- [ ] Text is readable
- [ ] Navigation is accessible

## 8. Browser Compatibility

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 9. Database Performance

### Query Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_events_event_date ON events(event_date);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM courses WHERE level = 'beginner';
```

## 10. API Response Time Optimization

### Caching Strategy
- [ ] Redis caching for frequently accessed data
- [ ] HTTP caching headers
- [ ] Database query optimization
- [ ] API response compression (gzip)

### Response Time Targets
- [ ] API endpoints: < 200ms
- [ ] Page load: < 3s
- [ ] Time to Interactive: < 5s

## Testing Summary

| Test Type | Tool | Status |
|-----------|------|--------|
| Unit Tests | Jest | ⏳ Pending |
| Integration Tests | Supertest | ⏳ Pending |
| E2E Tests | Playwright | ⏳ Pending |
| Load Testing | k6 | ⏳ Pending |
| Security | OWASP, Snyk | ⏳ Pending |
| Accessibility | axe, WAVE | ⏳ Pending |
| Performance | Lighthouse | ⏳ Pending |
| Browser Compatibility | BrowserStack | ⏳ Pending |

## Next Steps
1. Set up testing infrastructure
2. Write and run all tests
3. Fix identified issues
4. Generate test reports
5. Proceed to deployment
