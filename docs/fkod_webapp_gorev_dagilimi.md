# F-KÖD Projesi: WebApp Tarafı Görev Dağılımı Raporu

## Proje Özeti

**Proje Adı:** F-Kod (Fıtrat Kodları)  
**Hedef Kitle:** 14-24 yaş gençler  
**Ana Amaç:** Gençlerin kendi fıtratlarını (doğal yeteneklerini ve kişilik özelliklerini) keşfetmelerine yardımcı olan dijital bir platform ve sivil toplum kuruluşu oluşturmak.

### Proje Yapısı

Proje üç ana sütundan oluşmaktadır:

1. **Test Algoritması ve Metodolojisi** - 10 soruluk senaryo bazlı test sistemi
2. **WebApp (İnternet Platformu)** - Gençlere ulaşmak için modern, mobil uyumlu web uygulaması
3. **Dernekleşme ve Saha Operasyonları** - Dernek kurulması ve mentorluk ağı

---

## WebApp Tarafı Teknik Mimarisi

### MVP (Minimum Uygulanabilir Ürün) Aşaması

Proje iki aşamada geliştirilecektir:

**Aşama 1 (Hızlı Çıkış - No-Code Çözüm):**
- Test Arayüzü: **Tally.so** (form tasarımı)
- Otomasyon ve Entegrasyon: **Make.com** (dijital köprü)
- Yapay Zeka Motoru: **ChatGPT/OpenAI API** (rapor yazma)
- Teslimat: Otomatik PDF raporları e-posta ile gönderme

**Aşama 2 (Tam Yazılım - Dernek Büyüdüğünde):**
- Frontend: React.js
- Backend: Node.js
- Veritabanı: Belirtilmemiş (MySQL/PostgreSQL önerilir)
- Özellikler: Üye paneli, dashboard, online eğitimler, mentor mesajlaşması

### Kullanıcı Yolculuğu (User Journey)

1. **Vitrin ve Test (Tally.so):** Genç siteye girer, 10 senaryo sorusunu 3-4 dakikada çözer
2. **Dijital Beyin (Make.com):** Cevaplar otomatik olarak işlenir, fıtrat tipi belirlenir
3. **Yapay Zeka Rapor (ChatGPT API):** Gence özel, motive edici PDF raporu yazılır
4. **Teslimat ve Davet:** PDF e-posta ile gönderilir, dernek topluluğuna katılım daveti yapılır

---

## WebApp Tarafı İçin Gerekli Roller ve Görevliler

### 1. PROJE YÖNETİCİSİ / ÜRÜN MÜDÜRÜ

**Sorumluluğu:** Tüm webapp projesinin koordinasyonu, zaman çizelgesi ve bütçe yönetimi

**Temel Görevler:**
- MVP ve Aşama 2 için detaylı proje planı hazırlama
- Tüm takım üyeleri arasında iletişim ve koordinasyon sağlama
- Zaman çizelgesi ve kilometre taşlarını takip etme
- Hata ve sorun yönetimi
- Paydaş (dernek yönetimi, kullanıcılar) ile iletişim
- Bütçe ve kaynak yönetimi

**Gerekli Beceriler:**
- Proje yönetimi (Agile/Scrum deneyimi)
- Teknik bilgi (yazılım geliştirme süreçleri hakkında temel bilgi)
- İletişim ve liderlik
- Risk yönetimi

**İş Yükü:** Tam zamanlı (Aşama 1'de 4-6 hafta, Aşama 2'de 3-4 ay)

---

### 2. ÜRÜN TASARIMCI / UX-UI TASARIMCI

**Sorumluluğu:** Webapp'ın kullanıcı arayüzü ve deneyimi tasarımı

**Temel Görevler:**

**MVP (Aşama 1) İçin:**
- Tally.so form tasarımı ve özelleştirmesi
- Mobil uyumlu, karanlık tema (dark mode) tasarım
- Kullanıcı yolculuğu (wireframe) tasarımı
- Test arayüzünün görsel kimliği (F-Kod marka renkleri, tipografi)
- E-posta şablonları tasarımı
- PDF raporu tasarım şablonu

