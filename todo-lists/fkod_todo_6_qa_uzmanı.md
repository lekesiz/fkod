# F-KOD WEBAPP PROJESİ - QA UZMANLIĞI TODO LİSTESİ

## 📋 Rol Özeti
**Rol:** QA (Kalite Güvence) Uzmanı  
**Sorumluluğu:** Webapp'ın kalitesi ve hata kontrolü  
**Zaman Çizelgesi:** MVP 1-2 hafta, Aşama 2: 3-4 hafta  
**Çalışma Modeli:** Yarı zamanlı (MVP), Tam zamanlı (Aşama 2)

---

## FAZA 1: HAZIRLIK VE PLANLAMA (Gün 1)

### 1.1 Proje Briefing
- [ ] Proje yöneticisiyle ilk toplantı yapma
- [ ] F-Kod projesinin hedeflerini anlamak
- [ ] Teknik mimarisi anlamak
- [ ] Test planını oluşturmak
- [ ] Proje belgelendirmesini okuma

### 1.2 Test Ortamı Kurulması
- [ ] Test cihazları hazırlama
  - [ ] Windows PC
  - [ ] Mac (opsiyonel)
  - [ ] iPhone (iOS)
  - [ ] Android telefon
  - [ ] iPad/Tablet
- [ ] Tarayıcılar kurulması
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)
- [ ] Testing tools kurulması
  - [ ] Chrome DevTools
  - [ ] Responsively App
  - [ ] BrowserStack (opsiyonel)
  - [ ] Lighthouse
  - [ ] axe DevTools

### 1.3 Test Case Şablonu Oluşturma
- [ ] Test case template'i hazırlama
  ```
  Test ID: TC-001
  Test Name: Landing Page Yüklenme
  Preconditions: Tarayıcı açık, internet bağlantısı var
  Steps:
    1. fkod.org sitesine git
    2. Sayfanın yüklenmesini bekle
  Expected Result: Sayfa 2 saniye içinde yüklensin
  Actual Result: [Test sırasında doldurulacak]
  Status: Pass/Fail
  ```
- [ ] Test case management tool seçme (TestRail, Zephyr vb.)

---

## FAZA 2: MVP TEST PLANI (Gün 1-2)

### 2.1 Test Scope Tanımlama
- [ ] Fonksiyonel testler
  - [ ] Landing page
  - [ ] Test sayfası
  - [ ] Sonuç sayfası
  - [ ] E-posta gönderme
  - [ ] PDF oluşturma
- [ ] Non-fonksiyonel testler
  - [ ] Performance
  - [ ] Security
  - [ ] Accessibility
  - [ ] Usability
- [ ] Entegrasyon testleri
  - [ ] Tally.so entegrasyonu
  - [ ] Make.com entegrasyonu
  - [ ] ChatGPT entegrasyonu
  - [ ] E-posta servisi entegrasyonu

### 2.2 Test Case'leri Yazma
- [ ] Landing Page Test Cases
  - [ ] TC-001: Landing page yüklenme
  - [ ] TC-002: Hero section gösterimi
  - [ ] TC-003: CTA butonu tıklanması
  - [ ] TC-004: Responsive tasarım (mobil)
  - [ ] TC-005: Responsive tasarım (tablet)
  - [ ] TC-006: Responsive tasarım (desktop)
  - [ ] TC-007: Footer linkleri
  - [ ] TC-008: Sosyal medya linkleri

- [ ] Test Sayfası Test Cases
  - [ ] TC-101: Test sayfası yüklenme
  - [ ] TC-102: Soru gösterimi
  - [ ] TC-103: Cevap seçimi (A)
  - [ ] TC-104: Cevap seçimi (B)
  - [ ] TC-105: Cevap seçimi (C)
  - [ ] TC-106: Cevap seçimi (D)
  - [ ] TC-107: Sonraki soru butonuna tıklama
  - [ ] TC-108: Önceki soru butonuna tıklama
  - [ ] TC-109: İlerleme göstergesi güncelleme
  - [ ] TC-110: Tüm soruları cevaplama
  - [ ] TC-111: Test iptal etme
  - [ ] TC-112: Responsive tasarım (mobil)
  - [ ] TC-113: Dokunmatik ekran navigasyonu

