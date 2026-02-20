# F-KOD WEBAPP PROJESİ - PROMPT MÜHENDİSİ TODO LİSTESİ

## 📋 Rol Özeti
**Rol:** Prompt Mühendisi / Yapay Zeka Uzmanı  
**Sorumluluğu:** ChatGPT'nin gençlere yazacağı raporların kalitesi ve uygunluğu  
**Zaman Çizelgesi:** MVP 1-2 hafta, Aşama 2: Devam eden iyileştirmeler  
**Çalışma Modeli:** Yarı zamanlı (MVP), Hafta başına 5-10 saat (Aşama 2)

---

## FAZA 1: HAZIRLIK VE ARAŞTIRMA (Gün 1)

### 1.1 Proje Briefing
- [ ] Proje yöneticisiyle ilk toplantı yapma
- [ ] F-Kod projesinin vizyonunu anlamak
- [ ] Hedef kitle (14-24 yaş) hakkında araştırma
- [ ] 12 arketip tanımlamalarını okumak
- [ ] Örnek raporları incelemek
- [ ] Proje belgelendirmesini okuma

### 1.2 OpenAI API Kurulması
- [ ] OpenAI hesabı oluşturma
- [ ] API key oluşturma
- [ ] OpenAI Python SDK kurulması
  ```bash
  pip install openai
  ```
- [ ] API test etme
  ```python
  import openai
  openai.api_key = "sk-..."
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Merhaba"}]
  )
  ```

### 1.3 Prompt Mühendisliği Temelleri
- [ ] Prompt mühendisliği best practices araştırması
- [ ] Few-shot learning öğrenme
- [ ] Chain-of-thought prompting öğrenme
- [ ] Temperature ve max_tokens parametrelerini anlamak
- [ ] OpenAI API documentation okuma

---

## FAZA 2: MASTER PROMPT OLUŞTURMA (Gün 1-2)

### 2.1 Sistem Prompt Tasarımı
- [ ] Master prompt yazma
  ```
  Sen "F-Kod (Fıtrat Kodları) Derneği"nin baş mentorü, 
  fıtrat analisti ve Z/Alfa kuşağının dilinden çok iyi 
  anlayan vizyoner bir rehbersin.
  ```
- [ ] Ton ve üslup tanımlama
  - [ ] Samimi ve ilham verici
  - [ ] Derin ve anlamlı
  - [ ] Karizmatik ve modern
  - [ ] Psikoloji temelli (astroloji değil)
- [ ] Çıktı yapısını tanımlama
  - [ ] 5 bölüm (Özü, Güçler, Kriptonitin, Vizyon, Aksiyon)
  - [ ] 400 kelime hedefi
  - [ ] Edebi ve psikolojik metaforlar

### 2.2 Arketip Prompt'ları
- [ ] Her 12 arketip için özel prompt yazma

**A Grubu (Akıl ve Sistem Merkezlileri):**
- [ ] A+B: Toplumsal Mimarlar
  - [ ] Özellikler
  - [ ] Güçler
  - [ ] Zayıflıklar
  - [ ] Çalışma ortamları
- [ ] A+C: Stratejik Filozoflar
- [ ] A+D: Saha Komutanları

**B Grubu (Kalp ve İnsan Merkezlileri):**
- [ ] B+A: Adil Rehberler
- [ ] B+C: Ruhsal Şifacılar
- [ ] B+D: İlham Veren Motivatörler

**C Grubu (Mana ve Keşif Merkezlileri):**
- [ ] C+A: Hakikat Dedektifleri
- [ ] C+B: Anlam Ozanları
- [ ] C+D: Ezber Bozan Kâşifler

**D Grubu (İrade ve Aksiyon Merkezlileri):**
- [ ] D+A: Taktiksel İcracılar
- [ ] D+B: Saha Kahramanları
- [ ] D+C: Yıkıcı Yenilikçiler

### 2.3 Prompt Template'i
- [ ] Dinamik prompt template oluşturma
  ```python
  MASTER_PROMPT = """
  Sen F-Kod Derneği'nin baş mentorüsün...
  
  [Arketip Özellikleri]
  [Güçler]
  [Zayıflıklar]
  [Çalışma Ortamları]
  
  Gencin adı: {name}
  Arketip: {archetype}
  Arketip Açıklaması: {archetype_description}
  
  Lütfen bu gence özel bir "Fıtrat Pusulası" yaz...
  """
  ```

---

## FAZA 3: ÖRNEK RAPORLAR VE TESTING (Gün 2-3)

### 3.1 Örnek Rapor Yazma
- [ ] Her 12 arketip için örnek rapor yazma
- [ ] Örnek 1: Hakikat Dedektifi (C+A)
  ```
  Merhaba Kerem,
  
  Testteki reflekslerini analiz ettik...
  [Tam rapor metni]
  ```
