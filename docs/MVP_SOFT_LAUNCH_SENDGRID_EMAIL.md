# MVP Soft Launch - SendGrid E-posta Sistemi

## 1. SendGrid Kurulum

### Adım 1: SendGrid Hesabı Oluştur
1. https://sendgrid.com adresine git
2. "Sign Up" tıkla
3. E-posta, şifre ve bilgilerini gir
4. E-postanı doğrula
5. Account setup'ı tamamla

### Adım 2: API Key Oluştur
1. Settings → API Keys
2. "Create API Key" tıkla
3. Name: "F-Kod MVP"
4. Permissions: Mail Send
5. Key'i kopyala ve güvenli yerde sakla

### Adım 3: Sender Identity Doğrula
1. Settings → Sender Authentication
2. "Verify a Single Sender"
3. E-posta: noreply@fkod.com
4. Name: F-Kod
5. Doğrulama e-postasını kontrol et

---

## 2. E-posta Şablonları

### Şablon 1: Hoşgeldin E-postası

**Template Name:** F-Kod Welcome Email

**Subject:** 🎉 Hoş geldin F-Kod'a!

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Poppins', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px; background: #f8fafc; }
        .button { display: inline-block; background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { background: #1e293b; color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Hoş Geldin {{name}}!</h1>
            <p>Fıtratını Keşfet Yolculuğuna Başla</p>
        </div>
        
        <div class="content">
            <p>Merhaba {{name}},</p>
            
            <p>F-Kod ailesine hoş geldin! Seni 14-24 yaş arası gençlerin fıtratlarını keşfetmelerine yardımcı olan bir platform ile tanıştırıyoruz.</p>
            
            <h2>Nedir F-Kod?</h2>
            <p>F-Kod, senin doğal yeteneklerini, kişilik özelliklerini ve potansiyelini keşfetmene yardımcı olan bir platform. 10 soruluk bir test ile 12 fıtrat arketipinden birine eşleşeceksin ve kişiselleştirilmiş bir rapor alacaksın.</p>
            
            <h2>Sonraki Adımlar</h2>
            <ol>
                <li>Raporunu indir ve oku</li>
                <li>Kendi fıtratını anla</li>
                <li>Mentorlarla bağlantı kur</li>
                <li>Kursları keşfet ve öğrenmeye başla</li>
                <li>Topluluğa katıl ve deneyim paylaş</li>
            </ol>
            
            <p style="text-align: center;">
                <a href="{{report_url}}" class="button">📊 Raporumu Gör</a>
            </p>
            
            <p>Soruların varsa, bize <a href="mailto:info@fkod.com">info@fkod.com</a> adresinden ulaş.</p>
            
            <p>Başarılar!<br>F-Kod Takımı</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2026 F-Kod. Tüm hakları saklıdır.</p>
            <p><a href="https://fkod.com" style="color: #06b6d4;">Website</a> | <a href="https://fkod.com/privacy" style="color: #06b6d4;">Gizlilik</a> | <a href="https://fkod.com/terms" style="color: #06b6d4;">Şartlar</a></p>
        </div>
    </div>
</body>
</html>
```

---

### Şablon 2: Rapor Hazır E-postası

**Template Name:** F-Kod Report Ready Email

**Subject:** 🎯 {{archetype_name}} - Fıtratını Keşfet Raporun Hazır!

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Poppins', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px; background: #f8fafc; }
        .archetype-box { background: white; border-left: 4px solid #a855f7; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { background: #1e293b; color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Raporun Hazır {{name}}!</h1>
            <p>Fıtratını Keşfet Testi Sonuçları</p>
        </div>
        
        <div class="content">
            <p>Merhaba {{name}},</p>
            
            <p>Tebrikler! F-Kod testini tamamladın ve raporun hazır. Seni hangi fıtrat arketipine eşleştirdiğimizi merak ediyor musun?</p>
            
            <div class="archetype-box">
                <h2>🎯 Senin Arketip: {{archetype_name}}</h2>
                <p><strong>Açıklama:</strong> {{archetype_description}}</p>
                <p><strong>Kategori:</strong> {{category}}</p>
            </div>
            
            <p>Raporunda şunları bulacaksın:</p>
            <ul>
                <li>✨ Detaylı arketip analizi</li>
                <li>💪 Senin super güçlerin</li>
                <li>⚡ Gelişim alanların</li>
                <li>🎓 Önerilen kariyer alanları</li>
                <li>🗺️ Kişisel gelişim yol haritası</li>
                <li>👥 Uyumlu mentorlar</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{report_url}}" class="button">📥 Raporumu İndir</a>
            </p>
            
            <h3>Sonraki Adımlar</h3>
            <ol>
                <li>Raporunu oku ve kendi fıtratını anla</li>
                <li>Mentorlarla bağlantı kur</li>
                <li>Sana uygun kursları keşfet</li>
                <li>Topluluğa katıl ve deneyim paylaş</li>
            </ol>
            
            <p>Sorularınız için <a href="mailto:info@fkod.com">info@fkod.com</a> adresinden bize ulaşabilirsiniz.</p>
            
            <p>Başarılar!<br>F-Kod Takımı</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2026 F-Kod. Tüm hakları saklıdır.</p>
            <p><a href="https://fkod.com" style="color: #06b6d4;">Website</a> | <a href="https://fkod.com/privacy" style="color: #06b6d4;">Gizlilik</a> | <a href="https://fkod.com/terms" style="color: #06b6d4;">Şartlar</a></p>
        </div>
    </div>
</body>
</html>
```

---

### Şablon 3: Mentor Eşleştirme E-postası

**Template Name:** F-Kod Mentor Match Email

**Subject:** 👥 Sana Uygun Mentorlar Buldum!

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Poppins', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px; background: #f8fafc; }
        .mentor-card { background: white; border: 1px solid #e2e8f0; padding: 20px; margin: 15px 0; border-radius: 8px; }
        .button { display: inline-block; background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 5px; }
        .footer { background: #1e293b; color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👥 Sana Uygun Mentorlar!</h1>
            <p>Fıtratına göre seçilmiş mentorlar</p>
        </div>
        
        <div class="content">
            <p>Merhaba {{name}},</p>
            
            <p>Raporunu analiz ettikten sonra, sana uygun mentorları buldum. Bu mentorlar senin fıtratını anlamış ve seni destekleyebilecek deneyimli kişiler.</p>
            
            {{#each mentors}}
            <div class="mentor-card">
                <h3>{{this.name}}</h3>
                <p><strong>Uzmanlık:</strong> {{this.expertise}}</p>
                <p><strong>Deneyim:</strong> {{this.experience}} yıl</p>
                <p><strong>Hakkında:</strong> {{this.bio}}</p>
                <p>
                    <a href="{{this.profile_url}}" class="button">Profili Gör</a>
                    <a href="{{this.connect_url}}" class="button">Bağlantı Kur</a>
                </p>
            </div>
            {{/each}}
            
            <h3>Mentor Nedir?</h3>
            <p>Mentorlar, seni kişisel gelişim yolculuğunda rehberlik edecek, deneyimlerini paylaşacak ve seni destekleyecek kişilerdir. Onlarla bire bir görüşmeler yapabilir, sorular sorabilir ve hedeflerini belirleyebilirsin.</p>
            
            <p style="text-align: center;">
                <a href="https://fkod.com/mentors" class="button">Tüm Mentorları Gör</a>
            </p>
            
            <p>Sorularınız için <a href="mailto:info@fkod.com">info@fkod.com</a> adresinden bize ulaşabilirsiniz.</p>
            
            <p>Başarılar!<br>F-Kod Takımı</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2026 F-Kod. Tüm hakları saklıdır.</p>
            <p><a href="https://fkod.com" style="color: #06b6d4;">Website</a> | <a href="https://fkod.com/privacy" style="color: #06b6d4;">Gizlilik</a> | <a href="https://fkod.com/terms" style="color: #06b6d4;">Şartlar</a></p>
        </div>
    </div>
</body>
</html>
```

---

## 3. SendGrid Template Kurulum

### Adım 1: Dynamic Template Oluştur
1. Email API → Dynamic Templates
2. "Create Template" tıkla
3. Template adı: "F-Kod Report Ready Email"
4. HTML content'i yapıştır
5. Variables'ı tanımla ({{name}}, {{archetype_name}}, etc.)
6. "Save" tıkla

### Adım 2: Template ID'sini Al
1. Template'i aç
2. "Settings" tıkla
3. Template ID'sini kopyala
4. Make.com'da kullanmak için sakla

---

## 4. SendGrid Integration (Make.com)

### Make.com Module Konfigürasyonu

**Module:** Email > Send an Email (SendGrid)

**Konfigürasyon:**
```
API Key: {{sendgrid_api_key}}
From Email: noreply@fkod.com
From Name: F-Kod
To Email: {{user_email}}
To Name: {{user_name}}

Template ID: d-[YOUR_TEMPLATE_ID]

Dynamic Template Data:
{
  "name": "{{user_name}}",
  "archetype_name": "{{archetype_name}}",
  "archetype_description": "{{archetype_description}}",
  "category": "{{category}}",
  "report_url": "{{pdf_url}}",
  "report_id": "{{report_id}}",
  "mentors": {{mentor_list}}
}

Attachments:
- PDF Report: {{pdf_url}}
```

---

## 5. SendGrid Analytics

### Takip Edilecek Metrikler
- [ ] Email delivery rate
- [ ] Email open rate
- [ ] Email click rate
- [ ] Bounce rate
- [ ] Unsubscribe rate
- [ ] Spam report rate

### Dashboard Setup
1. SendGrid Dashboard'a git
2. Email Activity → All Mail
3. Filters: From: noreply@fkod.com
4. Metrics'i analiz et

---

## 6. SendGrid Best Practices

### E-posta Tasarımı
- ✅ Mobile responsive
- ✅ Clear CTA buttons
- ✅ Personalization ({{name}})
- ✅ Unsubscribe link
- ✅ Footer with contact info

### Deliverability
- ✅ SPF, DKIM, DMARC kurulumu
- ✅ Sender verification
- ✅ List hygiene
- ✅ Bounce handling
- ✅ Complaint handling

### Compliance
- ✅ CAN-SPAM compliance
- ✅ GDPR compliance
- ✅ Privacy policy link
- ✅ Unsubscribe option
- ✅ Contact information

---

## 7. SendGrid Checklist

- [ ] SendGrid hesabı oluşturuldu
- [ ] API key oluşturuldu ve güvenli yerde saklandı
- [ ] Sender identity doğrulandı
- [ ] 3 e-posta şablonu oluşturuldu
- [ ] Dynamic templates kuruldu
- [ ] Template ID'leri kaydedildi
- [ ] Make.com entegrasyonu kuruldu
- [ ] Test e-postası gönderildi
- [ ] Analytics dashboard kuruldu
- [ ] SPF/DKIM/DMARC kuruldu
- [ ] Unsubscribe mekanizması ayarlandı

---

## 8. SendGrid Troubleshooting

### Problem: E-posta spam klasörüne gidiyor
**Çözüm:**
- SPF, DKIM, DMARC'ı kontrol et
- Subject line'ı optimize et
- Spam trigger words'ü kaldır

### Problem: E-posta gönderilmiyor
**Çözüm:**
- API key'i kontrol et
- Sender email'i doğrula
- Recipient email'i kontrol et

### Problem: Template variables gösterilmiyor
**Çözüm:**
- Variable adlarını kontrol et
- Template ID'sini doğrula
- Dynamic data'yı verify et

---

## 9. Sonraki Adımlar

1. ✅ Tally.so form oluştur
2. ✅ Make.com scenario kur
3. ✅ SendGrid e-posta sistemi entegre et
4. ⏳ Beta testing başlat
5. ⏳ Feedback topla ve analiz et
