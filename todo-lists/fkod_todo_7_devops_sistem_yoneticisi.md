# F-KÖD WEBAPP PROJESİ - DEVOPS/SİSTEM YÖNETİCİSİ TODO LİSTESİ

## 📋 Rol Özeti
**Rol:** DevOps / Sistem Yöneticisi  
**Sorumluluğu:** Webapp'ın barındırılması, dağıtımı ve sistem yönetimi  
**Zaman Çizelgesi:** MVP 1 hafta (kurulum), Aşama 2: 2-3 hafta (kurulum) + devam eden yönetim  
**Çalışma Modeli:** Yarı zamanlı (MVP), Tam zamanlı (Aşama 2)

---

## FAZA 1: ORTAM KURULUMU (Gün 1-2)

### 1.1 Geliştirme Ortamı
- [ ] Git kurulması ve konfigürasyonu
- [ ] Docker kurulması (opsiyonel, Aşama 2 için)
- [ ] Docker Compose kurulması (opsiyonel)
- [ ] Cloud CLI tools kurulması
  - [ ] AWS CLI (AWS kullanılacaksa)
  - [ ] Azure CLI (Azure kullanılacaksa)
  - [ ] Google Cloud SDK (GCP kullanılacaksa)
  - [ ] Heroku CLI (Heroku kullanılacaksa)
- [ ] Monitoring tools kurulması
  - [ ] Datadog agent (opsiyonel)
  - [ ] New Relic agent (opsiyonel)

### 1.2 Cloud Platform Seçimi
- [ ] Platform seçimi (MVP için)
  - [ ] [ ] Heroku (basit, hızlı)
  - [ ] [ ] AWS (esnek, ölçeklenebilir)
  - [ ] [ ] DigitalOcean (uygun fiyatlı)
  - [ ] [ ] Azure (kurumsal)
  - [ ] [ ] Google Cloud (güçlü)
- [ ] Platform seçimi (Aşama 2 için)
  - [ ] [ ] AWS (önerilir)
  - [ ] [ ] Google Cloud
  - [ ] [ ] Azure

### 1.3 DNS ve Domain
- [ ] Domain satın alma (fkod.org veya fkod.app)
- [ ] DNS provider seçimi (Namecheap, Route53 vb.)
- [ ] DNS kayıtlarını konfigüre etme
  - [ ] A record
  - [ ] CNAME record
  - [ ] MX record (e-posta için)
  - [ ] TXT record (SPF, DKIM)

---

## FAZA 2: MVP INFRASTRUCTURE (Gün 2-3)

### 2.1 Heroku Deployment (MVP için)
- [ ] Heroku hesabı oluşturma
- [ ] Heroku CLI kurulması
- [ ] Heroku uygulaması oluşturma
  ```bash
  heroku create fkod-app
  ```
- [ ] Procfile oluşturma
  ```
  web: npm start
  ```
- [ ] Environment variables kurulması
  ```bash
  heroku config:set NODE_ENV=production
  heroku config:set DATABASE_URL=...
  heroku config:set JWT_SECRET=...
  ```
- [ ] Dyno type seçimi (Free, Hobby, Standard)
- [ ] Automatic deployment kurulması (GitHub integration)

### 2.2 Veritabanı Kurulması (MVP)
- [ ] PostgreSQL veritabanı oluşturma
  - [ ] Heroku Postgres eklentisi (Heroku kullanılacaksa)
  - [ ] AWS RDS (AWS kullanılacaksa)
  - [ ] DigitalOcean Managed Database (DigitalOcean kullanılacaksa)
- [ ] Veritabanı bağlantı stringi kurulması
- [ ] Migration'ları çalıştırma
  ```bash
  npm run migrate
  ```
- [ ] Seed data'yı yükleme (opsiyonel)

### 2.3 SSL/HTTPS Kurulması
- [ ] SSL sertifikası oluşturma
  - [ ] Let's Encrypt (ücretsiz)
  - [ ] AWS Certificate Manager (AWS kullanılacaksa)
  - [ ] Heroku SSL (Heroku kullanılacaksa)
- [ ] HTTPS yönlendirmesi kurulması
- [ ] HSTS header'ı kurulması
- [ ] Mixed content uyarılarını kontrol etme

### 2.4 E-posta Servisi Kurulması
- [ ] SendGrid hesabı oluşturma (veya Mailgun, AWS SES)
- [ ] API key oluşturma
- [ ] Environment variable olarak kaydetme
  ```bash
  heroku config:set SENDGRID_API_KEY=...
  ```
- [ ] E-posta şablonları kurulması
- [ ] Test e-posta gönderme

---

## FAZA 3: MVP DEPLOYMENT (Gün 3-4)

