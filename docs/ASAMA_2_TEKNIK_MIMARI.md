# F-Kod Aşama 2: Teknik Mimari ve Spesifikasyon

**Tarih:** 20 Şubat 2026  
**Versiyon:** 2.0  
**Durum:** Planlama Aşaması

---

## 📐 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────┐
│                    F-KÖD AŞAMA 2 MİMARİSİ                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              FRONTEND (React 19 + Vite)                 │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Dashboard                                             │   │
│  │ • User Profile & Settings                               │   │
│  │ • Mentor Matching & Messaging                           │   │
│  │ • Course Platform                                       │   │
│  │ • Community Forum                                       │   │
│  │ • Events Calendar                                       │   │
│  │ • Analytics & Progress                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▲                                     │
│                           │ REST API / WebSocket                │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           BACKEND (Node.js + Express.js)                │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Authentication (Manus OAuth)                          │   │
│  │ • User Management                                       │   │
│  │ • Mentor System                                         │   │
│  │ • Course Management                                     │   │
│  │ • Community Management                                  │   │
│  │ • Messaging Service                                     │   │
│  │ • Analytics Engine                                      │   │
│  │ • File Upload Service                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▲                                     │
│                           │ SQL / WebSocket                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         DATABASE (PostgreSQL + Redis Cache)             │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Users & Profiles                                      │   │
│  │ • Mentors & Matching                                    │   │
│  │ • Courses & Progress                                    │   │
│  │ • Community Posts & Comments                            │   │
│  │ • Messages & Notifications                              │   │
│  │ • Analytics & Events                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           EXTERNAL SERVICES                             │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Manus OAuth (Authentication)                          │   │
│  │ • SendGrid (Email)                                      │   │
│  │ • Stripe (Payments - Future)                            │   │
│  │ • AWS S3 (File Storage)                                 │   │
│  │ • ChatGPT API (AI Features)                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Veritabanı Şeması

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT,
  archetype_code VARCHAR(10),
  bio TEXT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Mentors Table
