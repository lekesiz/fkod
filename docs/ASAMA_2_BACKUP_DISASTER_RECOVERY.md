# Aşama 2: Backup, Disaster Recovery ve Testing

## 1. Backup Strategy

### Database Backups

#### AWS RDS Automated Backups
```bash
# Already configured during RDS setup
- Retention period: 30 days
- Backup window: 03:00-04:00 UTC
- Multi-AZ: Enabled
- Automated snapshots: Daily
```

#### Manual Database Snapshots
```bash
# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier fkod-db \
  --db-snapshot-identifier fkod-db-backup-$(date +%Y%m%d)

# List snapshots
aws rds describe-db-snapshots

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier fkod-db-restored \
  --db-snapshot-identifier fkod-db-backup-20240101
```

#### WAL Archiving (Point-in-time Recovery)
```bash
# Enable WAL archiving to S3
aws rds modify-db-instance \
  --db-instance-identifier fkod-db \
  --backup-retention-period 30 \
  --enable-iam-database-authentication
```

### Application Backups

#### Code Backups
```bash
# Git repository (already backed up on GitHub)
# Additional backup to S3
aws s3 sync . s3://fkod-backups/code/ --exclude ".git" --exclude "node_modules"
```

#### Configuration Backups
```bash
# Backup environment variables
aws secretsmanager create-secret \
  --name fkod-env-backup \
  --secret-string file://env-backup.json

# Backup SSL certificates
aws s3 cp /etc/ssl/certs/fkod.crt s3://fkod-backups/certs/
aws s3 cp /etc/ssl/private/fkod.key s3://fkod-backups/certs/
```

### User Data Backups

#### Database Dump
```bash
# Full database dump
pg_dump -h fkod-db.xxxxx.rds.amazonaws.com \
  -U postgres \
  -d fkod \
  --format=custom \
  --file=fkod-backup-$(date +%Y%m%d).dump

# Compress
gzip fkod-backup-*.dump

# Upload to S3
aws s3 cp fkod-backup-*.dump.gz s3://fkod-backups/database/
```

#### Incremental Backups
```bash
# Using WAL archiving for incremental backups
# Configured in RDS settings
# Enables point-in-time recovery
```

---

## 2. Backup Retention Policy

| Backup Type | Retention | Frequency |
|-------------|-----------|-----------|
| RDS Automated | 30 days | Daily |
| RDS Manual | 90 days | Weekly |
| Database Dump | 90 days | Weekly |
| Code Repository | Unlimited | Every commit |
| Configuration | 30 days | Monthly |
| SSL Certificates | Unlimited | On change |

---

## 3. Disaster Recovery Plan

### RTO & RPO

```
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 1 hour

- RTO: Maximum acceptable downtime
- RPO: Maximum acceptable data loss
```

### Disaster Scenarios

#### Scenario 1: Database Failure
```
1. Detect: Monitoring alerts
2. Assess: Check database status
3. Recover: Restore from snapshot
4. Verify: Run health checks
5. Communicate: Notify users
6. Document: Post-mortem

Recovery Time: 15-30 minutes
```

#### Scenario 2: Application Server Failure
```
1. Detect: Health check fails
2. Assess: Check server status
3. Recover: Redeploy application
4. Verify: Run smoke tests
5. Communicate: Notify users
6. Document: Post-mortem

Recovery Time: 5-10 minutes
```

#### Scenario 3: Data Corruption
```
1. Detect: Monitoring alerts
2. Assess: Identify affected data
3. Recover: Restore from backup
4. Verify: Data integrity checks
5. Communicate: Notify users
6. Document: Post-mortem

Recovery Time: 30-60 minutes
```

#### Scenario 4: Security Breach
```
1. Detect: Security monitoring
2. Assess: Identify breach scope
3. Respond: Isolate affected systems
4. Recover: Restore from clean backup
5. Verify: Security audit
6. Communicate: Notify users
7. Document: Post-mortem

Recovery Time: 1-2 hours
```

#### Scenario 5: Complete Data Center Failure
```
1. Detect: All systems down
2. Assess: Data center status
3. Recover: Failover to DR site
4. Verify: All systems operational
5. Communicate: Notify users
6. Document: Post-mortem

Recovery Time: 1-2 hours
RTO: < 2 hours
RPO: < 1 hour
```

---

## 4. Disaster Recovery Procedures

### Database Recovery

```bash
# Step 1: Identify latest clean backup
aws rds describe-db-snapshots \
  --db-instance-identifier fkod-db \
  --query 'DBSnapshots[0]'

# Step 2: Create new instance from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier fkod-db-restored \
  --db-snapshot-identifier fkod-db-backup-20240101

# Step 3: Wait for restoration
aws rds wait db-instance-available \
  --db-instance-identifier fkod-db-restored

# Step 4: Verify data integrity
psql -h fkod-db-restored.xxxxx.rds.amazonaws.com \
  -U postgres \
  -d fkod \
  -c "SELECT COUNT(*) FROM users;"

# Step 5: Update DNS/connection strings
# Point application to new database

# Step 6: Verify application
curl https://api.fkod.com/health
```

### Application Recovery

```bash
# Step 1: Redeploy from GitHub
cd /home/ubuntu/fkod
git pull origin main

# Step 2: Rebuild and deploy
npm run build
heroku deploy:git --app fkod-app

# Step 3: Run migrations
heroku run npm run migrate --app fkod-app

# Step 4: Verify deployment
curl https://api.fkod.com/health

# Step 5: Check logs
heroku logs --tail --app fkod-app
```

### DNS Failover

