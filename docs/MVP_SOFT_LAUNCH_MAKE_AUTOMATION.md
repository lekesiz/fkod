# MVP Soft Launch - Make.com Otomasyon Akışı

## 1. Otomasyon Akışı Genel Yapısı

```
Tally.so Form Submission
        ↓
   Webhook Trigger
        ↓
   Data Parsing
        ↓
   Test Scoring
        ↓
   Archetype Matching
        ↓
   PDF Report Generation
        ↓
   SendGrid E-posta Gönderimi
        ↓
   Database Kayıt
        ↓
   Slack Notification
```

---

## 2. Make.com Scenario Adımları

### Adım 1: Webhook Trigger (Tally.so)

**Module:** Webhooks > Custom Webhook

**Konfigürasyon:**
```
Webhook Name: F-Kod Form Submission
Method: POST
Data Structure:
{
  "name": "string",
  "email": "string",
  "age": "number",
  "gender": "string",
  "answers": {
    "q1": "string",
    "q2": "string",
    ...
    "q10": "string"
  },
  "interests": "array",
  "referral": "string",
  "comments": "string",
  "submitted_at": "string"
}
```

**Webhook URL:**
```
https://hook.make.com/[YOUR_WEBHOOK_ID]
```

---

### Adım 2: Data Parsing

**Module:** Tools > Set Variable

**Konfigürasyon:**
```
Variable 1: user_name = {{1.name}}
Variable 2: user_email = {{1.email}}
Variable 3: user_age = {{1.age}}
Variable 4: user_gender = {{1.gender}}
Variable 5: test_answers = {{1.answers}}
Variable 6: user_interests = {{1.interests}}
Variable 7: referral_source = {{1.referral}}
Variable 8: user_comments = {{1.comments}}
Variable 9: submitted_at = {{1.submitted_at}}
```

---

### Adım 3: Test Scoring

**Module:** JavaScript > Execute Code

**Kod:**
```javascript
// Test Scoring Logic
const answers = input.answers;
const scoring = {
  sistem: 0,
  kalp: 0,
  mana: 0,
  aksiyon: 0
};

// Scoring Map
const scoreMap = {
  q1: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q2: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q3: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q4: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q5: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q6: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q7: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q8: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q9: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' },
  q10: { A: 'sistem', B: 'kalp', C: 'mana', D: 'aksiyon' }
};

// Calculate scores
for (let i = 1; i <= 10; i++) {
  const question = `q${i}`;
  const answer = answers[question];
  const category = scoreMap[question][answer];
  if (category) {
    scoring[category]++;
  }
}

// Find dominant category
const maxScore = Math.max(...Object.values(scoring));
const dominantCategory = Object.keys(scoring).find(k => scoring[k] === maxScore);

return {
  scoring: scoring,
  dominant_category: dominantCategory,
  sistem_score: scoring.sistem,
  kalp_score: scoring.kalp,
  mana_score: scoring.mana,
  aksiyon_score: scoring.aksiyon
};
```

---

### Adım 4: Archetype Matching

**Module:** JavaScript > Execute Code

**Kod:**
```javascript
// Archetype Matching Logic
const dominantCategory = input.dominant_category;
const scoring = input.scoring;

const archetypeMap = {
  sistem: [
    { name: 'The Hero', code: 'hero', description: 'Lider, organize edici, problem çözücü' },
    { name: 'The Sage', code: 'sage', description: 'Bilge, araştırıcı, öğretmen' },
    { name: 'The Ruler', code: 'ruler', description: 'Yönetici, kontrol edici, otorite' }
  ],
  kalp: [
    { name: 'The Lover', code: 'lover', description: 'Empatik, bağlantı kurucu, destekleyici' },
    { name: 'The Caregiver', code: 'caregiver', description: 'Yardımcı, fedakâr, merhamet' },
    { name: 'The Everyman', code: 'everyman', description: 'Uyumlu, sosyal, halkçı' }
  ],
  mana: [
    { name: 'The Creator', code: 'creator', description: 'Yaratıcı, inovatif, özgür' },
    { name: 'The Magician', code: 'magician', description: 'Dönüştürücü, bilgili, güçlü' },
    { name: 'The Jester', code: 'jester', description: 'Komik, eğlendirici, özgür' }
  ],
  aksiyon: [
    { name: 'The Explorer', code: 'explorer', description: 'Macera arayan, keşifçi, bağımsız' },
    { name: 'The Outlaw', code: 'outlaw', description: 'Devrimci, yıkıcı, radikal' },
    { name: 'The Innocent', code: 'innocent', description: 'İyimser, mutlu, güvenli' }
  ]
};

// Select archetype based on dominant category
const archetypes = archetypeMap[dominantCategory];
const selectedArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];

return {
  archetype_name: selectedArchetype.name,
  archetype_code: selectedArchetype.code,
  archetype_description: selectedArchetype.description,
  category: dominantCategory
};
```

