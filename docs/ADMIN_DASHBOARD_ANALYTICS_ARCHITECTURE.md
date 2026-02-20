# F-KOD Admin Dashboard & Analytics Platform

## Architecture & Technical Specification

**Project:** F-KOD (Fıtrat Kodları)  
**Module:** Admin Dashboard & Analytics Platform  
**Timeline:** 4-6 weeks  
**Status:** In Development  
**Prepared by:** Manus AI  

---

## 1. Executive Summary

The F-KOD Admin Dashboard and Analytics Platform provides comprehensive operational management, business intelligence, and reporting capabilities for the F-KOD platform. This module enables administrators to manage users, content, mentors, courses, and community while providing real-time analytics and insights.

**Key Features:**
- User management (registration, roles, permissions, suspension)
- Content management (courses, modules, posts, events)
- Mentor management (verification, ratings, matching)
- Real-time analytics and dashboards
- Advanced reporting and exports
- System monitoring and alerts
- Financial reporting and reconciliation

---

## 2. Architecture Overview

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Admin Dashboard Frontend                   │
│          (React + Vite + Tailwind + Recharts)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │   Analytics  │  │   Reports    │      │
│  │   Pages      │  │   Pages      │  │   Pages      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                  Admin API Gateway (Express)                 │
│                   (Authentication, Authorization)            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   User API   │  │  Content API │  │ Analytics API│      │
│  │   (CRUD)     │  │   (CRUD)     │  │  (Reports)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │  Redis Cache │  │  S3 Storage  │      │
│  │  Database    │  │  (Sessions)  │  │  (Reports)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS 4 for styling
- Recharts for data visualization
- React Query for data fetching
- Zustand for state management
- React Router for navigation

**Backend:**
- Node.js + Express.js
- PostgreSQL 15 for data storage
- Redis for caching and sessions
- Bull for job scheduling
- Nodemailer for email notifications

**Deployment:**
- Vercel (Frontend)
- Heroku (Backend)
- AWS S3 (Report storage)
- CloudFront (CDN)

---

## 3. Admin Dashboard Features

### 3.1 User Management

**Capabilities:**
- View all users with filtering and search
- User details and profile management
- Role assignment (Admin, Mentor, User, Moderator)
- Permission management
- User suspension/ban
- Activity logs
- Email communication

**Database Tables:**
- `users` - User profiles
- `user_roles` - Role assignments
- `user_permissions` - Permission mapping
- `user_activity_logs` - Activity tracking
- `user_suspensions` - Suspension records

