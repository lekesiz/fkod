# Aşama 3: Hafta 1-2 - React Native Project Setup

## Tamamlanan İşler

### Hafta 1: Architecture & Project Setup
- ✅ React Native + Expo kurulumu
- ✅ Project structure oluşturma
- ✅ Redux store konfigürasyonu
- ✅ Navigation setup (React Navigation)
- ✅ Theme ve styling sistemi
- ✅ API client setup (Axios)
- ✅ Environment configuration
- ✅ Git repository setup

### Hafta 2: Core Components
- ✅ Common components (Button, Card, Input, Modal)
- ✅ Navigation components (Header, TabBar)
- ✅ Layout components (SafeAreaView, ScrollView)
- ✅ Form components (TextInput, Picker, DatePicker)
- ✅ List components (FlatList, SectionList)
- ✅ Image components (Avatar, ImageCard)
- ✅ Loading & Error components
- ✅ Custom hooks (useAuth, useUser, useOffline)

## Teknoloji Stack

```json
{
  "react-native": "^0.73.0",
  "expo": "^50.0.0",
  "react-navigation": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-navigation/native": "^6.x",
  "@react-navigation/stack": "^6.x",
  "react-native-paper": "^5.x",
  "redux": "^4.x",
  "@reduxjs/toolkit": "^1.x",
  "react-redux": "^8.x",
  "axios": "^1.x"
}
```

## Proje Yapısı

```
fkod-mobile/
├── app/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── redux/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   ├── hooks/
│   ├── App.js
│   └── index.js
├── app.json
├── package.json
├── .env
└── README.md
```

## Redux Store

```javascript
store.js
├── slices/
│   ├── authSlice.js
│   ├── userSlice.js
│   ├── mentorSlice.js
│   ├── courseSlice.js
│   ├── communitySlice.js
│   └── notificationSlice.js
└── thunks/
    ├── authThunks.js
    ├── userThunks.js
    └── ...
```

## Navigation Structure

```
RootNavigator
├── AuthNavigator (Login, Register, Onboarding)
└── MainNavigator
    ├── HomeStack
    │   ├── Home
    │   ├── Dashboard
    │   └── Profile
    ├── TestStack
    │   ├── Test
    │   ├── Question
    │   └── Result
    ├── MentorStack
    │   ├── MentorList
    │   ├── MentorDetail
    │   ├── Chat
    │   └── Matching
    ├── CourseStack
    │   ├── Courses
    │   ├── CourseDetail
    │   ├── Lesson
    │   └── Progress
    ├── CommunityStack
    │   ├── Community
    │   ├── PostDetail
    │   ├── CreatePost
    │   └── Comments
    └── EventStack
        ├── Events
        ├── EventDetail
        └── EventMap
```

## Styling System

```javascript
colors.js
- Primary: #a855f7 (Purple)
- Secondary: #ec4899 (Pink)
- Accent: #06b6d4 (Cyan)
- Background: #1e293b (Dark)
- Foreground: #f1f5f9 (Light)

typography.js
- Display: Playfair Display
- Body: Poppins

spacing.js
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

theme.js
- Dark theme (default)
- Light theme (optional)
```

## API Integration

```javascript
api.js
- Base URL: https://api.fkod.com/api
- Interceptors: Auth, Error handling
- Request/Response transformation
- Timeout: 30s
- Retry logic: 3 retries
```

## Sonraki Adımlar

- [ ] Hafta 3: Authentication implementation
- [ ] Hafta 4: Push notifications
- [ ] Hafta 5: Offline mode
- [ ] Hafta 6: Native features
- [ ] Hafta 7: Testing & optimization
- [ ] Hafta 8: App Store deployment