- [ ] Sonuç Sayfası Test Cases
  - [ ] TC-201: Sonuç sayfası yüklenme
  - [ ] TC-202: Teşekkür mesajı gösterimi
  - [ ] TC-203: E-posta input alanı
  - [ ] TC-204: Geçersiz e-posta girmesi (hata mesajı)
  - [ ] TC-205: Geçerli e-posta girmesi
  - [ ] TC-206: Gönder butonu tıklanması
  - [ ] TC-207: Yükleme göstergesi
  - [ ] TC-208: Başarı mesajı
  - [ ] TC-209: Sosyal medya paylaşım butonları

- [ ] API Entegrasyon Test Cases
  - [ ] TC-301: Test cevaplarının gönderilmesi
  - [ ] TC-302: Fıtrat tipinin hesaplanması
  - [ ] TC-303: ChatGPT rapor oluşturma
  - [ ] TC-304: PDF oluşturma
  - [ ] TC-305: E-posta gönderme
  - [ ] TC-306: Hata yönetimi

---

## FAZA 3: MANUEL TESTING (Gün 2-4)

### 3.1 Fonksiyonel Testing
- [ ] Landing Page Testleri
  - [ ] TC-001 ile TC-008 çalıştırma
  - [ ] Tüm elementlerin görüldüğünü kontrol etme
  - [ ] Tüm linklerin çalıştığını kontrol etme
  - [ ] Tüm butonların çalıştığını kontrol etme
  - [ ] Hataları kaydetme

- [ ] Test Sayfası Testleri
  - [ ] TC-101 ile TC-113 çalıştırma
  - [ ] Tüm soruların göründüğünü kontrol etme
  - [ ] Tüm cevap seçeneklerinin çalıştığını kontrol etme
  - [ ] İlerleme göstergesi güncellenmesini kontrol etme
  - [ ] Navigation butonlarının çalıştığını kontrol etme
  - [ ] Hataları kaydetme

- [ ] Sonuç Sayfası Testleri
  - [ ] TC-201 ile TC-209 çalıştırma
  - [ ] Form validasyonunu kontrol etme
  - [ ] E-posta gönderimini kontrol etme
  - [ ] Hataları kaydetme

### 3.2 Responsive Design Testing
- [ ] Mobil Cihazlar (< 480px)
  - [ ] iPhone 12 (390x844)
  - [ ] iPhone SE (375x667)
  - [ ] Samsung Galaxy S21 (360x800)
  - [ ] Tüm elementlerin görüldüğünü kontrol etme
  - [ ] Metin okunabilirliğini kontrol etme
  - [ ] Butonların tıklanabilir olduğunu kontrol etme

- [ ] Tablet Cihazlar (480px - 768px)
  - [ ] iPad Mini (768x1024)
  - [ ] Samsung Galaxy Tab (600x960)
  - [ ] Layout'un düzgün olduğunu kontrol etme

- [ ] Desktop (> 768px)
  - [ ] 1920x1080
  - [ ] 1366x768
  - [ ] 2560x1440
  - [ ] Layout'un düzgün olduğunu kontrol etme

### 3.3 Tarayıcı Uyumluluğu Testing
- [ ] Chrome
  - [ ] Latest version
  - [ ] Tüm test case'leri çalıştırma
- [ ] Firefox
  - [ ] Latest version
  - [ ] Tüm test case'leri çalıştırma
- [ ] Safari
  - [ ] Latest version
  - [ ] Tüm test case'leri çalıştırma
- [ ] Edge
  - [ ] Latest version
  - [ ] Tüm test case'leri çalıştırma