```bash
# Step 1: Update DNS records
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch file://failover.json

# Step 2: Verify DNS propagation
nslookup api.fkod.com

# Step 3: Test connectivity
curl https://api.fkod.com/health
```

---

## 5. Testing

### Unit Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests

```bash
# Test API endpoints
npm run test:integration

# Test database connections
npm run test:db

# Test external services
npm run test:external
```

### End-to-End Tests

```bash
# Using Cypress
npm run test:e2e

# Test scenarios:
# 1. User registration
# 2. Login
# 3. Take test
# 4. Receive report
# 5. Mentor matching
# 6. Course enrollment
# 7. Community posting
# 8. Event registration
```

### Performance Tests

```bash
# Load testing with K6
k6 run load-test.js

# Test scenarios:
# 1. Concurrent users: 100
# 2. Duration: 5 minutes
# 3. Ramp-up: 1 minute
# 4. Ramp-down: 1 minute

# Thresholds:
# - Response time p95 < 500ms
# - Error rate < 1%
# - Throughput > 100 req/s
```

### Security Tests

```bash
# OWASP ZAP scanning
zaproxy -cmd \
  -quickurl https://fkod.com \
  -quickout report.html

# Dependency scanning
npm audit

# SAST scanning
snyk test

# DAST scanning
# Manual penetration testing
```

### Backup Recovery Tests

```bash
# Monthly backup recovery drill
# 1. Restore database from backup
# 2. Verify data integrity
# 3. Test application connectivity
# 4. Run smoke tests
# 5. Document results
```

---

## 6. Testing Checklist

### Unit Tests
- [ ] Backend unit tests (> 80% coverage)
- [ ] Frontend unit tests (> 80% coverage)
- [ ] Database model tests
- [ ] API endpoint tests
- [ ] Utility function tests

### Integration Tests
- [ ] API integration tests
- [ ] Database integration tests
- [ ] External service integration tests
- [ ] Authentication flow tests
- [ ] Authorization tests

### E2E Tests
- [ ] User registration flow
- [ ] Login flow
- [ ] Test taking flow
- [ ] Report generation
- [ ] Mentor matching
- [ ] Course enrollment
- [ ] Community posting
- [ ] Event registration

### Performance Tests
- [ ] Load test (100 concurrent users)
- [ ] Stress test (1000 concurrent users)
- [ ] Spike test (sudden traffic increase)
- [ ] Endurance test (24-hour run)
- [ ] Database query performance

### Security Tests
- [ ] OWASP Top 10 testing
- [ ] SQL injection tests
- [ ] XSS tests
- [ ] CSRF tests
- [ ] Authentication bypass tests
- [ ] Authorization bypass tests
- [ ] Dependency vulnerability scan
- [ ] SSL/TLS configuration test

### Backup & Recovery Tests
- [ ] Database backup restoration
- [ ] Data integrity verification
- [ ] Application failover
- [ ] DNS failover
- [ ] Complete DR drill

---

## 7. Test Results Documentation

### Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X
- Pass Rate: X%

## Unit Tests
- Backend: X/X passed
- Frontend: X/X passed
- Coverage: X%

## Integration Tests
- API Tests: X/X passed
- Database Tests: X/X passed
- External Services: X/X passed

## E2E Tests
- User Flows: X/X passed
- Business Processes: X/X passed

## Performance Tests
- Load Test: PASSED/FAILED
- Response Time (p95): Xms
- Error Rate: X%
- Throughput: X req/s

## Security Tests
- OWASP Scan: PASSED/FAILED
- Dependency Audit: X vulnerabilities
- SSL Test: PASSED/FAILED

## Backup & Recovery
- Database Recovery: PASSED/FAILED
- Recovery Time: X minutes
- Data Integrity: VERIFIED

## Issues Found
1. [Issue 1]
2. [Issue 2]
3. [Issue 3]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Sign-off
- Tested by: [Name]
- Date: [Date]
- Approved by: [Name]
```

---

## 8. Monitoring During Testing

### Key Metrics to Monitor

```
- CPU Usage
- Memory Usage
- Disk Space
- Database Connections
- API Response Time
- Error Rate
- Request Throughput
- Cache Hit Rate
```

### Monitoring Tools

```
- Prometheus: Metrics collection
- Grafana: Dashboards
- Sentry: Error tracking
- DataDog: APM
- CloudWatch: AWS metrics
```

---

## 9. Rollback Procedure

### If Tests Fail

```bash
# Step 1: Identify issue
# Check logs and metrics

# Step 2: Rollback code
git revert <commit-hash>
git push origin main

# Step 3: Redeploy
heroku deploy:git --app fkod-app

# Step 4: Verify
curl https://api.fkod.com/health

# Step 5: Investigate
# Root cause analysis
# Document findings
```

---

## 10. Go-Live Checklist

- [ ] All unit tests passing (100%)
- [ ] All integration tests passing (100%)
- [ ] All E2E tests passing (100%)
- [ ] Load test successful (< 500ms p95)
- [ ] Security tests passed
- [ ] Backup recovery tested
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] On-call rotation set up
- [ ] Incident response plan ready
- [ ] Team trained
- [ ] Documentation complete
- [ ] Stakeholder approval
- [ ] Final sign-off

---

## 11. Sonraki Adımlar

1. ✅ Backup & disaster recovery planı oluşturuldu
2. ⏳ Backup automation kur
3. ⏳ Disaster recovery drill yap
4. ⏳ Tüm testleri çalıştır
5. ⏳ Test sonuçlarını dokümante et
6. ⏳ Issues'ları çöz
7. ⏳ Final approval al
8. ⏳ Production launch
