# Aşama 5: International Expansion - Detaylı Implementation Rehberi

## Hafta 1-2: Multi-Language Support & Localization

### 1. i18n Setup

```javascript
// config/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import ar from '../locales/ar.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import zh from '../locales/zh.json';
import pt from '../locales/pt.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  ar: { translation: ar },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  pt: { translation: pt },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### 2. Translation Files Structure

```json
// locales/en.json
{
  "common": {
    "welcome": "Welcome to F-KOD",
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "profile": "Profile",
    "settings": "Settings",
    "help": "Help",
    "about": "About"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "forgotPassword": "Forgot Password?",
    "dontHaveAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "invalidEmail": "Invalid email address",
    "passwordTooShort": "Password must be at least 8 characters"
  },
  "courses": {
    "allCourses": "All Courses",
    "myCourses": "My Courses",
    "courseDetails": "Course Details",
    "enroll": "Enroll",
    "enrolled": "Enrolled",
    "lessons": "Lessons",
    "progress": "Progress",
    "completed": "Completed"
  },
  "mentors": {
    "findMentor": "Find a Mentor",
    "mentorProfile": "Mentor Profile",
    "bookSession": "Book Session",
    "expertise": "Expertise",
    "availability": "Availability",
    "rating": "Rating",
    "reviews": "Reviews"
  },
  "community": {
    "posts": "Posts",
    "createPost": "Create Post",
    "comments": "Comments",
    "like": "Like",
    "share": "Share",
    "trending": "Trending",
    "recent": "Recent"
  }
}
```

### 3. Language Switcher Component

```javascript
// components/LanguageSwitcher.js
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Text } from 'react-native';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => i18n.changeLanguage(lang.code)}
          style={[
            styles.button,
            i18n.language === lang.code && styles.active,
          ]}
        >
          <Text style={styles.flag}>{lang.flag}</Text>
          <Text style={styles.name}>{lang.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

### 4. RTL Support (Arabic, Hebrew)

```javascript
// utils/rtl.js
import { I18nManager } from 'react-native';

export function setupRTL(languageCode) {
  const isRTL = ['ar', 'he'].includes(languageCode);
  I18nManager.forceRTL(isRTL);
}

// components/RTLView.js
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function RTLView({ children, style }) {
  const { i18n } = useTranslation();
  const isRTL = ['ar', 'he'].includes(i18n.language);

  return (
    <View
      style={[
        style,
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
      ]}
    >
      {children}
    </View>
  );
}
```

---

## Hafta 3-4: Regional Deployment & Infrastructure

### 1. Multi-Region Architecture

```javascript
// config/regions.js
export const regions = {
  'eu-west-1': {
    name: 'Europe (Ireland)',
    countries: ['TR', 'DE', 'FR', 'GB'],
    apiEndpoint: 'https://api-eu.fkod.com',
    cdnEndpoint: 'https://cdn-eu.fkod.com',
    database: 'postgres-eu-1.fkod.com',
    timezone: 'Europe/Istanbul',
  },
  'me-south-1': {
    name: 'Middle East (Bahrain)',
    countries: ['SA', 'AE', 'EG'],
    apiEndpoint: 'https://api-me.fkod.com',
    cdnEndpoint: 'https://cdn-me.fkod.com',
    database: 'postgres-me-1.fkod.com',
    timezone: 'Asia/Riyadh',
  },
  'us-east-1': {
    name: 'North America (Virginia)',
    countries: ['US', 'CA', 'MX'],
    apiEndpoint: 'https://api-us.fkod.com',
    cdnEndpoint: 'https://cdn-us.fkod.com',
    database: 'postgres-us-1.fkod.com',
    timezone: 'America/New_York',
  },
  'sa-east-1': {
    name: 'South America (São Paulo)',
    countries: ['BR', 'AR', 'CL'],
    apiEndpoint: 'https://api-sa.fkod.com',
    cdnEndpoint: 'https://cdn-sa.fkod.com',
    database: 'postgres-sa-1.fkod.com',
    timezone: 'America/Sao_Paulo',
  },
  'ap-south-1': {
    name: 'Asia (Mumbai)',
    countries: ['IN', 'BD', 'PK'],
    apiEndpoint: 'https://api-ap.fkod.com',
    cdnEndpoint: 'https://cdn-ap.fkod.com',
    database: 'postgres-ap-1.fkod.com',
    timezone: 'Asia/Kolkata',
  },
};

export function getRegionForCountry(countryCode) {
  for (const [region, config] of Object.entries(regions)) {
    if (config.countries.includes(countryCode)) {
      return region;
    }
  }
  return 'eu-west-1'; // Default
}
```

### 2. Database Replication

```javascript
// Database replication setup
// Primary: eu-west-1 (Ireland)
// Replicas: me-south-1, us-east-1, sa-east-1, ap-south-1

// PostgreSQL replication configuration
CREATE PUBLICATION fkod_publication FOR ALL TABLES;

-- On replica servers
CREATE SUBSCRIPTION fkod_subscription
  CONNECTION 'postgresql://user:password@primary-db:5432/fkod'
  PUBLICATION fkod_publication;
```

### 3. CDN Distribution

```javascript
// CloudFront distribution for each region
const distributions = {
  'eu-west-1': {
    domainName: 'cdn-eu.fkod.com',
    origins: ['s3-eu-west-1.amazonaws.com'],
    behaviors: [
      {
        pathPattern: '/api/*',
        targetOriginId: 'api-eu',
        compress: true,
        cachePolicy: 'Managed-CachingDisabled',
      },
      {
        pathPattern: '/videos/*',
        targetOriginId: 's3-eu',
        compress: true,
        cachePolicy: 'Managed-CachingOptimized',
      },
    ],
  },
  // ... other regions
};
```

---

## Hafta 5: Payment Gateway Integration

### 1. Multi-Currency Support

```javascript
// services/payment.js
import Stripe from '@stripe/stripe-js';

class PaymentService {
  constructor() {
    this.stripe = null;
    this.currencies = {
      'eu-west-1': 'EUR',
      'me-south-1': 'SAR',
      'us-east-1': 'USD',
      'sa-east-1': 'BRL',
      'ap-south-1': 'INR',
    };
  }

  async initialize() {
    this.stripe = await Stripe.load(process.env.STRIPE_PUBLIC_KEY);
  }

  // Get currency for region
  getCurrencyForRegion(region) {
    return this.currencies[region] || 'USD';
  }

  // Create payment intent
  async createPaymentIntent(amount, region, courseId) {
    const currency = this.getCurrencyForRegion(region);

    const response = await api.post('/payments/create-intent', {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      courseId,
      region,
    });

    return response.data;
  }

  // Process payment
  async processPayment(paymentMethodId, clientSecret, amount, currency) {
    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  }

  // Get supported payment methods by region
  getPaymentMethodsForRegion(region) {
    const methods = {
      'eu-west-1': ['card', 'sepa_debit', 'ideal', 'giropay'],
      'me-south-1': ['card', 'alipay', 'wechat_pay'],
      'us-east-1': ['card', 'ach_debit'],
      'sa-east-1': ['card', 'boleto'],
      'ap-south-1': ['card', 'upi'],
    };

    return methods[region] || ['card'];
  }
}

export const paymentService = new PaymentService();
```

### 2. Payment UI Components

```javascript
// components/PaymentForm.js
export function PaymentForm({ courseId, amount, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { region } = useContext(RegionContext);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const clientSecret = await paymentService.createPaymentIntent(
        amount,
        region,
        courseId
      );

      const result = await paymentService.processPayment(
        paymentMethod.id,
        clientSecret,
        amount,
        paymentService.getCurrencyForRegion(region)
      );

      if (result.status === 'succeeded') {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const supportedMethods = paymentService.getPaymentMethodsForRegion(region);

  return (
    <View>
      <Text>Select Payment Method</Text>
      {supportedMethods.map((method) => (
        <TouchableOpacity
          key={method}
          onPress={() => setPaymentMethod({ id: method })}
        >
          <Text>{method}</Text>
        </TouchableOpacity>
      ))}

      <Button
        title={`Pay ${paymentService.getCurrencyForRegion(region)} ${amount}`}
        onPress={handlePayment}
        disabled={loading || !paymentMethod}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
```

---

## Hafta 6: Compliance & Regulations

### 1. GDPR Compliance

```javascript
// services/compliance.js
class ComplianceService {
  // GDPR: User data export
  async exportUserData(userId) {
    const user = await api.get(`/users/${userId}`);
    const courses = await api.get(`/users/${userId}/courses`);
    const messages = await api.get(`/users/${userId}/messages`);
    const posts = await api.get(`/users/${userId}/posts`);

    return {
      user,
      courses,
      messages,
      posts,
      exportDate: new Date().toISOString(),
    };
  }

  // GDPR: Right to be forgotten
  async deleteUserData(userId) {
    // Anonymize user data
    await api.put(`/users/${userId}`, {
      name: 'Deleted User',
      email: `deleted-${userId}@fkod.com`,
      personalData: null,
    });

    // Delete related data
    await api.delete(`/users/${userId}/messages`);
    await api.delete(`/users/${userId}/posts`);
  }

  // GDPR: Consent management
  async updateConsent(userId, consents) {
    await api.put(`/users/${userId}/consents`, {
      marketing: consents.marketing,
      analytics: consents.analytics,
      thirdParty: consents.thirdParty,
      updatedAt: new Date().toISOString(),
    });
  }

  // CCPA: Data sale opt-out
  async optOutDataSale(userId) {
    await api.post(`/users/${userId}/opt-out-data-sale`);
  }

  // KVKK (Turkish): Data processing agreement
  async acceptKVKK(userId) {
    await api.post(`/users/${userId}/kvkk-consent`);
  }
}

export const complianceService = new ComplianceService();
```

### 2. Privacy Policy & Terms

```javascript
// Legal documents for each region
const legalDocuments = {
  'eu-west-1': {
    privacyPolicy: 'https://fkod.com/privacy/eu',
    termsOfService: 'https://fkod.com/terms/eu',
    cookiePolicy: 'https://fkod.com/cookies/eu',
    dataProcessingAgreement: 'https://fkod.com/dpa/eu',
  },
  'me-south-1': {
    privacyPolicy: 'https://fkod.com/privacy/me',
    termsOfService: 'https://fkod.com/terms/me',
    cookiePolicy: 'https://fkod.com/cookies/me',
  },
  'us-east-1': {
    privacyPolicy: 'https://fkod.com/privacy/us',
    termsOfService: 'https://fkod.com/terms/us',
    cookiePolicy: 'https://fkod.com/cookies/us',
  },
  // ... other regions
};
```

---

## Hafta 7: Regional Marketing & Community

### 1. Regional Mentor Recruitment

```javascript
// services/regionalMentors.js
class RegionalMentorService {
  async recruitMentors(region, count = 50) {
    const mentorRequirements = {
      'eu-west-1': {
        languages: ['en', 'tr', 'de', 'fr'],
        timezone: 'Europe/Istanbul',
        minRating: 4.5,
      },
      'me-south-1': {
        languages: ['ar', 'en'],
        timezone: 'Asia/Riyadh',
        minRating: 4.5,
      },
      'us-east-1': {
        languages: ['en', 'es'],
        timezone: 'America/New_York',
        minRating: 4.5,
      },
      // ... other regions
    };

    const requirements = mentorRequirements[region];

    // Send recruitment emails
    await this.sendRecruitmentCampaign(region, requirements, count);
  }

  async sendRecruitmentCampaign(region, requirements, count) {
    const mentors = await api.get('/mentors/candidates', {
      params: {
        region,
        languages: requirements.languages,
        minRating: requirements.minRating,
        limit: count,
      },
    });

    for (const mentor of mentors) {
      await emailService.sendRecruitmentEmail(mentor.email, {
        region,
        incentive: this.getRegionalIncentive(region),
      });
    }
  }

  getRegionalIncentive(region) {
    const incentives = {
      'eu-west-1': 'Free premium membership + €100 bonus',
      'me-south-1': 'Free premium membership + 500 SAR bonus',
      'us-east-1': 'Free premium membership + $100 bonus',
      'sa-east-1': 'Free premium membership + 500 BRL bonus',
      'ap-south-1': 'Free premium membership + ₹5000 bonus',
    };

    return incentives[region];
  }
}

export const regionalMentorService = new RegionalMentorService();
```

### 2. Regional Community Management

```javascript
// services/regionalCommunity.js
class RegionalCommunityService {
  async setupRegionalCommunity(region) {
    // Create regional community groups
    const groups = [
      {
        name: `${region} Mentors`,
        description: 'Mentors in this region',
        language: this.getRegionalLanguage(region),
      },
      {
        name: `${region} Learners`,
        description: 'Learners in this region',
        language: this.getRegionalLanguage(region),
      },
      {
        name: `${region} Events`,
        description: 'Local events and meetups',
        language: this.getRegionalLanguage(region),
      },
    ];

    for (const group of groups) {
      await api.post('/community/groups', group);
    }
  }

  async scheduleRegionalEvents(region) {
    const events = [
      {
        title: 'Monthly Mentoring Meetup',
        description: 'Monthly meetup for mentors',
        frequency: 'monthly',
        timezone: this.getRegionalTimezone(region),
      },
      {
        title: 'Weekly Learning Circle',
        description: 'Weekly learning discussion',
        frequency: 'weekly',
        timezone: this.getRegionalTimezone(region),
      },
    ];

    for (const event of events) {
      await api.post(`/events/region/${region}`, event);
    }
  }

  getRegionalLanguage(region) {
    const languages = {
      'eu-west-1': 'tr',
      'me-south-1': 'ar',
      'us-east-1': 'en',
      'sa-east-1': 'pt',
      'ap-south-1': 'en',
    };

    return languages[region];
  }

  getRegionalTimezone(region) {
    const timezones = {
      'eu-west-1': 'Europe/Istanbul',
      'me-south-1': 'Asia/Riyadh',
      'us-east-1': 'America/New_York',
      'sa-east-1': 'America/Sao_Paulo',
      'ap-south-1': 'Asia/Kolkata',
    };

    return timezones[region];
  }
}

export const regionalCommunityService = new RegionalCommunityService();
```

---

## Hafta 8: Launch & Optimization

### 1. Regional Launch Checklist

```javascript
const regionalLaunchChecklist = {
  'eu-west-1': {
    infrastructure: ['✅ Database', '✅ API', '✅ CDN'],
    localization: ['✅ Turkish', '✅ English', '✅ German', '✅ French'],
    compliance: ['✅ GDPR', '✅ KVKK', '✅ Privacy Policy'],
    payment: ['✅ Stripe', '✅ EUR Currency'],
    marketing: ['✅ Local mentors', '✅ Community groups'],
    support: ['✅ Turkish support', '✅ Email support'],
  },
  'me-south-1': {
    infrastructure: ['✅ Database', '✅ API', '✅ CDN'],
    localization: ['✅ Arabic', '✅ English'],
    compliance: ['✅ Local regulations', '✅ Privacy Policy'],
    payment: ['✅ Stripe', '✅ SAR Currency'],
    marketing: ['✅ Local mentors', '✅ Community groups'],
    support: ['✅ Arabic support', '✅ Email support'],
  },
  // ... other regions
};
```

### 2. Performance Monitoring

```javascript
// services/regionalMonitoring.js
class RegionalMonitoringService {
  async monitorRegionalPerformance(region) {
    const metrics = {
      apiLatency: await this.measureAPILatency(region),
      cdnLatency: await this.measureCDNLatency(region),
      databaseLatency: await this.measureDatabaseLatency(region),
      uptime: await this.checkUptime(region),
      errorRate: await this.getErrorRate(region),
    };

    // Alert if metrics exceed thresholds
    if (metrics.apiLatency > 500) {
      await alertService.sendAlert(`High API latency in ${region}`);
    }

    return metrics;
  }

  async measureAPILatency(region) {
    const start = Date.now();
    await api.get(`/health?region=${region}`);
    return Date.now() - start;
  }

  async measureCDNLatency(region) {
    const start = Date.now();
    await fetch(`https://cdn-${region}.fkod.com/health`);
    return Date.now() - start;
  }

  async measureDatabaseLatency(region) {
    const start = Date.now();
    await api.get(`/db-health?region=${region}`);
    return Date.now() - start;
  }

  async checkUptime(region) {
    const checks = await api.get(`/uptime/${region}`);
    return (checks.successful / checks.total) * 100;
  }

  async getErrorRate(region) {
    const errors = await api.get(`/errors/${region}`);
    return (errors.count / errors.total) * 100;
  }
}

