# F-KOD WEBAPP PROJESİ - BACKEND GELİŞTİRİCİ TODO LİSTESİ

## 📋 Rol Özeti
**Rol:** Backend Geliştirici  
**Sorumluluğu:** Webapp'ın arka yüz (sunucu tarafında) kodlaması ve veri yönetimi  
**Zaman Çizelgesi:** MVP 2-3 hafta, Aşama 2: 8-10 hafta  
**Çalışma Modeli:** Tam zamanlı (MVP), Tam zamanlı (Aşama 2)

---

## FAZA 1: ORTAM KURULUMU VE PLANLAMA (Gün 1-2)

### 1.1 Geliştirme Ortamı
- [ ] Node.js kurulumu (v16+)
- [ ] npm/yarn kurulumu
- [ ] Git kurulumu ve konfigürasyonu
- [ ] Kod editörü (VS Code)
- [ ] VS Code extensions
  - [ ] REST Client
  - [ ] Thunder Client
  - [ ] Prettier
  - [ ] ESLint
  - [ ] Git Graph
- [ ] Postman kurulması (API testing)
- [ ] Database client (DBeaver, pgAdmin vb.)

### 1.2 Proje Kurulması
- [ ] Node.js uygulaması oluşturma
  ```bash
  mkdir fkod-backend
  cd fkod-backend
  npm init -y
  ```
- [ ] Proje yapısını oluşturma
  ```
  src/
    routes/
    controllers/
    models/
    middleware/
    config/
    utils/
    services/
  tests/
  .env
  .gitignore
  ```
- [ ] package.json bağımlılıklarını kurma
  - [ ] Express.js
  - [ ] Dotenv
  - [ ] CORS
  - [ ] Helmet (security)
  - [ ] Morgan (logging)
  - [ ] Axios (HTTP requests)
  - [ ] Nodemailer (e-posta)
  - [ ] Sequelize veya Knex (ORM)
  - [ ] PostgreSQL driver
  - [ ] JWT (authentication)
  - [ ] Bcrypt (password hashing)

### 1.3 Konfigürasyon
- [ ] .env dosyası oluşturma
  ```
  NODE_ENV=development
  PORT=3001
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  CHATGPT_API_KEY=...
  SENDGRID_API_KEY=...
  MAKE_WEBHOOK_URL=...
  ```
- [ ] ESLint ve Prettier konfigürasyonu
- [ ] Git pre-commit hooks (Husky)

### 1.4 Veritabanı Planlaması
- [ ] Veritabanı şeması tasarımı
  - [ ] Users table
  - [ ] TestResponses table
  - [ ] Archetypes table
  - [ ] Mentors table
  - [ ] Subscriptions table
  - [ ] Notifications table
  - [ ] Messages table
  - [ ] Courses table
  - [ ] Posts table
  - [ ] Comments table

---

## FAZA 2: MVP BACKEND - TEMEL KURULUM (Gün 2-3)

### 2.1 Express.js Kurulması
- [ ] Express uygulaması oluşturma
  ```javascript
  const express = require('express');
  const app = express();
  ```
- [ ] Middleware'leri kurma
  - [ ] CORS
  - [ ] Body parser (JSON)
  - [ ] Helmet (security headers)
  - [ ] Morgan (logging)
  - [ ] Error handling middleware
- [ ] Routes dosyasını oluşturma
- [ ] Server başlatma (port 3001)

### 2.2 Veritabanı Kurulması
- [ ] PostgreSQL veritabanı oluşturma
  ```sql
  CREATE DATABASE fkod_db;
  ```
- [ ] Sequelize kurulması ve konfigürasyonu
  ```bash
  npm install sequelize pg pg-hstore
  npx sequelize-cli init
  ```
- [ ] Database connection kurulması
- [ ] Migration dosyaları oluşturma
  ```bash
  npx sequelize-cli migration:create --name create-users-table
  ```