- [ ] Örnek 2: Toplumsal Mimar (A+B)
- [ ] Örnek 3: Ruhsal Şifacı (B+C)
- [ ] ... (tüm 12 arketip için)

### 3.2 ChatGPT ile Test
- [ ] Her arketip için ChatGPT test etme
  ```python
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": MASTER_PROMPT},
      {"role": "user", "content": f"Kullanıcı: Ahmet, Arketip: Hakikat Dedektifi"}
    ],
    temperature=0.7,
    max_tokens=500
  )
  ```
- [ ] Çıktıları inceleme
- [ ] Kalite kontrol
  - [ ] Uzunluk (300-500 kelime)
  - [ ] Ton (samimi ve ilham verici)
  - [ ] Doğruluk (arketip özelliklerine uygun)
  - [ ] Kişiselleştirme (adı ve arketip adı)

### 3.3 Prompt Optimizasyonu
- [ ] Temperature ayarlaması
  - [ ] Düşük (0.3-0.5): Daha tutarlı
  - [ ] Orta (0.7): Dengeli
  - [ ] Yüksek (0.9+): Daha yaratıcı
- [ ] Max tokens ayarlaması
  - [ ] 400-600 kelime için 500-800 tokens
- [ ] Model seçimi
  - [ ] gpt-3.5-turbo (hızlı, uygun fiyatlı)
  - [ ] gpt-4 (daha iyi kalite, daha pahalı)

---

## FAZA 4: FINE-TUNING VE İYİLEŞTİRME (Gün 3)

### 4.1 Kullanıcı Geri Bildirimi Toplama
- [ ] Test kullanıcıları seçme (5-10 kişi, 14-24 yaş)
- [ ] Raporları test kullanıcılara gösterme
- [ ] Feedback formunu hazırlama
  - [ ] Rapor ne kadar kişisel hissettirdi? (1-10)
  - [ ] Rapor ne kadar doğru hissettirdi? (1-10)
  - [ ] Rapor ne kadar ilham verici hissettirdi? (1-10)
  - [ ] Hangi bölümü en çok sevdin?
  - [ ] Hangi bölümü iyileştirmeliyiz?
  - [ ] Başka önerilerin var mı?
- [ ] Feedback toplama ve analizi

### 4.2 Prompt Revizyon
- [ ] Feedback'e dayalı prompt revizyon
- [ ] Daha kişisel hale getirme
- [ ] Daha ilham verici hale getirme
- [ ] Daha doğru hale getirme
- [ ] Yeniden test etme

### 4.3 A/B Testing
- [ ] Farklı prompt versiyonları oluşturma
- [ ] Version A: Orijinal prompt
- [ ] Version B: Revize edilmiş prompt
- [ ] Rastgele kullanıcılara gösterme
- [ ] Feedback karşılaştırması
- [ ] En iyi versiyonu seçme

---

## FAZA 5: ARKETIP SPESIFIK PROMPT'LAR (Gün 3+)

### 5.1 Her Arketip için Özel Prompt
- [ ] Hakikat Dedektifi (C+A) Prompt
  - [ ] Derin analitik yapı
  - [ ] Sistematik düşünme
  - [ ] Gizemi çözme metaforları
  - [ ] Özgürlük ve otonomiye vurgu
- [ ] Toplumsal Mimar (A+B) Prompt
  - [ ] Sistematik ve insani
  - [ ] Adalet ve verimlilik
  - [ ] Sosyal sorumluluk
  - [ ] Liderlik
- [ ] Ruhsal Şifacı (B+C) Prompt
  - [ ] Empati ve sezgi
  - [ ] Derin psikolojik anlayış
  - [ ] Manevi boyut
  - [ ] Yardımlaşma
- [ ] ... (tüm 12 arketip için)

### 5.2 Dinamik Prompt Oluşturma
- [ ] Prompt template'i parametrize etme
  ```python
  def generate_prompt(archetype_code, archetype_name, 
                      archetype_description, user_name):
      return f"""
      {MASTER_PROMPT}
      
      Arketip Kodu: {archetype_code}
      Arketip Adı: {archetype_name}
      Arketip Açıklaması: {archetype_description}
      
      Gencin Adı: {user_name}
      
      Lütfen bu gence özel bir "Fıtrat Pusulası" raporu yaz...
      """
  ```

---

## FAZA 6: ENTEGRASYON VE DEPLOYMENT (Gün 4)