### 3.1 Build Pipeline Kurulması
- [ ] GitHub Actions kurulması (CI/CD)
  ```yaml
  name: Deploy
  on:
    push:
      branches: [ main ]
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Deploy to Heroku
          uses: akhileshns/heroku-deploy@v3.12.12
  ```
- [ ] Automated testing kurulması
  - [ ] Unit test'leri çalıştırma
  - [ ] Integration test'leri çalıştırma
  - [ ] Linting ve code quality checks
- [ ] Build artifact'ları kurulması

### 3.2 Deployment Süreci
- [ ] Development branch'inde çalışma
- [ ] Pull request oluşturma
- [ ] Code review ve approval
- [ ] Main branch'e merge etme
- [ ] Otomatik deployment tetiklenmesi
- [ ] Production'da doğrulama

### 3.3 Rollback Süreci
- [ ] Rollback planı oluşturma
- [ ] Önceki versiyon saklama
- [ ] Rollback komutu hazırlama
  ```bash
  heroku releases
  heroku rollback
  ```

---

## FAZA 4: MONITORING VE LOGGING (Gün 4)

### 4.1 Application Monitoring
- [ ] Heroku Logs kurulması
  ```bash
  heroku logs --tail
  ```
- [ ] Error tracking kurulması (Sentry, Rollbar vb.)
  - [ ] Sentry hesabı oluşturma
  - [ ] Sentry SDK kurulması
  - [ ] Error alerts kurulması
- [ ] Performance monitoring
  - [ ] Response time monitoring
  - [ ] Database query monitoring
  - [ ] CPU ve memory usage monitoring

### 4.2 Uptime Monitoring
- [ ] Uptime monitoring servisi (UptimeRobot, Pingdom vb.)
- [ ] Health check endpoint oluşturma
  ```javascript
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  ```
- [ ] Alert'ler kurulması (email, SMS, Slack)

### 4.3 Logging
- [ ] Centralized logging kurulması (opsiyonel)
  - [ ] ELK Stack (Elasticsearch, Logstash, Kibana)
  - [ ] CloudWatch (AWS)
  - [ ] Stackdriver (Google Cloud)
- [ ] Log retention policy'si kurulması
- [ ] Log analysis ve reporting

---

## FAZA 5: BACKUP VE DISASTER RECOVERY (Gün 4-5)

### 5.1 Database Backup
- [ ] Otomatik backup kurulması
  - [ ] Heroku Postgres automated backups
  - [ ] AWS RDS automated backups
- [ ] Backup frequency: Günlük
- [ ] Backup retention: 30 gün
- [ ] Backup testing (restore test'i)

### 5.2 Disaster Recovery Plan
- [ ] RTO (Recovery Time Objective): < 1 saat
- [ ] RPO (Recovery Point Objective): < 1 saat
- [ ] Disaster recovery runbook oluşturma
- [ ] Failover testing

### 5.3 Code Backup
- [ ] GitHub repository backup (zaten yapılıyor)
- [ ] Regular backup verification

---

## FAZA 6: SECURITY (Gün 5)

### 6.1 Network Security
- [ ] Firewall rules kurulması
- [ ] DDoS protection (Cloudflare vb.)
- [ ] WAF (Web Application Firewall) kurulması (opsiyonel)

### 6.2 Application Security
- [ ] Environment variables'ı güvenli tutma
  - [ ] .env dosyasını .gitignore'a ekleme
  - [ ] Sensitive data'yı log'a yazmama
- [ ] Dependency vulnerability scanning
  - [ ] npm audit
  - [ ] Snyk kurulması
- [ ] Secrets management
  - [ ] AWS Secrets Manager (AWS kullanılacaksa)
  - [ ] HashiCorp Vault (opsiyonel)

### 6.3 Access Control
- [ ] SSH key'leri kurulması
- [ ] Deployment key'leri kurulması
- [ ] IAM roles kurulması (AWS)
- [ ] Multi-factor authentication (MFA) kurulması

---

## FAZA 7: AŞAMA 2 INFRASTRUCTURE (Hafta 2-3)

### 7.1 AWS Infrastructure (Aşama 2 için)
- [ ] AWS hesabı oluşturma
- [ ] VPC (Virtual Private Cloud) kurulması
- [ ] Subnets kurulması (public ve private)
- [ ] Internet Gateway kurulması
- [ ] NAT Gateway kurulması
- [ ] Security Groups kurulması
- [ ] Network ACLs kurulması

### 7.2 Compute Resources
- [ ] EC2 instances kurulması
  - [ ] Frontend instance (t3.small)
  - [ ] Backend instance (t3.medium)
  - [ ] Auto Scaling Group kurulması
- [ ] Load Balancer kurulması (Application Load Balancer)
- [ ] Target Groups kurulması

### 7.3 Database
- [ ] RDS PostgreSQL instance kurulması
  - [ ] Multi-AZ deployment
  - [ ] Automated backups
  - [ ] Enhanced monitoring
- [ ] Database parameter groups kurulması
- [ ] Database subnet groups kurulması

### 7.4 Storage
- [ ] S3 bucket'ı oluşturma (dosya depolama)
- [ ] S3 bucket policies kurulması
- [ ] CloudFront distribution kurulması (CDN)
- [ ] S3 lifecycle policies kurulması

### 7.5 Containerization (Opsiyonel)
- [ ] Docker image oluşturma
  ```dockerfile
  FROM node:16
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  EXPOSE 3001
  CMD ["npm", "start"]
  ```
- [ ] Docker Compose kurulması (local development)
- [ ] ECR (Elastic Container Registry) kurulması
- [ ] ECS (Elastic Container Service) kurulması (opsiyonel)

### 7.6 CI/CD Pipeline (Aşama 2)
- [ ] GitHub Actions workflow'u iyileştirme
  - [ ] Lint checks
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] Build
  - [ ] Deploy to staging
  - [ ] Deploy to production
