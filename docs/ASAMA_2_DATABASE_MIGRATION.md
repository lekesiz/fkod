# Aşama 2: Database Migration ve Setup

## 1. Database Architecture

### PostgreSQL Setup (AWS RDS)

```
┌─────────────────────────────────────────┐
│   AWS RDS PostgreSQL Instance           │
│   - Primary (Read/Write)                │
│   - Replica (Read-only)                 │
│   - Automated Backups (30-day)          │
│   - Point-in-time Recovery              │
└─────────────────────────────────────────┘
        │
        ├─ Connection Pooling (PgBouncer)
        │
        ├─ Replication
        │  └─ Standby Replica
        │
        └─ Backup
           ├─ Daily Snapshots
           └─ WAL Archiving
```

---

## 2. AWS RDS PostgreSQL Setup

### Step 1: Create RDS Instance

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier fkod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --master-username postgres \
  --master-user-password <strong-password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports postgresql \
  --enable-iam-database-authentication
```

### Step 2: Configure Security Group

```bash
# Allow inbound traffic on port 5432
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 0.0.0.0/0
```

### Step 3: Get Connection String

```bash
# Get RDS endpoint
aws rds describe-db-instances \
  --db-instance-identifier fkod-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text

# Connection string format
postgresql://postgres:password@fkod-db.xxxxx.us-east-1.rds.amazonaws.com:5432/fkod
```

---

## 3. Database Schema Migration

### Migration Strategy

**Option 1: Using Knex.js (Recommended)**
```bash
npm install knex pg
npx knex init
```

**Option 2: Using TypeORM**
```bash
npm install typeorm
```

**Option 3: Using Prisma**
```bash
npm install @prisma/client prisma
npx prisma init
```

### Create Migration Files

```bash
# Create migration
knex migrate:make create_users_table

# Run migrations
knex migrate:latest

# Rollback
knex migrate:rollback
```

### Migration Example (Knex)

```javascript
// migrations/001_create_users_table.js
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('name').notNullable();
    table.integer('age');
    table.string('archetype_code');
    table.boolean('is_mentor').defaultTo(false);
    table.boolean('is_admin').defaultTo(false);
    table.timestamps(true, true);
    table.index('email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

---

## 4. Database Tables

### 1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  archetype_code VARCHAR(50),
  is_mentor BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

### 2. Mentors Table
```sql
CREATE TABLE mentors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expertise TEXT,
  bio TEXT,
  availability VARCHAR(50),
  rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,
  hourly_rate INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating DESC)
);
```

### 3. Courses Table
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(50),
  archetype_code VARCHAR(50),
  instructor_id INTEGER REFERENCES users(id),
  duration_hours INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_level (level),
  INDEX idx_archetype (archetype_code)
);
```

### 4. Course Modules Table
```sql
CREATE TABLE course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  order_number INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_course_id (course_id)
);
```

### 5. User Progress Table
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  module_id INTEGER REFERENCES course_modules(id),
  completion_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id),
  INDEX idx_user_id (user_id),
  INDEX idx_course_id (course_id)
);
```

### 6. Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  recipient_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sender_id (sender_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_created_at (created_at DESC)
);
```

### 7. Community Posts Table
```sql
CREATE TABLE community_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags VARCHAR(255),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_tags (tags)
);
```

### 8. Community Comments Table
```sql
CREATE TABLE community_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES community_posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id)
);
```

### 9. Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  organizer_id INTEGER REFERENCES users(id),
  event_type VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_start_date (start_date),
  INDEX idx_event_type (event_type)
);
```

### 10. Event Attendees Table
```sql
CREATE TABLE event_attendees (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id),
  INDEX idx_event_id (event_id),
  INDEX idx_user_id (user_id)
);
```

### 11. Certificates Table
```sql
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  certificate_code VARCHAR(50) UNIQUE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_course_id (course_id),
  INDEX idx_code (certificate_code)
);
```

### 12. Mentor Matches Table
```sql
CREATE TABLE mentor_matches (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id),
  mentee_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  UNIQUE(mentor_id, mentee_id),
  INDEX idx_mentor_id (mentor_id),
  INDEX idx_mentee_id (mentee_id),
  INDEX idx_status (status)
);
```

