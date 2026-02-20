# Aşama 3: Mobil Uygulama - Mimarisi ve Teknik Spesifikasyon

## 1. Genel Bakış

**Framework:** React Native + Expo  
**Platforms:** iOS (14+) ve Android (8+)  
**State Management:** Redux Toolkit  
**API Client:** Axios + Redux Thunk  
**Local Storage:** AsyncStorage + SQLite  
**Push Notifications:** Expo Notifications + Firebase Cloud Messaging  
**Navigation:** React Navigation  
**UI Components:** React Native Paper + Custom Components  

---

## 2. Proje Yapısı

```
fkod-mobile/
├── app/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── OnboardingScreen.js
│   │   ├── home/
│   │   │   ├── HomeScreen.js
│   │   │   ├── DashboardScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── test/
│   │   │   ├── TestScreen.js
│   │   │   ├── QuestionScreen.js
│   │   │   └── ResultScreen.js
│   │   ├── mentor/
│   │   │   ├── MentorListScreen.js
│   │   │   ├── MentorDetailScreen.js
│   │   │   ├── ChatScreen.js
│   │   │   └── MatchingScreen.js
│   │   ├── courses/
│   │   │   ├── CoursesScreen.js
│   │   │   ├── CourseDetailScreen.js
│   │   │   ├── LessonScreen.js
│   │   │   └── ProgressScreen.js
│   │   ├── community/
│   │   │   ├── CommunityScreen.js
│   │   │   ├── PostDetailScreen.js
│   │   │   ├── CreatePostScreen.js
│   │   │   └── CommentScreen.js
│   │   └── events/
│   │       ├── EventsScreen.js
│   │       ├── EventDetailScreen.js
│   │       └── EventMapScreen.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   ├── Modal.js
│   │   │   └── Loading.js
│   │   ├── mentor/
│   │   │   ├── MentorCard.js
│   │   │   ├── ChatBubble.js
│   │   │   └── MatchingCard.js
│   │   ├── course/
│   │   │   ├── CourseCard.js
│   │   │   ├── ProgressBar.js
│   │   │   └── VideoPlayer.js
│   │   └── community/
│   │       ├── PostCard.js
│   │       ├── CommentItem.js
│   │       └── ReactionBar.js
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── MainNavigator.js
│   │   └── LinkingConfiguration.js
│   ├── redux/
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── mentorSlice.js
│   │   │   ├── courseSlice.js
│   │   │   ├── communitySlice.js
│   │   │   └── notificationSlice.js
│   │   └── thunks/
│   │       ├── authThunks.js
│   │       ├── userThunks.js
│   │       ├── mentorThunks.js
│   │       ├── courseThunks.js
│   │       └── communityThunks.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── mentorService.js
│   │   ├── courseService.js
│   │   ├── communityService.js
│   │   ├── notificationService.js
│   │   ├── storageService.js
│   │   └── offlineService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── logger.js
│   ├── styles/
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── theme.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useMentor.js
│   │   ├── useCourse.js
│   │   ├── useCommunity.js
│   │   ├── useNotification.js
│   │   └── useOffline.js
│   ├── App.js
│   └── index.js
├── app.json
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

## 3. Core Features

### 3.1 Authentication
- Email/Password login
- Social login (Google, Apple)
- Biometric authentication (Face ID, Touch ID)
- Token refresh
- Logout
- Password reset

### 3.2 User Profile
- Profile view/edit
- Archetype display
- Progress tracking
- Certificate display
- Settings management
- Notification preferences

### 3.3 Test Taking
- Offline test support
- Progress saving
- Time tracking
- Result calculation
- Report generation
- Share results

### 3.4 Mentor System
- Mentor search/filter
- Mentor profile view
- Real-time messaging
- Mentor matching
- Rating/review
- Availability management

### 3.5 Courses
- Course browsing
- Course enrollment
- Video streaming
- Progress tracking
- Certificate issuance
- Offline video download

### 3.6 Community
- Post creation
- Comments
- Likes/reactions
- Post search
- User profiles
- Notifications

### 3.7 Events
- Event listing
- Event details
- Event registration
- Map integration
- Reminders
- Attendee list

### 3.8 Push Notifications
- Test reminders
- Mentor messages
- Course updates
- Event notifications
- Community mentions
- System alerts

---

## 4. Technical Stack

### Frontend
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
  "axios": "^1.x",
  "redux-thunk": "^2.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "react-native-sqlite-storage": "^6.x",
  "expo-notifications": "^0.x",
  "expo-camera": "^13.x",
  "expo-location": "^16.x",
  "expo-video": "^1.x",
  "react-native-maps": "^1.x",
  "react-native-gesture-handler": "^2.x",
  "react-native-reanimated": "^3.x",
  "react-native-screens": "^3.x"
}
```

