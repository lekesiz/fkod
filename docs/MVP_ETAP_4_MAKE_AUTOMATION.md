# MVP Etap 4: Make.com Otomasyon Akışı

## 🔄 Otomasyon Mimarisi

F-Kod MVP'de, Tally.so form → Make.com → ChatGPT → SendGrid e-posta akışı kullanılır.

```
┌─────────────────────────────────────────────────────────────┐
│                    OTOMASYON AKIŞI                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tally.so Form                                              │
│  (Test Soruları)                                            │
│         │                                                   │
│         ▼                                                   │
│  Make.com Webhook                                           │
│  (Form Verilerini Yakala)                                   │
│         │                                                   │
│         ▼                                                   │
│  Arketip Hesaplama                                          │
│  (Test Cevaplarından Arketip Belirle)                       │
│         │                                                   │
│         ▼                                                   │
│  ChatGPT API                                                │
│  (Kişiselleştirilmiş Rapor Oluştur)                         │
│         │                                                   │
│         ▼                                                   │
│  PDF Oluştur                                                │
│  (Raporu PDF'ye Dönüştür)                                   │
│         │                                                   │
│         ▼                                                   │
│  SendGrid E-posta                                           │
│  (Raporu Kullanıcıya Gönder)                                │
│         │                                                   │
│         ▼                                                   │
│  Veritabanı Kayıt                                           │
│  (Kullanıcı Verilerini Kaydet)                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Make.com Modülleri

### 1. Tally.so Webhook Trigger

**Modül:** Webhooks > Custom webhook  
**Trigger:** Form gönderimi

```json
{
  "webhook_url": "https://hook.make.com/...",
  "method": "POST",
  "data": {
    "user_name": "string",
    "user_email": "string",
    "user_age": "number",
    "answers": [
      "A", "B", "C", "D", "A", "C", "A", "C", "A", "C"
    ]
  }
}
```

### 2. Arketip Hesaplama Modülü

**Modül:** JavaScript > Execute code  
**Görev:** Test cevaplarından arketip belirle

```javascript
// Arketip Hesaplama Algoritması
function calculateArchetype(answers) {
  // Cevapları sayma
  const counts = {
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0
  };
  
  answers.forEach(answer => {
    counts[answer]++;
  });
  
  // En yüksek iki fitrat belirle
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);
  
  const primary = sorted[0][0];
  const secondary = sorted[1][0];
  
  // Arketip kodu
  const archetypeCode = `${primary}+${secondary}`;
  
  return {
    code: archetypeCode,
    primary: primary,
    secondary: secondary,
    scores: counts
  };
}
```

### 3. ChatGPT API Modülü

**Modül:** OpenAI > Create message  
**Görev:** Kişiselleştirilmiş rapor oluştur

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "[Master Prompt]"
    },
    {
      "role": "user",
      "content": "Kullanıcı: {user_name}\nYaş: {user_age}\nArketip: {archetype_code}\nTest Cevapları: {answers}\n\nBu kullanıcı için kişiselleştirilmiş bir rapor oluştur."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### 4. PDF Oluşturma Modülü

**Modül:** HTTP > Make a request  
**Görev:** Raporu PDF'ye dönüştür

```json
{
  "url": "https://api.html2pdf.com/convert",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {API_KEY}",
    "Content-Type": "application/json"
  },
  "body": {
    "html": "[Rapor HTML'i]",
    "filename": "{user_name}_fkod_raporu.pdf"
  }
}
```

### 5. SendGrid E-posta Modülü

**Modül:** SendGrid > Send an email  
**Görev:** Raporu kullanıcıya gönder

```json
{
  "to": "{user_email}",
  "from": "rapor@fkod.org",
  "subject": "F-Kod Fıtrat Keşif Raporun Hazır! 🌟",
  "html": "<h1>Merhaba {user_name}!</h1><p>Fıtrat keşif raporun hazır. Ekteki dosyayı indir.</p>",
  "attachments": [
    {
      "filename": "{user_name}_fkod_raporu.pdf",
      "content": "[PDF Content]"
    }
  ]
}
```

### 6. Veritabanı Kayıt Modülü

**Modül:** Google Sheets > Add a row  
**Görev:** Kullanıcı verilerini kaydet

```json
{
  "spreadsheet_id": "{SHEET_ID}",
  "range": "Responses!A:F",
  "values": [
    "{user_name}",
    "{user_email}",
    "{user_age}",
    "{archetype_code}",
    "{timestamp}",
    "completed"
  ]
}
```

## 🔑 API Anahtarları ve Konfigürasyon

### OpenAI API
```
API Key: sk-...
Model: gpt-4
Temperature: 0.7
Max Tokens: 2000
```

### SendGrid
```
API Key: SG....
From Email: rapor@fkod.org
From Name: F-Kod Takımı
```

### Tally.so
```
Form ID: ...
Webhook URL: https://hook.make.com/...
```

### Google Sheets (Veritabanı)
```
Spreadsheet ID: ...
Sheet Name: Responses
Columns: Name, Email, Age, Archetype, Timestamp, Status
```

## 📧 E-posta Şablonu

### Konu Satırı
```
F-Kod Fıtrat Keşif Raporun Hazır! 🌟
```

### E-posta İçeriği
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Poppins', sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); 
              color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background: #a855f7; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hoş Geldin {user_name}! 🌟</h1>
      <p>Fıtrat Keşif Raporun Hazır</p>
    </div>
    
    <div class="content">
      <p>Merhaba {user_name},</p>
      
      <p>Tebrikler! F-Kod Fıtrat Keşif Testi'ni tamamladın. 
      Senin fıtratını keşfetmek için hazırlanmış özel raporun 
      ektedir.</p>
      
      <h2>Raporunda Neler Var?</h2>
      <ul>
        <li>Senin Fıtrat Arketipinin Açıklaması</li>
        <li>Senin Güçlerin ve Yeteneklerin</li>
        <li>Dikkat Etmen Gereken Noktalar</li>
        <li>İdeal Kariyer Alanları</li>
        <li>Kişiye Özel Yol Haritası</li>
      </ul>
      
      <p><strong>Sonraki Adımlar:</strong></p>
      <ol>
        <li>Raporunu dikkatlice oku</li>
        <li>F-Kod topluluğuna katıl</li>
        <li>Bir mentor bul</li>
        <li>Yolculuğuna başla!</li>
      </ol>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="https://fkod.org/community" class="button">
          Topluluğa Katıl
        </a>
      </p>
      
      <p>Sorularınız varsa, <a href="mailto:info@fkod.org">
      info@fkod.org</a> adresinden bize yazabilirsiniz.</p>
      
      <p>Umut ve güvenle,<br>
      F-Kod Takımı 🌟</p>
    </div>
    
    <div class="footer">
      <p>© 2026 F-Kod Derneği | www.fkod.org</p>
      <p>Bu e-postayı istemiyorsanız, 
      <a href="https://fkod.org/unsubscribe">abonelikten çık</a></p>
    </div>
  </div>
</body>
</html>
```