### 13. Submissions Table (MVP)
```sql
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  archetype_code VARCHAR(50),
  test_score INTEGER,
  report_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_archetype (archetype_code),
  INDEX idx_created_at (created_at DESC)
);
```

---

## 5. Database Indexes

### Performance Indexes
```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_archetype ON users(archetype_code);

-- Mentor queries
CREATE INDEX idx_mentors_rating ON mentors(rating DESC);
CREATE INDEX idx_mentors_user_id ON mentors(user_id);

-- Course queries
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_archetype ON courses(archetype_code);

-- Message queries
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Post queries
CREATE INDEX idx_posts_user ON community_posts(user_id);
CREATE INDEX idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_posts_tags ON community_posts(tags);

-- Event queries
CREATE INDEX idx_events_start ON events(start_date);
CREATE INDEX idx_events_type ON events(event_type);
```

---

## 6. Database Backup Strategy

### Automated Backups
```bash
# AWS RDS Automated Backups (configured during setup)
- Retention period: 30 days
- Backup window: 03:00-04:00 UTC
- Multi-AZ: Enabled
```

### Manual Backups
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

### WAL Archiving (Point-in-time Recovery)
```bash
# Enable WAL archiving to S3
aws rds modify-db-instance \
  --db-instance-identifier fkod-db \
  --enable-iam-database-authentication \
  --backup-retention-period 30
```

---

## 7. Connection Pooling

### PgBouncer Setup
```bash
# Install PgBouncer
brew install pgbouncer

# Configuration file: /etc/pgbouncer/pgbouncer.ini
[databases]
fkod = host=fkod-db.xxxxx.rds.amazonaws.com port=5432 dbname=fkod

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

### Node.js Connection Pool
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

---

## 8. Data Migration from Development

### Export Development Data
```bash
# Dump development database
pg_dump -h localhost -U postgres fkod_dev > fkod_dev.sql

# Compress
gzip fkod_dev.sql
```

### Import to Production
```bash
# Connect to production database
psql -h fkod-db.xxxxx.rds.amazonaws.com -U postgres -d fkod < fkod_dev.sql

# Or using pg_restore for binary format
pg_restore -h fkod-db.xxxxx.rds.amazonaws.com -U postgres -d fkod fkod_dev.dump
```

---

## 9. Database Monitoring

### CloudWatch Metrics
- CPU Utilization
- Database Connections
- Read/Write Latency
- Storage Space
- IOPS

### Alarms
```bash
# CPU > 80%
aws cloudwatch put-metric-alarm \
  --alarm-name fkod-db-cpu-high \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 10. Database Maintenance

### Regular Maintenance Tasks
```sql
-- Vacuum (cleanup dead tuples)
VACUUM ANALYZE;

-- Reindex (rebuild indexes)
REINDEX DATABASE fkod;

-- Analyze (update statistics)
ANALYZE;

-- Check for bloat
SELECT * FROM pg_stat_user_tables WHERE n_dead_tup > 1000;
```

### Scheduled Maintenance
```bash
# Daily at 2 AM UTC
0 2 * * * /usr/bin/psql -h fkod-db.xxxxx.rds.amazonaws.com -U postgres -d fkod -c "VACUUM ANALYZE;"
```

---

## 11. Database Checklist

- [ ] AWS RDS PostgreSQL instance created
- [ ] Security group configured
- [ ] Multi-AZ enabled
- [ ] Automated backups configured (30-day retention)
- [ ] CloudWatch logs enabled
- [ ] IAM database authentication enabled
- [ ] All 13 tables created
- [ ] Indexes created
- [ ] Connection pooling configured
- [ ] Monitoring alarms set up
- [ ] Backup tested
- [ ] Disaster recovery plan documented

---

## 12. Sonraki Adımlar

1. ✅ Database migration ve setup planı oluşturuldu
2. ⏳ AWS RDS PostgreSQL instance kurulumu
3. ⏳ Database schema migration
4. ⏳ Backup configuration
5. ⏳ Monitoring setup
6. ⏳ Backend deployment