---

## 5. API Integration

### Base URL
```
Development: http://localhost:3000/api
Production: https://api.fkod.com/api
```

### Authentication Headers
```
Authorization: Bearer {token}
Content-Type: application/json
X-App-Version: 1.0.0
X-Device-Id: {device-id}
```

### API Endpoints (Existing from Web)
- All 76 endpoints from web API
- Mobile-specific optimizations
- Pagination support
- Caching strategies

---

## 6. State Management (Redux)

### Auth Slice
```javascript
{
  token: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    name: string,
    archetype_code: string,
    is_mentor: boolean,
    is_admin: boolean
  },
  isLoading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

### User Slice
```javascript
{
  profile: {
    id: string,
    email: string,
    name: string,
    age: number,
    archetype_code: string,
    bio: string,
    avatar_url: string,
    created_at: string
  },
  stats: {
    tests_taken: number,
    courses_completed: number,
    mentors_matched: number,
    community_posts: number
  },
  isLoading: boolean,
  error: string | null
}
```

### Mentor Slice
```javascript
{
  mentors: [
    {
      id: string,
      user_id: string,
      expertise: string[],
      bio: string,
      rating: number,
      availability: string,
      hourly_rate: number
    }
  ],
  selectedMentor: object | null,
  matches: [
    {
      id: string,
      mentor_id: string,
      status: string,
      created_at: string
    }
  ],
  isLoading: boolean,
  error: string | null
}
```

---

## 7. Local Storage Strategy

### AsyncStorage (Key-Value)
```javascript
{
  'auth_token': string,
  'refresh_token': string,
  'user_id': string,
  'user_profile': JSON,
  'notification_settings': JSON,
  'app_settings': JSON,
  'last_sync': timestamp,
  'offline_queue': JSON
}
```

### SQLite (Structured Data)
```sql
-- Offline test data
CREATE TABLE offline_tests (
  id TEXT PRIMARY KEY,
  test_data JSON,
  answers JSON,
  completed_at TIMESTAMP,
  synced BOOLEAN
);

-- Offline courses
CREATE TABLE offline_courses (
  id TEXT PRIMARY KEY,
  course_data JSON,
  lessons JSON,
  downloaded_at TIMESTAMP
);

-- Offline messages
CREATE TABLE offline_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  message_data JSON,
  sent_at TIMESTAMP,
  synced BOOLEAN
);

-- Offline posts
CREATE TABLE offline_posts (
  id TEXT PRIMARY KEY,
  post_data JSON,
  created_at TIMESTAMP,
  synced BOOLEAN
);
```

---

## 8. Push Notifications

### Setup
```javascript
// Expo Notifications + Firebase Cloud Messaging
import * as Notifications from 'expo-notifications';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

### Notification Types
1. **Test Reminders** - Scheduled daily
2. **Mentor Messages** - Real-time
3. **Course Updates** - New lessons
4. **Event Notifications** - Upcoming events
5. **Community Mentions** - Post replies
6. **System Alerts** - Important updates

### Deep Linking
```javascript
// Handle notification tap
Notifications.addNotificationResponseReceivedListener(response => {
  const { data } = response.notification.request.content;
  
  if (data.type === 'mentor_message') {
    navigation.navigate('Chat', { mentorId: data.mentor_id });
  } else if (data.type === 'course_update') {
    navigation.navigate('CourseDetail', { courseId: data.course_id });
  }
  // ... more types
});
```

