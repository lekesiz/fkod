# F-Kod Backend API

Node.js + Express.js + PostgreSQL ile yazılmış F-Kod projesinin backend API'ı.

## 🚀 Kurulum

### Gereksinimler
- Node.js 22+
- PostgreSQL 15+
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **.env dosyasını konfigüre et:**
```bash
cp .env.example .env
```

3. **Veritabanını oluştur:**
```bash
psql -U postgres -c "CREATE DATABASE fkod_db;"
psql -U postgres -c "CREATE USER fkod_user WITH PASSWORD 'fkod_password_secure';"
psql -U postgres -c "ALTER ROLE fkod_user SET client_encoding TO 'utf8';"
psql -U postgres -c "ALTER ROLE fkod_user SET default_transaction_isolation TO 'read committed';"
psql -U postgres -c "ALTER ROLE fkod_user SET default_transaction_deferrable TO on;"
psql -U postgres -c "ALTER ROLE fkod_user SET default_time_zone TO 'UTC';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE fkod_db TO fkod_user;"
```

4. **Veritabanı şemasını yükle:**
```bash
psql -U fkod_user -d fkod_db -f src/config/schema.sql
```

5. **Sunucuyu başlat:**
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi
- `POST /api/auth/logout` - Çıkış

### Users
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/search?q=query` - Kullanıcı ara
- `GET /api/users/:id` - Kullanıcı detayı
- `PUT /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil (Admin)

## 🔐 Authentication

API, JWT (JSON Web Token) kullanarak kimlik doğrulaması yapar.

### Login örneği:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Protected endpoint örneği:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Veritabanı Şeması

### Users
- `id` (UUID)
- `email` (VARCHAR, UNIQUE)
- `name` (VARCHAR)
- `age` (INT)
- `archetype_code` (VARCHAR)
- `bio` (TEXT)
- `avatar_url` (VARCHAR)
- `password_hash` (VARCHAR)
- `is_mentor` (BOOLEAN)
- `is_admin` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### Mentors
- `id` (UUID)
- `user_id` (UUID, FOREIGN KEY)
- `bio` (TEXT)
- `expertise` (VARCHAR[])
- `availability` (JSONB)
- `hourly_rate` (INT)
- `rating` (DECIMAL)
- `reviews_count` (INT)

### Courses
- `id` (UUID)
- `title` (VARCHAR)
- `description` (TEXT)
- `instructor_id` (UUID, FOREIGN KEY)
- `archetype_target` (VARCHAR[])
- `level` (VARCHAR)
- `duration_hours` (INT)

### Community Posts
- `id` (UUID)
- `user_id` (UUID, FOREIGN KEY)
- `title` (VARCHAR)
- `content` (TEXT)
- `category` (VARCHAR)
- `likes_count` (INT)
- `comments_count` (INT)

### Messages
- `id` (UUID)
- `sender_id` (UUID, FOREIGN KEY)
- `recipient_id` (UUID, FOREIGN KEY)
- `content` (TEXT)
- `read` (BOOLEAN)

### Events
- `id` (UUID)
- `title` (VARCHAR)
- `description` (TEXT)
- `organizer_id` (UUID, FOREIGN KEY)
- `start_date` (TIMESTAMP)
- `end_date` (TIMESTAMP)
- `location` (VARCHAR)
- `max_attendees` (INT)

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fkod_db
DB_USER=fkod_user
DB_PASSWORD=fkod_password_secure

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

MANUS_OAUTH_URL=https://oauth.manus.im
MANUS_CLIENT_ID=your_client_id
MANUS_CLIENT_SECRET=your_client_secret

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@fkod.org

OPENAI_API_KEY=your_openai_api_key

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=fkod-uploads

CORS_ORIGIN=http://localhost:3000
```

## 📝 Development

### Proje Yapısı
```
src/
├── config/
│   ├── database.js
│   └── schema.sql
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
└── index.js
```

### Scripts
- `npm run dev` - Development modunda çalıştır (auto-reload)
- `npm start` - Production modunda çalıştır
- `npm test` - Testleri çalıştır

## 🚀 Deployment

### Heroku
```bash
heroku create fkod-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Docker
```bash
docker build -t fkod-backend .
docker run -p 5000:5000 fkod-backend
```

## 📞 Support

Sorular veya sorunlar için: info@fkod.org

## 📄 License

MIT