### 2.3 Veritabanı Şemaları
- [ ] Users table
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] TestResponses table
  ```sql
  CREATE TABLE test_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER,
    answer CHAR(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] Archetypes table
  ```sql
  CREATE TABLE archetypes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) UNIQUE,
    name VARCHAR(255),
    description TEXT
  );
  ```

---

## FAZA 3: MVP BACKEND - TEST API (Gün 3-4)

### 3.1 Test Submission Endpoint
- [ ] POST /api/test/submit endpoint
  - [ ] Request body: { userId, responses: [{ questionId, answer }] }
  - [ ] Cevapları veritabanına kaydetme
  - [ ] Fıtrat tipini hesaplama
  - [ ] Response: { archetypeCode, archetypeName }
- [ ] Validation middleware
  - [ ] Tüm cevapların sağlanıp sağlanmadığını kontrol etme
  - [ ] Cevapların geçerli olup olmadığını kontrol etme (A, B, C, D)

### 3.2 Soru Yönetimi
- [ ] GET /api/questions endpoint
  - [ ] Tüm 10 soruyu döndürme
  - [ ] Response: [{ id, text, options: [A, B, C, D] }]
- [ ] Soruları veritabanına kaydetme
  ```javascript
  const questions = [
    { id: 1, text: "Dönem Ödevi Krizi...", options: [...] },
    // ... 10 soru
  ];
  ```

### 3.3 Fıtrat Hesaplama Algoritması
- [ ] Cevapları analiz etme
  - [ ] A cevapları = Sistem puanı
  - [ ] B cevapları = Kalp puanı
  - [ ] C cevapları = Mana puanı
  - [ ] D cevapları = Aksiyon puanı
- [ ] En yüksek 2 puanı bulma
- [ ] Arketip kombinasyonunu belirleme (A+B, A+C, vb.)
- [ ] Arketip bilgilerini döndürme

---

## FAZA 4: MVP BACKEND - E-POSTA VE CHATGPT (Gün 4-5)

### 4.1 ChatGPT Entegrasyonu
- [ ] OpenAI API kurulması
  ```bash
  npm install openai
  ```
- [ ] ChatGPT client oluşturma
  ```javascript
  const { Configuration, OpenAIApi } = require("openai");
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHATGPT_API_KEY,
  }));
  ```
- [ ] Prompt template oluşturma
  ```javascript
  const systemPrompt = `Sen F-Kod Derneği'nin baş mentorüsün...`;
  const userPrompt = `Kullanıcı: ${userName}, Arketip: ${archetypeName}`;
  ```
- [ ] Rapor oluşturma fonksiyonu
  ```javascript
  async function generateReport(userName, archetypeName) {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    return response.data.choices[0].message.content;
  }
  ```

### 4.2 E-posta Gönderme
- [ ] Nodemailer kurulması
  ```bash
  npm install nodemailer
  ```
- [ ] E-posta servisi konfigürasyonu (SendGrid, Gmail vb.)
  ```javascript
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY
    }
  });
  ```
- [ ] POST /api/email/subscribe endpoint
  - [ ] Request body: { email }
  - [ ] E-posta validasyonu
  - [ ] Veritabanına kaydetme
  - [ ] E-posta gönderme
- [ ] E-posta şablonu oluşturma
  ```javascript
  const emailTemplate = `
    <h1>Merhaba ${userName}</h1>
    <p>Fıtrat Pusulası: ${archetypeName}</p>
    <p>${reportText}</p>
    <a href="https://fkod.org">Derneğe Katıl</a>
  `;
  ```

### 4.3 PDF Oluşturma
- [ ] PDF kütüphanesi kurulması (PDFKit, ReportLab vb.)
  ```bash
  npm install pdfkit
  ```
- [ ] PDF template oluşturma
  ```javascript
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  doc.fontSize(25).text('F-KOD PUSULAN ÇÖZÜLDÜ!');
  doc.fontSize(12).text(reportText);
  ```
- [ ] PDF oluşturma ve gönderme
  ```javascript
  async function generateAndSendPDF(email, userName, reportText) {
    // PDF oluştur
    // E-posta ile gönder
  }
  ```

---

## FAZA 5: MVP BACKEND - MAKE.COM ENTEGRASYONU (Gün 5)

### 5.1 Make.com Webhook Kurulması
- [ ] Make.com hesabı oluşturma
- [ ] Webhook URL oluşturma
- [ ] Tally.so'dan Make.com'a veri akışı
  - [ ] Tally.so form submission → Make.com webhook
  - [ ] Make.com → Backend API
- [ ] POST /api/webhook/tally endpoint
  - [ ] Request body: { email, responses: [...] }
  - [ ] Test cevaplarını işleme
  - [ ] ChatGPT raporu oluşturma
  - [ ] E-posta gönderme

### 5.2 Otomasyon Akışı
- [ ] Tally.so form submission
- [ ] Make.com webhook tetikleme
- [ ] Backend API çağrısı
- [ ] ChatGPT rapor oluşturma
- [ ] E-posta gönderme
- [ ] Veritabanına kaydetme

---

## FAZA 6: MVP BACKEND - TESTING (Gün 6)

### 6.1 API Testing
- [ ] Postman collection oluşturma
- [ ] Tüm endpoint'leri test etme
  - [ ] GET /api/questions
  - [ ] POST /api/test/submit
  - [ ] POST /api/email/subscribe
  - [ ] POST /api/webhook/tally
- [ ] Happy path testing
- [ ] Error case testing
- [ ] Edge case testing

### 6.2 Veritabanı Testing
- [ ] Veri yazma ve okuma testleri
- [ ] Veri validasyonu testleri
- [ ] Foreign key constraints testleri
- [ ] Unique constraints testleri

### 6.3 Entegrasyon Testing
- [ ] Frontend-Backend entegrasyonu
- [ ] ChatGPT API entegrasyonu
- [ ] E-posta servisi entegrasyonu
- [ ] Make.com entegrasyonu

---

## FAZA 7: AŞAMA 2 BACKEND (Hafta 3+)

### 7.1 Kimlik Doğrulama Sistemi
- [ ] JWT kurulması
  ```bash
  npm install jsonwebtoken
  ```
- [ ] POST /api/auth/register endpoint
  - [ ] Ad, e-posta, şifre
  - [ ] Şifre hashing (bcrypt)
  - [ ] Veritabanına kaydetme
  - [ ] JWT token döndürme
- [ ] POST /api/auth/login endpoint
  - [ ] E-posta ve şifre doğrulama
  - [ ] JWT token oluşturma
  - [ ] Token döndürme
- [ ] POST /api/auth/refresh endpoint
  - [ ] Token yenileme
- [ ] Middleware: Token doğrulama
  ```javascript
  const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  ```

### 7.2 Kullanıcı Yönetimi
- [ ] GET /api/users/:id endpoint
- [ ] PUT /api/users/:id endpoint
  - [ ] Profil güncellemesi
  - [ ] Şifre değişimi
- [ ] DELETE /api/users/:id endpoint
- [ ] GET /api/users/:id/profile endpoint
  - [ ] Fıtrat bilgileri
  - [ ] Başarılar
  - [ ] Mentor eşleştirmesi

### 7.3 Mentor Sistemi
- [ ] Mentors table
- [ ] GET /api/mentors endpoint
  - [ ] Tüm mentorları listeleme
  - [ ] Filtreleme (uzmanlık alanı, rating vb.)
  - [ ] Pagination
- [ ] GET /api/mentors/:id endpoint
  - [ ] Mentor detayları
  - [ ] Mentor profili
- [ ] POST /api/mentors/:id/connect endpoint
  - [ ] Mentor eşleştirmesi
  - [ ] Notification gönderme
- [ ] Mentor eşleştirme algoritması
  - [ ] Kullanıcının fıtratı ile mentor uzmanlığını eşleştirme

### 7.4 Online Eğitimler
- [ ] Courses table
- [ ] GET /api/courses endpoint
  - [ ] Tüm kursları listeleme
  - [ ] Filtreleme ve arama
  - [ ] Pagination
- [ ] GET /api/courses/:id endpoint
  - [ ] Kurs detayları
  - [ ] Kurs videoları
- [ ] POST /api/courses/:id/enroll endpoint
  - [ ] Kursa katılım
- [ ] PUT /api/courses/:id/progress endpoint
  - [ ] İlerleme güncelleme
- [ ] Kurs içeriği yönetimi (admin)

### 7.5 Mesajlaşma Sistemi
- [ ] Messages table
- [ ] POST /api/messages endpoint
  - [ ] Mesaj gönderme
  - [ ] Real-time mesajlaşma (WebSocket)
- [ ] GET /api/messages/:conversationId endpoint
  - [ ] Sohbet geçmişi
- [ ] GET /api/conversations endpoint
  - [ ] Tüm sohbetleri listeleme
- [ ] WebSocket kurulması
  ```javascript
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    socket.on('send_message', (data) => {
      // Mesaj gönderme
    });
  });
  ```

### 7.6 Topluluk Sistemi
- [ ] Posts table
- [ ] Comments table
- [ ] POST /api/posts endpoint
  - [ ] Post oluşturma
- [ ] GET /api/posts endpoint
  - [ ] Tüm postları listeleme
  - [ ] Pagination
  - [ ] Sıralama (en yeni, en popüler)
- [ ] POST /api/posts/:id/like endpoint
  - [ ] Post beğenme
- [ ] POST /api/posts/:id/comment endpoint
  - [ ] Yorum yapma
- [ ] DELETE /api/posts/:id endpoint
  - [ ] Post silme (admin/owner)

### 7.7 Bildirim Sistemi
- [ ] Notifications table
- [ ] POST /api/notifications endpoint
  - [ ] Bildirim oluşturma
- [ ] GET /api/notifications endpoint
  - [ ] Tüm bildirimleri listeleme
- [ ] PUT /api/notifications/:id endpoint
  - [ ] Bildirimi okundu olarak işaretleme
- [ ] Email notifications
- [ ] Push notifications (opsiyonel)

### 7.8 Admin Paneli
- [ ] Admin middleware
- [ ] GET /api/admin/users endpoint
  - [ ] Tüm kullanıcıları listeleme
- [ ] GET /api/admin/analytics endpoint
  - [ ] Kullanıcı istatistikleri
  - [ ] Test istatistikleri
  - [ ] Arketip dağılımı
- [ ] POST /api/admin/courses endpoint
  - [ ] Kurs oluşturma
- [ ] DELETE /api/admin/users/:id endpoint
  - [ ] Kullanıcı silme

---

## DEVAM EDEN GÖREVLER

### Günlük Görevler
- [ ] Kod yazma ve commit etme
- [ ] Frontend geliştiriciyle API entegrasyonunu gözden geçirme
- [ ] API testing
- [ ] Code review'leri yapma

### Haftalık Görevler
- [ ] Sprint review toplantıları
- [ ] Proje yöneticisiyle ilerleme raporu
- [ ] Database performance analizi
- [ ] Security audit

### Aylık Görevler
- [ ] Kod kalitesi analizi
- [ ] Database optimization
- [ ] Dependency güncellemeleri
- [ ] Security updates

---

## BAŞARININ ÖLÇÜLMESİ

### MVP Backend Başarı Kriterleri
- [ ] Tüm API endpoint'leri çalışıyor
- [ ] 0 critical bugs
- [ ] <200ms response time
- [ ] 99% uptime
- [ ] Tüm testler pass

### Aşama 2 Backend Başarı Kriterleri
- [ ] Tüm API endpoint'leri çalışıyor
- [ ] 0 critical bugs
- [ ] <100ms response time
- [ ] 99.9% uptime
- [ ] Tüm testler pass
- [ ] 1000+ eş zamanlı kullanıcı desteği

---

## ARAÇLAR VE KAYNAKLAR

**Kütüphaneler:**
- Express.js
- Sequelize (ORM)
- PostgreSQL
- JWT
- Bcrypt
- Nodemailer
- OpenAI API
- Socket.io (WebSocket)

**Testing:**
- Jest
- Supertest
- Postman

**Development Tools:**
- VS Code
- Postman
- DBeaver
- pgAdmin

**Deployment:**
- Heroku
- AWS EC2
- DigitalOcean
- Docker

---

**Hazırlayan:** Manus AI  
**Tarih:** 20 Şubat 2026  
**Versiyon:** 1.0
