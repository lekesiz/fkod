# F-Kod Projesine Katkıda Bulunma Rehberi

F-Kod projesine katkıda bulunmayı düşündüğünüz için teşekkür ederiz! Bu belge, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 🌟 Katkı Türleri

Projeye çeşitli şekillerde katkıda bulunabilirsiniz:

1. **Kod Geliştirme**: Yeni özellikler eklemek veya hataları düzeltmek
2. **Dokümantasyon**: Belgeleri iyileştirmek veya yeni belgeler eklemek
3. **Test**: Hataları bulmak ve raporlamak
4. **Tasarım**: UI/UX iyileştirmeleri önermek
5. **İçerik**: Test soruları veya arketip açıklamaları geliştirmek

## 🔄 Geliştirme Süreci

### 1. Repository'yi Fork Etme

```bash
# GitHub üzerinden fork edin
# Ardından kendi fork'unuzu klonlayın
git clone https://github.com/KULLANICI_ADINIZ/fkod.git
cd fkod
```

### 2. Upstream Repository'yi Ekleme

```bash
git remote add upstream https://github.com/lekesiz/fkod.git
git fetch upstream
```

### 3. Yeni Bir Branch Oluşturma

```bash
# Feature branch
git checkout -b feature/yeni-ozellik

# Bugfix branch
git checkout -b bugfix/hata-aciklamasi

# Documentation branch
git checkout -b docs/dokuman-aciklamasi
```

### 4. Değişikliklerinizi Yapma

- Kod standartlarına uyun
- Testler yazın
- Dokümantasyonu güncelleyin

### 5. Commit Yapma

Commit mesajları anlamlı ve açıklayıcı olmalıdır:

```bash
git add .
git commit -m "feat: Yeni özellik açıklaması

- Detaylı açıklama 1
- Detaylı açıklama 2"
```

#### Commit Mesaj Formatı

```
<tip>: <kısa açıklama>

<detaylı açıklama (opsiyonel)>

<footer (opsiyonel)>
```

**Tipler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon değişiklikleri
- `style`: Kod formatı (işlevselliği etkilemeyen)
- `refactor`: Kod yeniden yapılandırma
- `test`: Test ekleme veya düzeltme
- `chore`: Build süreci veya yardımcı araçlar

### 6. Push Etme

```bash
git push origin feature/yeni-ozellik
```

### 7. Pull Request Oluşturma

1. GitHub'da fork'unuza gidin
2. "Pull Request" butonuna tıklayın
3. Değişikliklerinizi açıklayın
4. PR'ınızı gönderin

## 📝 Kod Standartları

### JavaScript/Node.js

- ESLint kurallarına uyun
- Prettier ile kod formatı yapın
- Anlamlı değişken isimleri kullanın
- Fonksiyonları küçük ve odaklı tutun
- Yorum satırları ekleyin (gerektiğinde)

### React

- Fonksiyonel komponentler kullanın
- Hooks kullanın (useState, useEffect vb.)
- PropTypes veya TypeScript ile tip kontrolü yapın
- Komponentleri küçük ve yeniden kullanılabilir tutun

### CSS/Styling

- Tailwind CSS sınıflarını kullanın
- Responsive tasarım prensiplerini uygulayın
- Accessibility standartlarına uyun (WCAG 2.1)

## 🧪 Test Yazma

Her yeni özellik için testler yazılmalıdır:

```javascript
// Örnek test
describe('Fıtrat Hesaplama', () => {
  it('doğru arketipi hesaplamalı', () => {
    const cevaplar = ['A', 'A', 'C', 'C', 'A', 'C', 'A', 'C', 'A', 'C'];
    const arketip = hesaplaArketip(cevaplar);
    expect(arketip).toBe('C+A'); // Hakikat Dedektifi
  });
});
```

## 📚 Dokümantasyon

Kod değişiklikleri yapıyorsanız, ilgili dokümantasyonu da güncelleyin:

- README.md
- API dokümantasyonu
- Kod içi yorumlar
- Todo listeleri

## 🐛 Hata Raporlama

Hata bulduğunuzda, lütfen GitHub Issues'da bir issue açın:

1. **Başlık**: Kısa ve açıklayıcı
2. **Açıklama**: Hatayı detaylı açıklayın
3. **Adımlar**: Hatayı tekrar üretme adımları
4. **Beklenen Sonuç**: Ne olması gerekiyordu?
5. **Gerçek Sonuç**: Ne oldu?
6. **Ekran Görüntüsü**: Varsa ekleyin
7. **Ortam**: Tarayıcı, işletim sistemi vb.

## ✅ Pull Request Kontrol Listesi

PR göndermeden önce:

- [ ] Kod ESLint ve Prettier kurallarına uygun
- [ ] Tüm testler geçiyor
- [ ] Yeni testler eklendi (gerekiyorsa)
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları anlamlı
- [ ] Branch güncel (upstream/main ile)

## 🤝 Davranış Kuralları

- Saygılı ve yapıcı olun
- Farklı görüşlere açık olun
- Yardımlaşmaya istekli olun
- Profesyonel bir dil kullanın

## 📞 İletişim

Sorularınız için:
- GitHub Issues
- Proje yöneticisi ile iletişim

---

**Teşekkürler!** F-Kod projesine katkıda bulunduğunuz için minnettarız. 🙏