**Aşama 2 İçin:**
- Tam web uygulaması UI/UX tasarımı
- Dashboard tasarımı (üye paneli)
- Responsive tasarım (mobil, tablet, desktop)
- Tasarım sistemi (Design System) oluşturma
- Prototyping ve user testing

**Gerekli Beceriler:**
- UI/UX tasarım (Figma, Adobe XD vb.)
- Responsive tasarım bilgisi
- Kullanıcı araştırması (user research)
- Z ve Alfa kuşağı tasarım trendleri hakkında bilgi
- Erişilebilirlik (accessibility) standartları bilgisi

**İş Yükü:** 
- MVP: 2-3 hafta (yarı zamanlı)
- Aşama 2: 4-6 hafta (tam zamanlı)

---

### 3. FRONTEND GELİŞTİRİCİ

**Sorumluluğu:** Webapp'ın ön yüz (kullanıcı tarafında görünen) kodlaması

**Temel Görevler:**

**MVP (Aşama 1) İçin:**
- Tally.so entegrasyonu (minimum kod, çoğunlukla no-code)
- E-posta şablonları HTML/CSS ile kodlama
- PDF şablonu HTML/CSS ile hazırlama
- Basit landing page tasarımı

**Aşama 2 İçin:**
- React.js ile tam web uygulaması geliştirme
- Responsive tasarımı koda dönüştürme
- API entegrasyonları (backend ile bağlantı)
- State management (Redux, Context API vb.)
- Performans optimizasyonu
- Cross-browser compatibility testi

**Gerekli Beceriler:**
- React.js (ileri seviye)
- HTML5, CSS3, JavaScript (ES6+)
- Responsive tasarım uygulaması
- API entegrasyonu
- Git/GitHub
- Testing (Jest, React Testing Library)
- Mobil uyumlu geliştirme

**İş Yükü:**
- MVP: 1-2 hafta (hafif)
- Aşama 2: 6-8 hafta (tam zamanlı)

---

### 4. BACKEND GELİŞTİRİCİ

**Sorumluluğu:** Webapp'ın arka yüz (sunucu tarafında) kodlaması ve veri yönetimi

**Temel Görevler:**

**MVP (Aşama 1) İçin:**
- Make.com otomasyonu kurulumu ve yapılandırması
- ChatGPT API entegrasyonu
- E-posta gönderme sistemi (SMTP setup)
- Temel veri depolama (gençlerin e-posta adresleri vb.)
- Hata yönetimi ve logging

**Aşama 2 İçin:**
- Node.js ile REST API geliştirme
- Veritabanı tasarımı ve yönetimi (MySQL/PostgreSQL)
- Kullanıcı kimlik doğrulama (authentication) sistemi
- Veri güvenliği (encryption, HTTPS vb.)
- Mentorluğu yönetme API'leri
- Mesajlaşma sistemi
- Eğitim içeriği yönetimi API'leri
- Performans optimizasyonu
- Backup ve disaster recovery

**Gerekli Beceriler:**
- Node.js (ileri seviye)
- Express.js veya benzer framework
- Veritabanı tasarımı (SQL)
- RESTful API tasarımı
- Kimlik doğrulama (JWT, OAuth)
- Veri güvenliği
- Git/GitHub
- API testing (Postman, Jest)
- Cloud deployment (AWS, Heroku, DigitalOcean vb.)

**İş Yükü:**
- MVP: 2-3 hafta
- Aşama 2: 8-10 hafta (tam zamanlı)

---

### 5. YAPAY ZEKA / PROMPT MÜHENDİSİ

**Sorumluluğu:** ChatGPT'nin gençlere yazacağı raporların kalitesi ve uygunluğu