### 6.1 Backend Entegrasyonu
- [ ] Backend geliştiriciyle entegrasyon
- [ ] API endpoint'i oluşturma
  ```python
  @app.route('/api/generate-report', methods=['POST'])
  def generate_report():
      data = request.json
      prompt = generate_prompt(
          data['archetype_code'],
          data['archetype_name'],
          data['archetype_description'],
          data['user_name']
      )
      response = openai.ChatCompletion.create(
          model="gpt-3.5-turbo",
          messages=[{"role": "user", "content": prompt}],
          temperature=0.7,
          max_tokens=500
      )
      return response.data.choices[0].message.content
  ```
- [ ] Error handling
- [ ] Rate limiting
- [ ] Caching (opsiyonel)

### 6.2 Make.com Entegrasyonu
- [ ] Make.com'da ChatGPT modülü kurulması
- [ ] Prompt'u Make.com'a yapıştırma
- [ ] Test etme
- [ ] E-posta gönderme akışı

### 6.3 Monitoring ve Logging
- [ ] API çağrılarını logging etme
- [ ] Hata logging'i
- [ ] Performance monitoring
- [ ] Cost monitoring (OpenAI API)

---

## FAZA 7: AŞAMA 2 İYİLEŞTİRMELER (Hafta 2+)

### 7.1 Devam Eden İyileştirmeler
- [ ] Kullanıcı feedback'ini toplamaya devam etme
- [ ] Prompt'ları düzenli olarak iyileştirme
- [ ] Yeni arketip kombinasyonları test etme (opsiyonel)
- [ ] Dil ve ton iyileştirmeleri

### 7.2 İleri Özellikler
- [ ] Çok dilli rapor oluşturma (İngilizce, Arapça vb.)
- [ ] Kişiselleştirilmiş tavsiyeler
- [ ] Dinamik rapor bölümleri
- [ ] Video rapor oluşturma (opsiyonel)

### 7.3 Analitik ve Raporlama
- [ ] Rapor kalitesi metrikleri
  - [ ] Ortalama kullanıcı memnuniyeti
  - [ ] Rapor tamamlanma oranı
  - [ ] Hata oranı
- [ ] Arketip dağılımı analizi
- [ ] Trend analizi

---

## DEVAM EDEN GÖREVLER

### Günlük Görevler
- [ ] Prompt'ları test etme
- [ ] ChatGPT çıktılarını kontrol etme
- [ ] Feedback'leri toplamak
- [ ] Hataları düzeltme

### Haftalık Görevler
- [ ] Proje yöneticisiyle ilerleme raporu
- [ ] Prompt performans analizi
- [ ] Feedback analizi
- [ ] Optimizasyon önerileri

### Aylık Görevler
- [ ] Prompt kalitesi değerlendirmesi
- [ ] Yeni arketip prompt'ları (varsa)
- [ ] OpenAI API maliyet analizi
- [ ] Gelecek iyileştirmeler planlaması

---

## BAŞARININ ÖLÇÜLMESİ

### MVP Prompt Başarı Kriterleri
- [ ] Tüm 12 arketip için çalışan prompt'lar
- [ ] %85+ kullanıcı memnuniyeti
- [ ] <2 saniye rapor oluşturma süresi
- [ ] 0 offensive/inappropriate content
- [ ] %95+ rapor tamamlanma oranı

### Aşama 2 Prompt Başarı Kriterleri
- [ ] %90+ kullanıcı memnuniyeti
- [ ] <1 saniye rapor oluşturma süresi
- [ ] Kişiselleştirilmiş tavsiyeler
- [ ] Çok dilli destek
- [ ] Dinamik rapor bölümleri

---

## PROMPT BEST PRACTICES

### Etkili Prompt Yazma
- [ ] Açık ve spesifik olmak
- [ ] Rol tanımlamak (sen bir mentorsun)
- [ ] Çıktı formatını tanımlamak
- [ ] Örnekler vermek (few-shot)
- [ ] Talimatları adım adım vermek

### Prompt Optimizasyonu
- [ ] Temperature ayarlaması
- [ ] Max tokens ayarlaması
- [ ] Model seçimi
- [ ] Caching kullanma
- [ ] Error handling

### Etik Hususlar
- [ ] Bias'ı minimize etme
- [ ] Offensive content'i önleme
- [ ] Kullanıcı gizliliğini koruma
- [ ] Transparent olmak (yapay zeka kullanıldığını belirtme)

---

## ARAÇLAR VE KAYNAKLAR

**OpenAI Tools:**
- OpenAI API
- OpenAI Playground
- OpenAI Documentation

**Testing Tools:**
- Python (test scriptleri)
- Jupyter Notebook
- Postman (API testing)

**Monitoring:**
- OpenAI Usage Dashboard
- Custom logging scripts

**Learning Resources:**
- OpenAI Cookbook
- Prompt Engineering Guide
- ChatGPT Best Practices

---

**Hazırlayan:** Manus AI  
**Tarih:** 20 Şubat 2026  
**Versiyon:** 1.0