---

### Adım 5: PDF Report Generation

**Module:** HTTP > Make a Request

**Konfigürasyon:**
```
URL: https://api.example.com/generate-report
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer {{api_key}}

Body:
{
  "name": "{{user_name}}",
  "email": "{{user_email}}",
  "age": "{{user_age}}",
  "archetype_name": "{{archetype_name}}",
  "archetype_code": "{{archetype_code}}",
  "archetype_description": "{{archetype_description}}",
  "scoring": {{scoring}},
  "interests": {{user_interests}},
  "comments": "{{user_comments}}"
}
```

**Response Parsing:**
```
Variable: pdf_url = {{response.pdf_url}}
Variable: report_id = {{response.report_id}}
```

---

### Adım 6: SendGrid E-posta Gönderimi

**Module:** Email > Send an Email (SendGrid)

**Konfigürasyon:**
```
To: {{user_email}}
From: noreply@fkod.com
Subject: 🎯 Fıtratını Keşfet - Raporun Hazır!
Template: F-Kod Report Email

Dynamic Data:
{
  "name": "{{user_name}}",
  "archetype_name": "{{archetype_name}}",
  "archetype_description": "{{archetype_description}}",
  "report_url": "{{pdf_url}}",
  "report_id": "{{report_id}}"
}

Attachments:
- PDF Report ({{pdf_url}})
```

---

### Adım 7: Database Kayıt

**Module:** HTTP > Make a Request

**Konfigürasyon:**
```
URL: https://api.fkod.com/submissions
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer {{api_key}}

Body:
{
  "name": "{{user_name}}",
  "email": "{{user_email}}",
  "age": "{{user_age}}",
  "gender": "{{user_gender}}",
  "archetype_code": "{{archetype_code}}",
  "archetype_name": "{{archetype_name}}",
  "scoring": {{scoring}},
  "interests": {{user_interests}},
  "referral_source": "{{referral_source}}",
  "comments": "{{user_comments}}",
  "report_id": "{{report_id}}",
  "pdf_url": "{{pdf_url}}",
  "submitted_at": "{{submitted_at}}"
}
```

---

### Adım 8: Slack Notification

**Module:** Slack > Send a Message

**Konfigürasyon:**
```
Channel: #fkod-submissions
Message Format:

🎉 Yeni F-Kod Testi Tamamlandı!

👤 Kullanıcı: {{user_name}}
📧 E-posta: {{user_email}}
🎂 Yaş: {{user_age}}
🎯 Arketip: {{archetype_name}}
📊 Kategori: {{dominant_category}}
⏰ Zaman: {{submitted_at}}

Scoring:
- Sistem: {{sistem_score}}/10
- Kalp: {{kalp_score}}/10
- Mana: {{mana_score}}/10
- Aksiyon: {{aksiyon_score}}/10

Rapor: {{pdf_url}}
```

---

## 3. Error Handling

### Adım 9: Error Handling

**Module:** Router > Error Handler

**Konfigürasyon:**
```
Condition 1: If PDF generation fails
  Action: Send error email to user
  Message: "Rapor oluşturulurken hata oluştu. Lütfen daha sonra tekrar dene."
  
Condition 2: If SendGrid fails
  Action: Send alert to admin
  Message: "E-posta gönderilemedi: {{error}}"
  
Condition 3: If Database save fails
  Action: Log error and retry
  Retry: 3 times with 5 second delay
```

