# F-KÖD WEBAPP PROJESİ - FRONTEND GELİŞTİRİCİ TODO LİSTESİ

## 📋 Rol Özeti
**Rol:** Frontend Geliştirici  
**Sorumluluğu:** Webapp'ın ön yüz (kullanıcı tarafında görünen) kodlaması  
**Zaman Çizelgesi:** MVP 1-2 hafta, Aşama 2: 6-8 hafta  
**Çalışma Modeli:** Yarı zamanlı (MVP), Tam zamanlı (Aşama 2)

---

## FAZA 1: ORTAM KURULUMU (Gün 1-2)

### 1.1 Geliştirme Ortamı
- [ ] Node.js ve npm kurulumu (v16+)
- [ ] Git kurulumu ve konfigürasyonu
- [ ] Kod editörü seçme (VS Code önerilir)
- [ ] VS Code extensions kurulması
  - [ ] ES7+ React/Redux/React-Native snippets
  - [ ] Prettier - Code formatter
  - [ ] ESLint
  - [ ] Thunder Client veya Postman
  - [ ] Git Graph
- [ ] GitHub repository'yi clone etme

### 1.2 Proje Kurulması
- [ ] React uygulaması oluşturma (Create React App veya Vite)
  ```bash
  npx create-react-app fkod-webapp
  # veya
  npm create vite@latest fkod-webapp -- --template react
  ```
- [ ] Temel proje yapısını oluşturma
  ```
  src/
    components/
    pages/
    styles/
    utils/
    hooks/
    context/
    assets/
  ```
- [ ] package.json bağımlılıklarını kurma
  - [ ] React Router (v6)
  - [ ] Axios (API calls)
  - [ ] Tailwind CSS veya Styled Components
  - [ ] React Query (veri yönetimi)
  - [ ] Formik + Yup (form validasyonu)

### 1.3 Konfigürasyon
- [ ] .env dosyası oluşturma
  ```
  REACT_APP_API_URL=http://localhost:3001
  REACT_APP_CHATGPT_API_KEY=...
  ```
- [ ] ESLint ve Prettier konfigürasyonu
- [ ] Git pre-commit hooks (Husky)
- [ ] Build configuration

---

## FAZA 2: MVP FRONTEND - LANDING PAGE (Gün 2-3)

### 2.1 Layout Bileşenleri
- [ ] Header bileşeni
  - [ ] Logo
  - [ ] Navigation menu
  - [ ] Mobile hamburger menu
  - [ ] Responsive tasarım
- [ ] Footer bileşeni
  - [ ] Sosyal medya linkleri
  - [ ] İletişim bilgileri
  - [ ] Copyright
- [ ] Container/Wrapper bileşenleri

### 2.2 Landing Page Sayfası
- [ ] Hero section
  - [ ] Banner görseli
  - [ ] Başlık ve açıklama
  - [ ] CTA butonu
- [ ] Özellikler bölümü
  - [ ] Özellik kartları
  - [ ] İkonlar
  - [ ] Açıklamalar
- [ ] Testimonials bölümü
  - [ ] Testimonial kartları
  - [ ] Yıldız rating
  - [ ] Carousel/Slider (opsiyonel)
- [ ] FAQ bölümü
  - [ ] Accordion bileşeni
  - [ ] Soru-cevap çiftleri
- [ ] CTA bölümü (Test başlangıç)

### 2.3 Stil ve Tasarım
- [ ] Tailwind CSS kurulması ve konfigürasyonu
- [ ] Global stilleri oluşturma
- [ ] Renk paletini tanımlama
- [ ] Responsive breakpoints kurulması
- [ ] Animasyonlar (smooth scroll, fade-in vb.)

---

## FAZA 3: MVP FRONTEND - TEST SAYFASI (Gün 3-5)

### 3.1 Test Sayfası Bileşenleri
- [ ] Soru gösterimi bileşeni
  - [ ] Soru metni
  - [ ] Soru numarası
  - [ ] Soru kategorisi (opsiyonel)
- [ ] Cevap seçenekleri bileşeni
  - [ ] Radio button seçenekleri (A, B, C, D)
  - [ ] Hover efektleri
  - [ ] Seçim animasyonları
  - [ ] Disabled state
- [ ] İlerleme göstergesi
  - [ ] Progress bar
  - [ ] Soru sayacı (X / 10)
  - [ ] Yüzde gösterimi
- [ ] Navigation butonları
  - [ ] Önceki soru butonu
  - [ ] Sonraki soru butonu
  - [ ] Testi tamamla butonu
  - [ ] Testi iptal et butonu