**Temel Görevler:**
- ChatGPT'ye verilecek "Prompt" (talimat/komut) yazma ve optimize etme
- Gençlere özel, motive edici rapor metinleri tasarımı
- 12 F-Kod arketipi için her biri için farklı prompt varyasyonları
- Raporların psikolojik uygunluğu ve etkililik testi
- ChatGPT çıktılarının kalite kontrol ve iyileştirilmesi
- A/B testing (farklı promptların etkinliğini karşılaştırma)

**Gerekli Beceriler:**
- OpenAI API kullanımı
- Prompt engineering
- Psikoloji ve motivasyon bilgisi
- Yazılı iletişim
- Z ve Alfa kuşağı psikolojisi hakkında bilgi
- Veri analizi (çıktı kalitesi ölçümü)

**İş Yükü:**
- MVP: 1-2 hafta
- Aşama 2: Devam eden iyileştirmeler (hafta başına 5-10 saat)

---

### 6. VERİ TABANCILAR / VERİ ANALISTI

**Sorumluluğu:** Gençlerin test cevaplarının toplanması, analizi ve raporlanması

**Temel Görevler:**

**MVP (Aşama 1) İçin:**
- Tally.so'dan gelen verilerin yönetimi
- Temel veri analizi (hangi arketipler daha popüler, vb.)
- Veri kalitesi kontrol
- Raporlama ve istatistik

**Aşama 2 İçin:**
- Veritabanı tasarımı ve optimizasyonu
- Veri güvenliği ve GDPR uyumluluğu
- Analitik dashboard'u geliştirme
- Kullanıcı davranış analizi
- Dernek için raporlama (hangi gençler hangi mentorlarla eşleştirilmeli, vb.)

**Gerekli Beceriler:**
- SQL (ileri seviye)
- Veri analizi (Python, R vb.)
- Veri görselleştirme (Tableau, Power BI vb.)
- İstatistik
- GDPR ve veri gizliliği
- Veritabanı yönetimi

**İş Yükü:**
- MVP: 1 hafta
- Aşama 2: 3-4 hafta (tam zamanlı)

---

### 7. QA / TEST UZMANI

**Sorumluluğu:** Webapp'ın kalitesi ve hata kontrolü

**Temel Görevler:**

**MVP (Aşama 1) İçin:**
- Tally.so form testleri
- Make.com otomasyonu testleri
- E-posta gönderme testleri
- PDF oluşturma testleri
- Mobil cihazlarda test
- Tarayıcı uyumluluğu testi

**Aşama 2 İçin:**
- Fonksiyonel test (unit test, integration test)
- Kullanıcı kabul testi (UAT)
- Performans testi
- Güvenlik testi
- Erişilebilirlik testi
- Regresyon testi

**Gerekli Beceriler:**
- Manuel test
- Otomatik test (Selenium, Jest vb.)
- Test case yazma
- Hata raporlama
- Performans testi
- Güvenlik testi temelleri

**İş Yükü:**
- MVP: 1-2 hafta
- Aşama 2: 3-4 hafta

---

### 8. DEVOPS / SISTEM YÖNETICISI

**Sorumluluğu:** Webapp'ın barındırılması, dağıtımı ve sistem yönetimi

**Temel Görevler:**

**MVP (Aşama 1) İçin:**
- Tally.so hosting (zaten sağlanmış)
- Make.com kurulumu
- E-posta servisi kurulumu (SendGrid, Mailgun vb.)
- Temel güvenlik ayarları

**Aşama 2 İçin:**
- Cloud infrastructure kurulumu (AWS, Azure, DigitalOcean vb.)
- CI/CD pipeline kurulması (GitHub Actions, Jenkins vb.)
- Veritabanı barındırması ve yönetimi
- SSL/HTTPS sertifikaları
- Backup ve disaster recovery
- Monitoring ve alerting
- Scaling ve performans optimizasyonu
- Güvenlik güncellemeleri

**Gerekli Beceriler:**
- Cloud platforms (AWS, Azure vb.)
- Docker ve containerization
- Linux sistem yönetimi
- CI/CD tools
- Monitoring tools (Datadog, New Relic vb.)
- Güvenlik en iyi uygulamaları