### 3.4 Hata Raporlama
- [ ] Hata raporu şablonu
  ```
  Bug ID: BUG-001
  Title: Landing page yüklenmeme
  Severity: Critical
  Priority: High
  Environment: Chrome 120, Windows 10
  Steps to Reproduce:
    1. fkod.org sitesine git
    2. Sayfanın yüklenmesini bekle
  Expected Result: Sayfa 2 saniye içinde yüklensin
  Actual Result: Sayfa 10 saniye sonra yükleniyor
  Attachment: [Screenshot]
  ```
- [ ] Hata tracking sistemi (Jira, GitHub Issues vb.)
- [ ] Hataları öncelik sırası ile raporlama
  - [ ] Critical: Sistem çalışmıyor
  - [ ] High: Önemli fonksiyon çalışmıyor
  - [ ] Medium: Fonksiyon kısmen çalışıyor
  - [ ] Low: Küçük UI sorunları

---

## FAZA 4: PERFORMANCE TESTING (Gün 4)

### 4.1 Yükleme Süresi Testleri
- [ ] Landing page yükleme süresi
  - [ ] Hedef: < 2 saniye
  - [ ] Lighthouse ile test
  - [ ] WebPageTest ile test
- [ ] Test sayfası yükleme süresi
  - [ ] Hedef: < 1 saniye
- [ ] Sonuç sayfası yükleme süresi
  - [ ] Hedef: < 1 saniye

### 4.2 Lighthouse Audit
- [ ] Performance score
  - [ ] Hedef: > 90
- [ ] Accessibility score
  - [ ] Hedef: > 95
- [ ] Best Practices score
  - [ ] Hedef: > 90
- [ ] SEO score
  - [ ] Hedef: > 90
- [ ] Önerileri uygulamak

### 4.3 Network Testing
- [ ] Slow 3G hızında test
  - [ ] Sayfaların yüklenip yüklenmediğini kontrol etme
- [ ] Fast 3G hızında test
- [ ] 4G hızında test
- [ ] WiFi hızında test

---

## FAZA 5: SECURITY TESTING (Gün 4-5)

### 5.1 OWASP Top 10 Testleri
- [ ] SQL Injection
  - [ ] E-posta alanına SQL injection test etme
  - [ ] Veritabanı korunup korunmadığını kontrol etme
- [ ] Cross-Site Scripting (XSS)
  - [ ] E-posta alanına script girmesi
  - [ ] Script çalışıp çalışmadığını kontrol etme
- [ ] CSRF (Cross-Site Request Forgery)
  - [ ] CSRF token'ın olup olmadığını kontrol etme
- [ ] Sensitive Data Exposure
  - [ ] Şifrelerin şifrelenip şifrelenmediğini kontrol etme
  - [ ] HTTPS kullanılıp kullanılmadığını kontrol etme
- [ ] Broken Authentication
  - [ ] Session management'ı kontrol etme

### 5.2 SSL/HTTPS Testing
- [ ] HTTPS protokolünün kullanılıp kullanılmadığını kontrol etme
- [ ] SSL sertifikasının geçerli olup olmadığını kontrol etme
- [ ] Mixed content (HTTP + HTTPS) olup olmadığını kontrol etme

### 5.3 API Security Testing
- [ ] API endpoint'lerinin korunup korunmadığını kontrol etme
- [ ] Authentication'ın gerekli olup olmadığını kontrol etme
- [ ] Rate limiting'in olup olmadığını kontrol etme

---

## FAZA 6: ACCESSIBILITY TESTING (Gün 5)

### 6.1 WCAG 2.1 Compliance
- [ ] Color Contrast
  - [ ] Metin ve arka plan kontrastı
  - [ ] Hedef: AA seviyesi (4.5:1)
  - [ ] axe DevTools ile test
- [ ] Keyboard Navigation
  - [ ] Tab tuşu ile navigasyon
  - [ ] Enter tuşu ile buton tıklanması
  - [ ] Escape tuşu ile modal kapatılması