```sql
CREATE TABLE mentors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bio TEXT,
  expertise VARCHAR(255)[],
  availability JSON,
  hourly_rate INT,
  rating DECIMAL(3,2),
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Mentor Matching Table
```sql
CREATE TABLE mentor_matches (
  id UUID PRIMARY KEY,
  mentee_id UUID REFERENCES users(id),
  mentor_id UUID REFERENCES mentors(id),
  status VARCHAR(50), -- pending, active, completed
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES users(id),
  archetype_target VARCHAR(10)[],
  level VARCHAR(50), -- beginner, intermediate, advanced
  duration_hours INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Course Modules Table
```sql
CREATE TABLE course_modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255),
  content TEXT,
  video_url VARCHAR(255),
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  module_id UUID REFERENCES course_modules(id),
  completed BOOLEAN DEFAULT FALSE,
  progress_percent INT DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Community Posts Table
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  content TEXT,
  category VARCHAR(50),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  organizer_id UUID REFERENCES users(id),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  location VARCHAR(255),
  max_attendees INT,
  attendees_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Users
```
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/profile
PUT    /api/users/:id/profile
GET    /api/users/search
```

### Mentors
```
GET    /api/mentors
GET    /api/mentors/:id
POST   /api/mentors/register
PUT    /api/mentors/:id
GET    /api/mentors/:id/reviews
```

### Mentor Matching
```
POST   /api/matches/request
GET    /api/matches/pending
GET    /api/matches/active
PUT    /api/matches/:id/accept
PUT    /api/matches/:id/reject
PUT    /api/matches/:id/complete
```

### Courses
```
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses (instructor only)
PUT    /api/courses/:id (instructor only)
DELETE /api/courses/:id (instructor only)
GET    /api/courses/:id/modules
```

### User Progress
```
GET    /api/progress/courses
GET    /api/progress/courses/:id
POST   /api/progress/modules/:id/complete
GET    /api/progress/analytics
```

### Community
```
GET    /api/community/posts
POST   /api/community/posts
GET    /api/community/posts/:id
PUT    /api/community/posts/:id
DELETE /api/community/posts/:id
POST   /api/community/posts/:id/comments
GET    /api/community/posts/:id/comments
```

### Messages
```
GET    /api/messages
GET    /api/messages/:userId
POST   /api/messages
GET    /api/messages/:id
PUT    /api/messages/:id/read
```

### Events
```
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
POST   /api/events/:id/join
DELETE /api/events/:id/leave
```

---

## 🔐 Authentication Flow

```
1. User clicks "Login with Manus"
   ↓
2. Redirect to Manus OAuth Portal
   ↓
3. User authenticates with Manus
   ↓
4. Manus redirects to callback URL with code
   ↓
5. Backend exchanges code for token
   ↓
6. Create/update user in database
   ↓
7. Generate JWT token
   ↓
8. Redirect to dashboard with token
   ↓
9. Frontend stores token in localStorage/cookie
   ↓
10. All API requests include JWT token
```

---

## 💬 Real-time Features

### WebSocket Events

**Messaging:**
```
message:send → {senderId, recipientId, content}
message:receive → {senderId, content, timestamp}
message:read → {messageId}
```

**Notifications:**
```
notification:new → {type, title, content}
notification:read → {notificationId}
```

**Mentor Matching:**
```
match:request → {menteeId, mentorId}
match:accepted → {matchId}
match:rejected → {matchId}
```

---

## 📊 Database Relationships

```
users (1) ──→ (many) mentors
users (1) ──→ (many) courses (as instructor)
users (1) ──→ (many) community_posts
users (1) ──→ (many) messages (as sender)
users (1) ──→ (many) messages (as recipient)
users (1) ──→ (many) mentor_matches (as mentee)

mentors (1) ──→ (many) mentor_matches
courses (1) ──→ (many) course_modules
courses (1) ──→ (many) user_progress
course_modules (1) ──→ (many) user_progress
community_posts (1) ──→ (many) comments
events (1) ──→ (many) event_attendees
```

---

## 🔄 Data Flow

### User Registration Flow
```
1. User signs up with Manus OAuth
2. Create user record in database
3. Redirect to onboarding
4. User completes profile
5. User takes F-Kod test (MVP)
6. Calculate archetype
7. Redirect to dashboard
```

### Mentor Matching Flow
```
1. Mentee searches for mentors
2. Mentee sends match request
3. Mentor receives notification
4. Mentor accepts/rejects
5. If accepted, create match record
6. Activate messaging between them
7. Track progress and completion
```

### Course Enrollment Flow
```
1. User browses courses
2. User enrolls in course
3. Create user_progress records
4. User starts learning
5. Track module completion
6. Calculate progress percentage
7. Show completion certificate
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19 |
| Frontend Build | Vite | 7.1 |
| Styling | Tailwind CSS | 4 |
| UI Components | shadcn/ui | Latest |
| Backend | Node.js | 22 |
| Backend Framework | Express.js | 4.21 |
| Database | PostgreSQL | 15+ |
| Cache | Redis | 7+ |
| Authentication | Manus OAuth | - |
| Real-time | WebSocket | Socket.io |
| File Storage | AWS S3 | - |
| Email | SendGrid | - |
| AI | ChatGPT API | GPT-4 |

---

## 📈 Performance Requirements

| Metric | Target |
|--------|--------|
| Page Load Time | <2s |
| API Response Time | <500ms |
| Database Query Time | <100ms |
| WebSocket Latency | <100ms |
| Concurrent Users | 1000+ |
| Daily Active Users | 500+ |
| Monthly Active Users | 5000+ |

---

## 🔒 Security Considerations

1. **Authentication:** Manus OAuth + JWT tokens
2. **Authorization:** Role-based access control (RBAC)
3. **Data Encryption:** HTTPS, encrypted passwords
4. **Input Validation:** Server-side validation
5. **Rate Limiting:** API rate limiting
6. **CORS:** Proper CORS configuration
7. **SQL Injection:** Parameterized queries
8. **XSS Protection:** Input sanitization
9. **CSRF Protection:** CSRF tokens

---

## 📋 Development Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1 | 2 weeks | Backend setup, DB schema, Auth |
| Phase 2 | 2 weeks | Frontend setup, Dashboard, Profiles |
| Phase 3 | 2 weeks | Mentor system, Matching algorithm |
| Phase 4 | 2 weeks | Course platform, Progress tracking |
| Phase 5 | 1 week | Community features, Forum |
| Phase 6 | 1 week | Events, Networking |
| Phase 7 | 1 week | Testing, Optimization |
| Phase 8 | 1 week | Deployment, Monitoring |

**Total:** ~12 weeks (3 months)

---

## 🎯 Success Metrics

| Metric | Target |
|--------|--------|
| User Registrations | 1000+ |
| Active Mentors | 100+ |
| Course Enrollments | 500+ |
| Community Posts | 200+ |
| Events Created | 20+ |
| System Uptime | 99.5%+ |
| User Satisfaction | 4.5+/5 |

---

**Versiyon:** 2.0  
**Son Güncelleme:** 20 Şubat 2026