**API Endpoints (15+):**
- `GET /api/admin/users` - List users with pagination
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/suspend` - Suspend user
- `POST /api/admin/users/:id/unsuspend` - Unsuspend user
- `GET /api/admin/users/:id/activity` - User activity logs
- `POST /api/admin/users/:id/roles` - Assign roles
- `GET /api/admin/users/search` - Search users
- `GET /api/admin/users/export` - Export user data

### 3.2 Content Management

**Capabilities:**
- Manage courses (create, edit, delete, publish)
- Manage course modules and lessons
- Manage community posts (moderate, delete, feature)
- Manage events (create, edit, cancel)
- Content approval workflow
- Featured content management
- Content analytics

**Database Tables:**
- `courses` - Course information
- `course_modules` - Module structure
- `community_posts` - User posts
- `community_comments` - Post comments
- `events` - Event information
- `content_approvals` - Approval workflow

**API Endpoints (20+):**
- `GET /api/admin/courses` - List courses
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `POST /api/admin/courses/:id/publish` - Publish course
- `GET /api/admin/posts` - List community posts
- `DELETE /api/admin/posts/:id` - Delete post
- `POST /api/admin/posts/:id/feature` - Feature post
- `GET /api/admin/events` - List events
- `POST /api/admin/events` - Create event
- `GET /api/admin/content/pending` - Pending approvals

### 3.3 Mentor Management

**Capabilities:**
- View all mentors with ratings and statistics
- Mentor verification and approval
- Mentor profile management
- Mentor suspension/removal
- Mentor performance metrics
- Mentor-mentee matching oversight
- Mentor communication

**Database Tables:**
- `mentors` - Mentor profiles
- `mentor_matches` - Matching records
- `mentor_ratings` - Rating history
- `mentor_verification` - Verification status

**API Endpoints (12+):**
- `GET /api/admin/mentors` - List mentors
- `GET /api/admin/mentors/:id` - Get mentor details
- `POST /api/admin/mentors/:id/verify` - Verify mentor
- `POST /api/admin/mentors/:id/suspend` - Suspend mentor
- `GET /api/admin/mentors/:id/matches` - Mentor matches
- `GET /api/admin/mentors/:id/ratings` - Mentor ratings
- `GET /api/admin/mentors/performance` - Performance metrics

### 3.4 System Configuration

**Capabilities:**
- Platform settings management
- Email configuration
- Payment settings
- Notification preferences
- Feature flags
- Rate limiting configuration
- Security settings

**Configuration Areas:**
- General settings (company info, branding)
- Email templates
- Payment gateway settings
- Notification rules
- Feature toggles
- API rate limits
- Security policies

---

## 4. Analytics Platform Features

### 4.1 Real-Time Dashboards

**User Analytics:**
- Total users (active, inactive, new)
- User growth trends (daily, weekly, monthly)
- User retention rates
- User engagement metrics
- User demographics (age, archetype distribution)
- Geographic distribution

**Course Analytics:**
- Total courses and modules
- Course enrollment trends
- Course completion rates
- Average course rating
- Popular courses
- Course performance metrics
- Student progress tracking

**Mentor Analytics:**
- Total mentors (active, inactive)
- Mentor utilization rates
- Mentor ratings and reviews
- Mentor-mentee match success rates
- Mentor session duration
- Mentor response times

**Community Analytics:**
- Total posts and comments
- Post engagement (likes, shares, comments)
- Community growth trends
- Most active users
- Trending topics
- Community health metrics

**Financial Analytics:**
- Revenue by source (subscriptions, courses, mentoring)
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Customer lifetime value (LTV)
- Churn rate
- Payment success rates

### 4.2 Advanced Reports

**Pre-built Reports:**
- Daily summary report
- Weekly performance report
- Monthly business review
- User acquisition report
- Retention analysis report
- Revenue report
- Course performance report
- Mentor performance report

**Report Features:**
- Customizable date ranges
- Filtering and segmentation
- Export to PDF, CSV, Excel
- Email scheduling
- Report templates
- Data visualization
- Comparative analysis

### 4.3 Custom Analytics

**Capabilities:**
- Custom dashboard creation
- Drag-and-drop widget builder
- Custom metrics and KPIs
- Data source selection
- Visualization options
- Sharing and collaboration
- Scheduled reports

---

## 5. Database Schema

### 5.1 New Tables for Admin Dashboard

```sql
-- Admin users and roles
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50),
  permissions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admin_users(id),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INTEGER,
  changes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System configuration
CREATE TABLE system_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE,
  value JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics snapshots