export const regionalMonitoringService = new RegionalMonitoringService();
```

---

## 📊 International Expansion Summary

| Hafta | Aşama | Hedef |
|-------|-------|-------|
| 1-2 | Localization | 8 languages |
| 3-4 | Regional Infrastructure | 5 regions |
| 5 | Payment Integration | Multi-currency |
| 6 | Compliance | GDPR, CCPA, KVKK |
| 7 | Community Setup | Regional mentors |
| 8 | Launch & Monitoring | Go-live |

---

## 🌍 Supported Regions

1. **Europe (eu-west-1)** - Turkey, Germany, France, UK
2. **Middle East (me-south-1)** - Saudi Arabia, UAE, Egypt
3. **North America (us-east-1)** - USA, Canada, Mexico
4. **South America (sa-east-1)** - Brazil, Argentina, Chile
5. **Asia (ap-south-1)** - India, Bangladesh, Pakistan

---

## 💰 Regional Pricing

| Region | Currency | Pricing |
|--------|----------|---------|
| Europe | EUR | €9.99/month |
| Middle East | SAR | 50 SAR/month |
| North America | USD | $9.99/month |
| South America | BRL | 50 BRL/month |
| Asia | INR | 500 INR/month |

---

## 🎯 Success Metrics

- 5 regions live
- 8 languages supported
- 100+ regional mentors
- 50,000+ regional users
- 99.9% uptime per region
- < 500ms API latency
- < 100ms CDN latency

---

## Sonraki Adımlar

- Continuous monitoring
- User feedback integration
- Regional marketing campaigns
- Performance optimization
- New region expansion