**İş Yükü:**
- MVP: 1 hafta (kurulum)
- Aşama 2: 2-3 hafta (kurulum) + devam eden yönetim (hafta başına 10-15 saat)

---

### 9. ÜRÜN YAZARI / TEKNIK YAZAR

**Sorumluluğu:** Webapp'ın kullanıcı belgeleri, rehberleri ve içeriği

**Temel Görevler:**
- Kullanıcı kılavuzları yazma
- FAQ (Sık Sorulan Sorular) hazırlama
- Onboarding içeriği (yeni kullanıcılar için rehber)
- API belgeleri (Aşama 2 için)
- Teknik belgelendirme
- İçerik yönetimi sistemi (CMS) için metinler

**Gerekli Beceriler:**
- Teknik yazarlık
- Kullanıcı odaklı yazma
- Z ve Alfa kuşağı iletişim tarzı
- Markdown, HTML bilgisi
- Dokümantasyon araçları (Confluence, GitBook vb.)

**İş Yükü:**
- MVP: 1 hafta
- Aşama 2: 2-3 hafta

---

### 10. SEO / DIJITAL PAZARLAMA UZMANLIĞI (İsteğe Bağlı)

**Sorumluluğu:** Webapp'ın arama motorlarında görünürlüğü ve gençlere ulaşması

**Temel Görevler:**
- SEO optimizasyonu
- Sosyal medya stratejisi
- İçerik pazarlaması
- Kullanıcı kazanım stratejisi
- Analytics ve raporlama

**Gerekli Beceriler:**
- SEO
- Sosyal medya pazarlaması
- Google Analytics
- İçerik pazarlaması
- Z ve Alfa kuşağı pazarlaması

**İş Yükü:**
- MVP: 1-2 hafta
- Aşama 2: Devam eden (hafta başına 10-15 saat)

---

## Önerilen Takım Yapısı

### MVP (Aşama 1) - Hızlı Çıkış (4-6 hafta)

| Rol | Sayı | Tam/Yarı Zaman | Toplam İş Saati |
|-----|------|-----------------|-----------------|
| Proje Yöneticisi | 1 | Tam | 160-240 saat |
| UX/UI Tasarımcı | 1 | Yarı | 80-120 saat |
| Frontend Geliştirici | 1 | Yarı | 40-80 saat |
| Backend Geliştirici | 1 | Tam | 160-240 saat |
| Prompt Mühendisi | 1 | Yarı | 40-80 saat |
| QA Uzmanı | 1 | Yarı | 40-80 saat |
| DevOps/Sistem Yöneticisi | 1 | Yarı | 40 saat |
| **Toplam** | **7 kişi** | - | **600-920 saat** |

**Tahmini Maliyet:** 15,000 - 30,000 TL (freelancer fiyatlarıyla)

### Aşama 2 - Tam Yazılım (3-4 ay)

| Rol | Sayı | Tam/Yarı Zaman |
|-----|------|-----------------|
| Proje Yöneticisi | 1 | Tam |
| UX/UI Tasarımcı | 1 | Tam |
| Frontend Geliştirici | 2 | Tam |
| Backend Geliştirici | 2 | Tam |
| Prompt Mühendisi | 1 | Yarı |
| Veri Analisti | 1 | Tam |
| QA Uzmanı | 1 | Tam |
| DevOps/Sistem Yöneticisi | 1 | Tam |
| Teknik Yazar | 1 | Yarı |
| **Toplam** | **11 kişi** | - |

**Tahmini Maliyet:** 150,000 - 300,000 TL (3-4 ay)

---

## Kritik Başarı Faktörleri

### MVP Aşaması İçin:

1. **Hız ve Basitlik:** No-code araçlar kullanarak 4-6 haftada piyasaya çıkmak
2. **Kullanıcı Deneyimi:** Gençlerin 3-4 dakikada testi tamamlaması ve sonuç alması
3. **Yapay Zeka Kalitesi:** ChatGPT raporlarının kişiselleştirilmiş ve motive edici olması
4. **Veri Toplama:** Gençlerin e-posta adresleri toplanarak dernek topluluğu oluşturulması