CREATE TABLE analytics_snapshots (
  id SERIAL PRIMARY KEY,
  metric_name VARCHAR(100),
  metric_value DECIMAL(15, 2),
  dimension JSONB,
  snapshot_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  type VARCHAR(50),
  config JSONB,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 Indexes for Performance

```sql
CREATE INDEX idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_analytics_snapshots_date ON analytics_snapshots(snapshot_date);
CREATE INDEX idx_analytics_snapshots_metric ON analytics_snapshots(metric_name);
CREATE INDEX idx_reports_created_by ON reports(created_by);
```

---

## 6. API Specification

### 6.1 Authentication & Authorization

**Admin Authentication:**
- JWT tokens with admin-specific claims
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Session management with Redis
- Audit logging for all admin actions

**Authorization Levels:**
- Super Admin: Full access
- Admin: User, content, mentor management
- Moderator: Content moderation only
- Analyst: Read-only analytics access

### 6.2 API Endpoints (60+)

**User Management (15 endpoints):**
- User CRUD operations
- Role and permission management
- User activity tracking
- Bulk operations

**Content Management (20 endpoints):**
- Course management
- Module management
- Post moderation
- Event management
- Content approval workflow

**Mentor Management (12 endpoints):**
- Mentor verification
- Performance tracking
- Match management
- Communication

**Analytics (13 endpoints):**
- Dashboard data
- Report generation
- Custom metrics
- Data export

---

## 7. Frontend Components

### 7.1 Dashboard Pages

**Main Dashboard:**
- Key metrics cards (users, courses, revenue)
- Trend charts (user growth, revenue)
- Recent activities
- Quick actions

**User Management:**
- User list with filters
- User detail view
- User edit form
- Role assignment
- Activity logs

**Content Management:**
- Course list and management
- Post moderation interface
- Event management
- Content approval queue

**Analytics:**
- Real-time dashboards
- Customizable widgets
- Report builder
- Data export

**Settings:**
- System configuration
- Email templates
- Payment settings
- Feature flags

### 7.2 UI Components

**Data Tables:**
- Sortable columns
- Pagination
- Filtering
- Bulk actions
- Export options

**Charts & Visualizations:**
- Line charts (trends)
- Bar charts (comparisons)
- Pie charts (distribution)
- Heatmaps (patterns)
- Gauges (metrics)

**Forms:**
- User forms
- Course forms
- Event forms
- Settings forms
- Report configuration

---

## 8. Security Considerations

**Access Control:**
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Admin-only endpoints
- Audit logging

**Data Protection:**
- Sensitive data encryption
- PII masking in logs
- Secure password hashing
- Session management

**Monitoring:**
- Admin action logging
- Failed login attempts
- Suspicious activity alerts
- Rate limiting

---

## 9. Performance Optimization

**Caching Strategy:**
- Redis caching for frequently accessed data
- Cache invalidation on updates
- TTL-based cache expiration
- Cache warming for peak hours

**Database Optimization:**
- Query optimization
- Index usage
- Connection pooling
- Read replicas for analytics

**Frontend Optimization:**
- Code splitting
- Lazy loading
- Image optimization
- Bundle size reduction

---

## 10. Development Timeline

**Week 1-2: Backend Development**
- Admin API endpoints
- Database schema
- Authentication & authorization
- Analytics data collection

**Week 2-3: Frontend Development**
- Dashboard layout
- User management interface
- Content management interface
- Analytics dashboards

**Week 3-4: Integration & Testing**
- API integration
- End-to-end testing
- Performance testing
- Security testing

**Week 4-5: Optimization & Deployment**
- Performance optimization
- Security hardening
- Documentation
- Deployment preparation

**Week 5-6: Launch & Monitoring**
- Production deployment
- Monitoring setup
- Team training
- Go-live support

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| API Response Time | < 500ms |
| Dashboard Availability | 99.95% |
| User Management Operations | < 1 second |
| Report Generation | < 30 seconds |
| Analytics Data Freshness | < 5 minutes |
| Test Coverage | > 85% |
| Security Score | A+ |

---

## 12. Deliverables

1. **Backend API** - 60+ endpoints
2. **Frontend Dashboard** - 10+ pages
3. **Database Schema** - 8 new tables
4. **Documentation** - API docs, deployment guide
5. **Testing** - Unit, integration, E2E tests
6. **Monitoring** - Logging, alerting, dashboards

---

**Status:** ✅ **ARCHITECTURE COMPLETE - READY FOR DEVELOPMENT**

**Next Steps:**
1. Backend API development
2. Frontend interface development
3. Integration and testing
4. Deployment and launch

---

**Repository:** https://github.com/lekesiz/fkod  
**Prepared by:** Manus AI  
**Date:** June 5, 2026