---

## 9. Offline Mode

### Offline Detection
```javascript
import NetInfo from '@react-native-community/netinfo';

const useOffline = () => {
  const [isOffline, setIsOffline] = useState(false);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    
    return unsubscribe;
  }, []);
  
  return isOffline;
};
```

### Offline Queue
```javascript
// Store failed requests in queue
const offlineQueue = [
  {
    id: 'req-1',
    method: 'POST',
    url: '/api/community/posts',
    data: { content: 'My post' },
    timestamp: Date.now(),
    retries: 0
  },
  // ... more requests
];

// Sync when online
const syncOfflineQueue = async () => {
  for (const request of offlineQueue) {
    try {
      await api[request.method.toLowerCase()](
        request.url,
        request.data
      );
      // Remove from queue
    } catch (error) {
      request.retries++;
      if (request.retries > 3) {
        // Remove after 3 retries
      }
    }
  }
};
```

---

## 10. Native Features

### Camera
```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  
  if (!result.cancelled) {
    // Upload image
    uploadProfilePicture(result.uri);
  }
};
```

### Location
```javascript
import * as Location from 'expo-location';

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;
  
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
};
```

### Maps
```javascript
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  {events.map(event => (
    <Marker
      key={event.id}
      coordinate={{
        latitude: event.latitude,
        longitude: event.longitude,
      }}
      title={event.name}
    />
  ))}
</MapView>
```

### Video Playback
```javascript
import { Video } from 'expo-av';

<Video
  source={{ uri: videoUrl }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="contain"
  useNativeControls
  style={{ width: '100%', height: 300 }}
/>
```

---

## 11. Performance Optimization

### Image Optimization
```javascript
import { Image } from 'react-native';

// Use optimized image sizes
<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
  cache="force-cache"
/>
```

### Code Splitting
```javascript
// Lazy load screens
const CourseDetailScreen = lazy(() => 
  import('./screens/courses/CourseDetailScreen')
);
```

### Memory Management
```javascript
// Clean up subscriptions
useEffect(() => {
  const subscription = eventEmitter.subscribe('event', handler);
  
  return () => {
    subscription.remove();
  };
}, []);
```

---

## 12. Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Tests
```bash
npm run test:performance
```

---

## 13. App Store Deployment

### iOS
1. Create Apple Developer account
2. Create App ID
3. Create certificates & provisioning profiles
4. Build with EAS
5. Submit to App Store
6. Wait for review (1-3 days)

### Android
1. Create Google Play Developer account
2. Create app listing
3. Build with EAS
4. Submit to Google Play
5. Wait for review (2-4 hours)

---

## 14. Timeline

| Hafta | Aşama | Durum |
|-------|-------|-------|
| 1 | Architecture & Setup | ⏳ |
| 2 | Core Components | ⏳ |
| 3 | Authentication | ⏳ |
| 4 | Push Notifications | ⏳ |
| 5 | Offline Mode | ⏳ |
| 6 | Native Features | ⏳ |
| 7 | Testing & Optimization | ⏳ |
| 8 | App Store Deployment | ⏳ |

---

## 15. Success Criteria

- [x] Architecture designed
- [ ] Project setup completed
- [ ] Core components built
- [ ] Authentication implemented
- [ ] Push notifications working
- [ ] Offline mode functional
- [ ] Native features integrated
- [ ] All tests passing
- [ ] Performance optimized
- [ ] App Store ready
- [ ] Google Play ready
- [ ] Documentation complete

---

## 16. Sonraki Adımlar

1. React Native project oluştur
2. Expo setup yap
3. Redux store konfigüre et
4. Navigation yapısını kur
5. Core components geliştir
6. API integration yap
7. Push notifications kur
8. Offline mode ekle
9. Native features ekle
10. Testing yap
11. Performance optimize et
12. App Store'a gönder