## 🧪 Test Senaryoları

### Senaryo 1: Başarılı Form Gönderimi
1. Tally.so'da test formunu doldur
2. Gönder
3. Make.com webhook'u tetiklenir
4. Arketip hesaplanır
5. ChatGPT rapor oluşturur
6. PDF oluşturulur
7. E-posta gönderilir
8. Veritabanına kaydedilir

**Beklenen Sonuç:** E-posta alınır, PDF açılır, rapor doğru görünür

### Senaryo 2: Hata Yönetimi
- Form eksik verilerle gönderilirse
- API hatası oluşursa
- E-posta gönderimi başarısız olursa

**Beklenen Sonuç:** Hata mesajı gösterilir, yeniden deneme seçeneği sunulur

### Senaryo 3: Veri Doğrulama
- Test cevapları doğru kaydedilir
- Arketip kodu doğru hesaplanır
- Kullanıcı bilgileri güvenli şekilde saklanır

**Beklenen Sonuç:** Veritabanında doğru veriler görünür

## 📊 Monitoring ve Logging

### Make.com Logs
- Webhook tetiklemeleri
- API çağrıları
- Hata mesajları
- İşlem süreleri

### SendGrid Logs
- E-posta gönderimi başarısı
- Açılma oranları
- Hata mesajları

### Google Sheets
- Tüm form gönderimlerinin kaydı
- Arketip dağılımı
- Yanıt oranları

## 🔒 Güvenlik Notları

1. **API Anahtarları:** Asla GitHub'a commit etme
2. **Kullanıcı Verileri:** GDPR uyumlu şekilde saklama
3. **E-posta:** Spam olmadığından emin olma
4. **Rate Limiting:** API çağrılarını sınırlandırma

## 🚀 Deployment Checklist

- [ ] Tally.so formu yayına al
- [ ] Make.com scenario'sunu test et
- [ ] OpenAI API key'ini konfigüre et
- [ ] SendGrid API key'ini konfigüre et
- [ ] Google Sheets'i konfigüre et
- [ ] E-posta şablonunu test et
- [ ] Hata yönetimini test et
- [ ] Logging'i etkinleştir
- [ ] Monitoring'i kur
- [ ] Soft launch yap

---

**Versiyon:** 1.0  
**Son Güncelleme:** 20 Şubat 2026