- [ ] Screen Reader Compatibility
  - [ ] NVDA (Windows)
  - [ ] JAWS (Windows)
  - [ ] VoiceOver (Mac/iOS)
- [ ] Form Labels
  - [ ] Tüm form alanlarının label'ı olup olmadığını kontrol etme
  - [ ] Label'ların doğru şekilde bağlı olup olmadığını kontrol etme
- [ ] Heading Hierarchy
  - [ ] H1, H2, H3 vb. doğru sırada olup olmadığını kontrol etme
- [ ] Alt Text for Images
  - [ ] Tüm resimlerin alt text'i olup olmadığını kontrol etme

### 6.2 Accessibility Audit
- [ ] axe DevTools ile audit
- [ ] WAVE ile audit
- [ ] Lighthouse accessibility score
- [ ] Önerileri uygulamak

---

## FAZA 7: AŞAMA 2 TESTING (Hafta 3+)

### 7.1 Aşama 2 Test Scope
- [ ] Giriş/Kayıt sayfaları
- [ ] Dashboard
- [ ] Profil sayfası
- [ ] Mentor eşleştirme
- [ ] Online eğitimler
- [ ] Mesajlaşma
- [ ] Topluluk
- [ ] Ayarlar
- [ ] Admin paneli

### 7.2 Otomatik Testing
- [ ] Jest kurulması
- [ ] React Testing Library kurulması
- [ ] Unit test'leri yazma
  - [ ] Component test'leri
  - [ ] Utility function test'leri
- [ ] Integration test'leri yazma
  - [ ] API entegrasyon test'leri
  - [ ] Component entegrasyon test'leri
- [ ] E2E test'leri yazma (Cypress)
  - [ ] Kullanıcı akışı test'leri
  - [ ] Form submission test'leri

### 7.3 Regression Testing
- [ ] Önceki test case'leri tekrar çalıştırma
- [ ] Yeni değişikliklerin eski fonksiyonları kırmadığını kontrol etme
- [ ] Regression test suite'i oluşturma

---

## DEVAM EDEN GÖREVLER

### Günlük Görevler
- [ ] Test case'leri çalıştırma
- [ ] Hataları raporlama
- [ ] Hata düzeltmelerini doğrulama
- [ ] Test sonuçlarını dokümante etme

### Haftalık Görevler
- [ ] Proje yöneticisiyle test raporu
- [ ] Hata analizi
- [ ] Test coverage analizi
- [ ] Risk değerlendirmesi

### Aylık Görevler
- [ ] Test metriklerini analiz etme
- [ ] Test stratejisini iyileştirme
- [ ] Automation coverage artırma
- [ ] Performance baseline oluşturma

---

## BAŞARININ ÖLÇÜLMESİ

### MVP QA Başarı Kriterleri
- [ ] 0 Critical bugs
- [ ] <5 High priority bugs
- [ ] %100 test case pass rate
- [ ] >90 Lighthouse score
- [ ] >95 Accessibility score
- [ ] <2 saniye yükleme süresi

### Aşama 2 QA Başarı Kriterleri
- [ ] 0 Critical bugs
- [ ] <3 High priority bugs
- [ ] %99 test case pass rate
- [ ] >95 Lighthouse score
- [ ] >98 Accessibility score
- [ ] >80% code coverage

---

## ARAÇLAR VE KAYNAKLAR

**Testing Tools:**
- Chrome DevTools
- Lighthouse
- axe DevTools
- WAVE
- Responsively App
- BrowserStack

**Test Management:**
- TestRail
- Zephyr
- Jira

**Automation:**
- Jest
- React Testing Library
- Cypress
- Selenium

**Performance:**
- WebPageTest
- GTmetrix
- Lighthouse

**Security:**
- OWASP ZAP
- Burp Suite Community

---

**Hazırlayan:** Manus AI  
**Tarih:** 20 Şubat 2026  
**Versiyon:** 1.0