---

## 4. Make.com Scenario JSON

```json
{
  "name": "F-Kod MVP Soft Launch - Form to Report",
  "description": "Tally.so form submission → Test scoring → PDF report → SendGrid email",
  "modules": [
    {
      "id": 1,
      "type": "webhook",
      "name": "Tally.so Form Submission",
      "config": {
        "webhook_name": "F-Kod Form Submission",
        "method": "POST"
      }
    },
    {
      "id": 2,
      "type": "tools",
      "name": "Parse Form Data",
      "config": {
        "variables": [
          "user_name",
          "user_email",
          "user_age",
          "test_answers"
        ]
      }
    },
    {
      "id": 3,
      "type": "javascript",
      "name": "Calculate Test Scores",
      "config": {
        "code": "// Scoring logic"
      }
    },
    {
      "id": 4,
      "type": "javascript",
      "name": "Match Archetype",
      "config": {
        "code": "// Archetype matching logic"
      }
    },
    {
      "id": 5,
      "type": "http",
      "name": "Generate PDF Report",
      "config": {
        "url": "https://api.example.com/generate-report",
        "method": "POST"
      }
    },
    {
      "id": 6,
      "type": "sendgrid",
      "name": "Send Report Email",
      "config": {
        "template": "F-Kod Report Email"
      }
    },
    {
      "id": 7,
      "type": "http",
      "name": "Save to Database",
      "config": {
        "url": "https://api.fkod.com/submissions",
        "method": "POST"
      }
    },
    {
      "id": 8,
      "type": "slack",
      "name": "Send Slack Notification",
      "config": {
        "channel": "#fkod-submissions"
      }
    }
  ]
}
```

---

## 5. Make.com Kurulum Adımları

1. **Make.com'a Git:** https://make.com
2. **Yeni Scenario Oluştur:** "Create a new scenario"
3. **Webhook Ekle:** Tally.so form submission trigger
4. **Modules Ekle:** Yukarıdaki 8 adımı sırasıyla ekle
5. **Connections Kur:**
   - SendGrid API key
   - Database API key
   - Slack webhook
6. **Test Et:** Test data ile scenario çalıştır
7. **Activate:** Scenario'yu aktif et
8. **Monitor:** Execution history'yi takip et

---

## 6. Make.com Scenario Checklist

- [ ] Webhook trigger kuruldu
- [ ] Data parsing ayarlandı
- [ ] Test scoring logic eklendi
- [ ] Archetype matching eklendi
- [ ] PDF generation entegrasyonu kuruldu
- [ ] SendGrid entegrasyonu kuruldu
- [ ] Database API entegrasyonu kuruldu
- [ ] Slack notification kuruldu
- [ ] Error handling ayarlandı
- [ ] Test execution tamamlandı
- [ ] Scenario aktif edildi
- [ ] Monitoring başlatıldı

---

## 7. Performance Metrics

| Metrik | Hedef |
|--------|-------|
| Webhook Response Time | < 1s |
| Test Scoring Time | < 500ms |
| PDF Generation Time | < 5s |
| Email Send Time | < 2s |
| Total Execution Time | < 10s |
| Success Rate | > 99% |

---

## 8. Troubleshooting

### Problem: Webhook not triggering
**Çözüm:**
- Tally.so webhook URL'ini kontrol et
- Make.com webhook ID'sini doğrula
- Tally.so test submission gönder

### Problem: PDF generation fails
**Çözüm:**
- API endpoint'i kontrol et
- API key'i doğrula
- Request payload'ı verify et

### Problem: Email not sent
**Çözüm:**
- SendGrid API key'i kontrol et
- E-posta adresi formatını doğrula
- SendGrid logs'ı kontrol et

### Problem: Database save fails
**Çözüm:**
- Database connection'ı kontrol et
- API endpoint'i doğrula
- Request payload'ı verify et

---

## 9. Sonraki Adımlar

1. ✅ Tally.so form oluştur
2. ✅ Make.com scenario kur
3. ⏳ SendGrid e-posta sistemini entegre et
4. ⏳ Beta testing başlat
5. ⏳ Feedback topla ve analiz et