### 3.2 Test Mantığı
- [ ] State management (React Context veya Redux)
  - [ ] Mevcut soru state'i
  - [ ] Cevaplar state'i
  - [ ] İlerleme state'i
- [ ] Soru navigasyonu
  - [ ] Sonraki soruya geçme
  - [ ] Önceki soruya dönme
  - [ ] Belirli bir soruya atlamak (opsiyonel)
- [ ] Cevap depolama
  - [ ] Cevapları state'e kaydetme
  - [ ] Cevapları localStorage'a kaydetme (tarayıcı kapanırsa)
- [ ] Test tamamlama
  - [ ] Tüm soruların cevaplanıp cevaplanmadığını kontrol etme
  - [ ] Cevapları backend'e gönderme

### 3.3 Responsive Tasarım
- [ ] Mobil cihazlarda test (< 480px)
- [ ] Tablet cihazlarda test (480px - 768px)
- [ ] Desktop cihazlarda test (> 768px)
- [ ] Dokunmatik ekran optimizasyonu
- [ ] Keyboard navigasyonu

---

## FAZA 4: MVP FRONTEND - SONUÇ SAYFASI (Gün 5)

### 4.1 Sonuç Sayfası Bileşenleri
- [ ] Teşekkür mesajı
- [ ] E-posta giriş formu
  - [ ] E-posta input alanı
  - [ ] Validasyon
  - [ ] Hata mesajları
  - [ ] Gönder butonu
- [ ] Yükleme göstergesi (loading spinner)
- [ ] Başarı mesajı
- [ ] Hata mesajı
- [ ] Sosyal medya paylaşım butonları (opsiyonel)

### 4.2 Form Yönetimi
- [ ] Formik kurulması
- [ ] E-posta validasyonu (Yup)
- [ ] Form submission
  - [ ] Backend'e POST isteği
  - [ ] Loading state
  - [ ] Success/Error handling
- [ ] Hata mesajlarının gösterilmesi

---

## FAZA 5: API ENTEGRASYONU (Gün 5-6)

### 5.1 Backend API Entegrasyonu
- [ ] API endpoint'lerini tanımlama
  - [ ] POST /api/test/submit (test cevaplarını gönderme)
  - [ ] POST /api/email/subscribe (e-posta aboneliği)
  - [ ] GET /api/questions (soruları alma)
- [ ] Axios instance oluşturma
  - [ ] Base URL
  - [ ] Default headers
  - [ ] Interceptors (error handling)
- [ ] API çağrılarını yapma
  - [ ] Test cevaplarını gönderme
  - [ ] E-posta adresini gönderme
  - [ ] Hata yönetimi

### 5.2 Veri Yönetimi
- [ ] React Query kurulması (opsiyonel)
- [ ] API response'larını handle etme
- [ ] Loading state'leri
- [ ] Error state'leri
- [ ] Success state'leri

---

## FAZA 6: TESTING VE OPTIMIZASYON (Gün 6-7)

### 6.1 Manual Testing
- [ ] Tüm sayfaları test etme
- [ ] Tüm butonları test etme
- [ ] Form validasyonunu test etme
- [ ] Responsive tasarımı test etme
  - [ ] iPhone (375px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)
- [ ] Tarayıcı uyumluluğu
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Hız testleri (Lighthouse)
- [ ] Erişilebilirlik testleri (axe DevTools)

### 6.2 Performans Optimizasyonu
- [ ] Kod splitting (lazy loading)
- [ ] Image optimization
- [ ] CSS minification
- [ ] JavaScript minification
- [ ] Bundle size analizi
- [ ] Caching stratejisi

### 6.3 SEO Optimizasyonu
- [ ] Meta tags
  - [ ] Title
  - [ ] Description
  - [ ] Keywords
  - [ ] Open Graph tags
- [ ] Semantic HTML
- [ ] Heading hierarchy
- [ ] Alt text for images

---

## FAZA 7: AŞAMA 2 FRONTEND (Hafta 3+)

### 7.1 Giriş/Kayıt Sayfaları
- [ ] Login sayfası
  - [ ] E-posta input
  - [ ] Şifre input
  - [ ] "Şifremi Unuttum" linki
  - [ ] Login butonu
  - [ ] Kayıt linki
- [ ] Sign Up sayfası
  - [ ] Ad input
  - [ ] E-posta input
  - [ ] Şifre input
  - [ ] Şifre tekrar input
  - [ ] Koşulları kabul checkbox
  - [ ] Kayıt butonu
- [ ] Şifre sıfırlama sayfası
- [ ] E-posta doğrulama sayfası