### Aşama 2 İçin:

1. **Ölçeklenebilirlik:** Binlerce eş zamanlı kullanıcıyı desteklemek
2. **Güvenlik:** Gençlerin kişisel verilerinin korunması (GDPR uyumluluğu)
3. **Mentorluk Sistemi:** Gençleri uygun mentorlarla eşleştirme algoritması
4. **Topluluk Yönetimi:** Dernek üyeleri arasında etkileşim ve katılım

---

## Zaman Çizelgesi Önerisi

### MVP (Aşama 1)

| Hafta | Görevler |
|-------|---------|
| 1 | Proje kurulumu, tasarım başlangıcı, backend altyapısı |
| 2 | Tally.so form tasarımı ve kurulumu, Make.com otomasyonu |
| 3 | ChatGPT entegrasyonu, frontend geliştirme, testing |
| 4 | Tamamlama, bug fixing, deployment hazırlığı |
| 5-6 | Soft launch, feedback toplama, iyileştirmeler |

### Aşama 2

| Ay | Görevler |
|----|---------|
| 1 | Tasarım ve mimarı finalizasyon, veritabanı tasarımı |
| 2 | Frontend ve backend geliştirme (1. sprint) |
| 3 | Geliştirme devamı (2. sprint), testing |
| 4 | Finalizasyon, deployment, soft launch |

---

## İletişim ve Koordinasyon

### Günlük Standup Toplantıları
- **Saat:** Günde 15 dakika (sabah 10:00)
- **Katılımcılar:** Tüm takım üyeleri
- **Gündem:** Yapılanlar, yapılacaklar, engeller

### Haftalık Planlama Toplantıları
- **Saat:** Pazartesi sabahı 1 saat
- **Katılımcılar:** Proje Yöneticisi, Teknik Lider (Backend), UX/UI Tasarımcı
- **Gündem:** Haftalık hedefler, risk yönetimi, bütçe

### Sprint Reviews (Aşama 2 için)
- **Sıklık:** Her 2 hafta
- **Katılımcılar:** Tüm takım + proje sahibi
- **Gündem:** Tamamlanan görevler, demo, feedback

### Dokümantasyon ve Bilgi Paylaşımı
- **Platform:** GitHub (kod), Notion (dokümantasyon), Slack (iletişim)
- **Wiki:** Teknik belgelendirme ve best practices

---

## Risk Yönetimi

| Risk | Olasılık | Etki | Azaltma Stratejisi |
|------|----------|------|-------------------|
| ChatGPT API maliyeti yüksek | Orta | Orta | Rate limiting, caching kullanma |
| Tally.so sınırlamaları | Düşük | Düşük | Alternatif form araçları hazırda tutma |
| Veri güvenliği sorunları | Düşük | Yüksek | GDPR uyumluluğu, şifreli depolama |
| Proje gecikmesi | Orta | Orta | Agile metodoloji, buffer zaman |
| Yetenek bulma zorlukları | Orta | Yüksek | Erken işe alım, freelancer ağı |

---

## Sonuç ve Öneriler

F-Kod projesinin webapp tarafı başarılı olması için:

1. **MVP'ye odaklanın:** Mükemmeliyetçiliğe düşmeden 4-6 haftada piyasaya çıkın
2. **Doğru takımı kurun:** En az 7 kişilik bir çekirdek takım gerekli
3. **No-code araçlardan başlayın:** Make.com, Tally.so gibi araçlar hızlı ilerleme sağlar
4. **Gençlere odaklanın:** Tasarım, içerik ve pazarlama kararlarında hedef kitleyi ön planda tutun
5. **Veri güvenliğine önem verin:** GDPR uyumluluğu ve gençlerin gizliliği kritik
6. **Topluluk oluşturmaya başlayın:** Webapp sadece bir araç, asıl değer dernek topluluğunda

---

**Rapor Tarihi:** 20 Şubat 2026  
**Hazırlayan:** Manus AI Agent