- [ ] Automated testing kurulması
- [ ] Code quality checks (SonarQube vb.)
- [ ] Security scanning (OWASP ZAP vb.)

---

## FAZA 8: MONITORING VE ALERTING (Aşama 2)

### 8.1 CloudWatch (AWS)
- [ ] CloudWatch dashboards oluşturma
  - [ ] CPU usage
  - [ ] Memory usage
  - [ ] Network traffic
  - [ ] Database connections
  - [ ] API response time
  - [ ] Error rate
- [ ] CloudWatch alarms kurulması
  - [ ] High CPU alarm
  - [ ] High memory alarm
  - [ ] Database connection alarm
  - [ ] API error rate alarm
- [ ] CloudWatch logs kurulması

### 8.2 Application Performance Monitoring (APM)
- [ ] Datadog kurulması (opsiyonel)
  - [ ] Agent kurulması
  - [ ] Custom metrics
  - [ ] Distributed tracing
  - [ ] Dashboards
- [ ] New Relic kurulması (opsiyonel)
- [ ] Jaeger kurulması (opsiyonel, distributed tracing)

### 8.3 Alerting
- [ ] Alert channels kurulması
  - [ ] Email
  - [ ] SMS
  - [ ] Slack
  - [ ] PagerDuty
- [ ] Alert rules kurulması
- [ ] On-call schedule kurulması (opsiyonel)

---

## DEVAM EDEN GÖREVLER

### Günlük Görevler
- [ ] System logs kontrol etme
- [ ] Monitoring dashboards kontrol etme
- [ ] Alerts kontrol etme
- [ ] Sistem sağlığını kontrol etme

### Haftalık Görevler
- [ ] Backup verification
- [ ] Security updates kontrol etme
- [ ] Performance metrics analizi
- [ ] Capacity planning

### Aylık Görevler
- [ ] Security audit
- [ ] Disaster recovery drill
- [ ] Cost optimization
- [ ] Infrastructure review
- [ ] Dependency updates

---

## BAŞARININ ÖLÇÜLMESİ

### MVP DevOps Başarı Kriterleri
- [ ] 99% uptime
- [ ] <2 saniye yükleme süresi
- [ ] 0 deployment failures
- [ ] Otomatik backup çalışıyor
- [ ] Monitoring ve alerting aktif

### Aşama 2 DevOps Başarı Kriterleri
- [ ] 99.9% uptime
- [ ] <1 saniye yükleme süresi
- [ ] 0 deployment failures
- [ ] Auto-scaling çalışıyor
- [ ] Disaster recovery plan test edildi
- [ ] 1000+ eş zamanlı kullanıcı desteği

---

## ARAÇLAR VE KAYNAKLAR

**Cloud Platforms:**
- AWS
- Google Cloud
- Azure
- Heroku
- DigitalOcean

**Containerization:**
- Docker
- Docker Compose
- Kubernetes (opsiyonel)

**CI/CD:**
- GitHub Actions
- Jenkins
- GitLab CI
- CircleCI

**Monitoring:**
- CloudWatch (AWS)
- Datadog
- New Relic
- Prometheus
- Grafana

**Logging:**
- CloudWatch Logs
- ELK Stack
- Splunk
- Papertrail

**Alerting:**
- PagerDuty
- Opsgenie
- Slack
- Email

**Security:**
- AWS Security Hub
- Snyk
- OWASP ZAP
- Burp Suite

---

**Hazırlayan:** Manus AI  
**Tarih:** 20 Şubat 2026  
**Versiyon:** 1.0