### 7.2 Dashboard/Ana Sayfa
- [ ] Sidebar navigation
- [ ] User profile widget
- [ ] Dashboard cards
  - [ ] Fıtrat tipi kartı
  - [ ] Mentor eşleştirme kartı
  - [ ] Online eğitimler kartı
  - [ ] Topluluk aktivitesi kartı
- [ ] Quick actions
- [ ] Recent activity

### 7.3 Profil Sayfası
- [ ] Profil bilgileri
- [ ] Profil fotoğrafı yükleme
- [ ] Fıtrat bilgileri
- [ ] Başarılar/Rozetler
- [ ] Ayarlar

### 7.4 Mentor Eşleştirme Sayfası
- [ ] Mentor listesi
- [ ] Mentor kartları
  - [ ] Profil fotoğrafı
  - [ ] Ad ve uzmanlık alanı
  - [ ] Biyografi
  - [ ] Rating
  - [ ] İletişim butonu
- [ ] Filtreleme ve arama
- [ ] Mentor profil sayfası

### 7.5 Online Eğitimler Sayfası
- [ ] Eğitim listesi
- [ ] Eğitim kartları
  - [ ] Başlık
  - [ ] Açıklama
  - [ ] Kategori
  - [ ] Zorluk seviyesi
  - [ ] Süre
  - [ ] Başla/Devam et butonu
- [ ] Filtreleme ve arama
- [ ] Eğitim oynatıcı sayfası
  - [ ] Video oynatıcı
  - [ ] İlerleme göstergesi
  - [ ] Sonraki eğitim butonu

### 7.6 Mesajlaşma Sayfası
- [ ] Sohbet listesi
- [ ] Sohbet pencereleri
  - [ ] Mesaj gösterimi
  - [ ] Mesaj input alanı
  - [ ] Dosya yükleme
  - [ ] Emoji picker (opsiyonel)
- [ ] Real-time mesajlaşma (WebSocket)

### 7.7 Topluluk Sayfası
- [ ] Topluluk feed'i
- [ ] Post kartları
  - [ ] Yazar bilgisi
  - [ ] Post içeriği
  - [ ] Resimler/Videolar
  - [ ] Like/Comment butonları
- [ ] Yeni post oluşturma
- [ ] Yorum sistemi
- [ ] Kullanıcı profil linki

### 7.8 Ayarlar Sayfası
- [ ] Hesap ayarları
- [ ] Gizlilik ayarları
- [ ] Bildirim ayarları
- [ ] Tema seçimi (Light/Dark)
- [ ] Dil seçimi
- [ ] Hesabı sil seçeneği

---

## DEVAM EDEN GÖREVLER

### Günlük Görevler
- [ ] Kod yazma ve commit etme
- [ ] Tasarımcıyla tasarım detaylarını gözden geçirme
- [ ] Backend geliştiriciyle API entegrasyonunu gözden geçirme
- [ ] Code review'leri yapma

### Haftalık Görevler
- [ ] Sprint review toplantıları
- [ ] Proje yöneticisiyle ilerleme raporu
- [ ] QA testi sonuçlarını gözden geçirme
- [ ] Performance metriklerini analiz etme

### Aylık Görevler
- [ ] Kod kalitesi analizi
- [ ] Security audit
- [ ] Dependency güncellemeleri
- [ ] Performance optimization

---

## BAŞARININ ÖLÇÜLMESİ

### MVP Frontend Başarı Kriterleri
- [ ] Tüm sayfalar responsive
- [ ] %90+ Lighthouse score
- [ ] 0 console errors
- [ ] <2 saniye initial load time
- [ ] %100 functionality test pass

### Aşama 2 Frontend Başarı Kriterleri
- [ ] Tüm sayfalar responsive
- [ ] %95+ Lighthouse score
- [ ] 0 critical bugs
- [ ] <1 saniye page transition time
- [ ] %100% functionality test pass

---

## ARAÇLAR VE KAYNAKLAR

**Kütüphaneler:**
- React 18+
- React Router v6
- Axios
- Tailwind CSS
- Formik + Yup
- React Query (opsiyonel)

**Testing:**
- Jest
- React Testing Library
- Cypress (E2E testing)

**Development Tools:**
- VS Code
- Chrome DevTools
- Lighthouse
- axe DevTools
- Postman

**Performance:**
- Webpack Bundle Analyzer
- Lighthouse
- WebPageTest

---

**Hazırlayan:** Manus AI  
**Tarih:** 20 Şubat 2026  
**Versiyon:** 1.0
