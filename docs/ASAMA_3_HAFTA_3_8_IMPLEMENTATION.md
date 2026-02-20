# Aşama 3: Hafta 3-8 - Detailed Implementation

## Hafta 3: Authentication Implementation

### Login Screen
```javascript
// screens/auth/LoginScreen.js
import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button, TextInput, Card } from '../../components';
import { colors, spacing } from '../../theme';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Navigation handled by Redux state change
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
        />
        <Button
          title="Don't have account? Register"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    marginTop: spacing.lg,
  },
  error: {
    color: colors.error,
    marginVertical: spacing.sm,
  },
});
```

### Register Screen
```javascript
// screens/auth/RegisterScreen.js
export function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    archetype: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const archetypes = [
    { label: 'The Hero', value: 'hero' },
    { label: 'The Shadow', value: 'shadow' },
    // ... 12 archetypes
  ];

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(formData);
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Name"
        value={formData.name}
        onChangeText={(name) => setFormData({ ...formData, name })}
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(email) => setFormData({ ...formData, email })}
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(password) => setFormData({ ...formData, password })}
        secureTextEntry
      />
      <TextInput
        label="Age"
        value={formData.age}
        onChangeText={(age) => setFormData({ ...formData, age })}
        keyboardType="number-pad"
      />
      <PickerComponent
        label="Select Your Archetype"
        value={formData.archetype}
        onValueChange={(archetype) => setFormData({ ...formData, archetype })}
        items={archetypes}
      />
      <Button
        title="Register"
        onPress={handleRegister}
        disabled={loading}
      />
    </ScrollView>
  );
}
```

### Biometric Authentication
```javascript
// services/biometric.js
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export async function enableBiometric(userId, password) {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;

  try {
    await SecureStore.setItemAsync(`biometric_${userId}`, password);
    return true;
  } catch (error) {
    return false;
  }
}

export async function authenticateWithBiometric(userId) {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      disableDeviceFallback: false,
    });
    
    if (result.success) {
      return await SecureStore.getItemAsync(`biometric_${userId}`);
    }
    return null;
  } catch (error) {
    return null;
  }
}
```

---

## Hafta 4: Push Notifications

### Notification Setup
```javascript
// services/notifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import api from './api';

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  // Register token with backend
  await api.post('/notifications/register-token', { token });
  
  return token;
}

export function setupNotificationListeners() {
  // Handle notification when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Handle notification tap
  Notifications.addNotificationResponseReceivedListener((response) => {
    const { data } = response.notification.request.content;
    handleNotificationNavigation(data);
  });
}

function handleNotificationNavigation(data) {
  // Navigate based on notification type
  switch (data.type) {
    case 'mentor_message':
      navigation.navigate('Chat', { mentorId: data.mentorId });
      break;
    case 'course_update':
      navigation.navigate('Courses', { courseId: data.courseId });
      break;
    case 'event_reminder':
      navigation.navigate('Events', { eventId: data.eventId });
      break;
    // ... more notification types
  }
}
```

### Notification Types
```javascript
// Mentor Message Notification
{
  type: 'mentor_message',
  title: 'New message from John',
  body: 'Hey, how are you doing?',
  data: { mentorId: '123', messageId: '456' }
}

// Course Update
{
  type: 'course_update',
  title: 'New lesson available',
  body: 'Advanced React Patterns - Lesson 5',
  data: { courseId: '789', lessonId: '101' }
}

// Event Reminder
{
  type: 'event_reminder',
  title: 'Event starting soon',
  body: 'Web Development Bootcamp starts in 1 hour',
  data: { eventId: '202', startTime: '2026-06-15T14:00:00Z' }
}

// Community Mention
{
  type: 'community_mention',
  title: 'You were mentioned',
  body: 'John mentioned you in a post',
  data: { postId: '303', userId: '404' }
}

// Test Reminder
{
  type: 'test_reminder',
  title: 'Daily test available',
  body: 'Take today\'s personality test',
  data: { testId: '505' }
}
```

---

## Hafta 5: Offline Mode

### AsyncStorage Setup
```javascript
// services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // User data
  async saveUser(user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
  
  async getUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Test data
  async saveTestAnswers(testId, answers) {
    await AsyncStorage.setItem(`test_${testId}`, JSON.stringify(answers));
  },

  async getTestAnswers(testId) {
    const answers = await AsyncStorage.getItem(`test_${testId}`);
    return answers ? JSON.parse(answers) : null;
  },

  // Draft messages
  async saveDraftMessage(conversationId, message) {
    await AsyncStorage.setItem(`draft_${conversationId}`, message);
  },

  async getDraftMessage(conversationId) {
    return await AsyncStorage.getItem(`draft_${conversationId}`);
  },

  // Offline queue
  async addToOfflineQueue(action) {
    const queue = await this.getOfflineQueue();
    queue.push({ ...action, timestamp: Date.now() });
    await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
  },

  async getOfflineQueue() {
    const queue = await AsyncStorage.getItem('offline_queue');
    return queue ? JSON.parse(queue) : [];
  },

  async clearOfflineQueue() {
    await AsyncStorage.removeItem('offline_queue');
  },
};
```

### SQLite Setup
```javascript
// services/database.js
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'fkod.db',
  location: 'default',
});

export const database = {
  // Initialize tables
  async init() {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        // Courses table
        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            level TEXT,
            archetype TEXT,
            modules TEXT,
            enrolled INTEGER,
            downloaded_at TIMESTAMP
          )`,
          [],
          () => console.log('Courses table created'),
          (error) => reject(error)
        );

        // Lessons table
        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS lessons (
            id TEXT PRIMARY KEY,
            course_id TEXT,
            title TEXT,
            content TEXT,
            video_url TEXT,
            downloaded INTEGER,
            watched INTEGER,
            FOREIGN KEY(course_id) REFERENCES courses(id)
          )`,
          [],
          () => console.log('Lessons table created'),
          (error) => reject(error)
        );

        // Messages table
        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            sender_id TEXT,
            content TEXT,
            sent INTEGER,
            created_at TIMESTAMP
          )`,
          [],
          () => console.log('Messages table created'),
          (error) => reject(error)
        );
      }, reject, resolve);
    });
  },

  // Save course for offline
  async saveCourseOffline(course) {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          'INSERT INTO courses (id, title, description, level, archetype, modules, downloaded_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [course.id, course.title, course.description, course.level, course.archetype, JSON.stringify(course.modules), new Date().toISOString()],
          () => resolve(),
          (error) => reject(error)
        );
      });
    });
  },

  // Get offline courses
  async getOfflineCourses() {
    return new Promise((resolve, reject) => {
      db.transaction((txn) => {
        txn.executeSql(
          'SELECT * FROM courses WHERE downloaded_at IS NOT NULL',
          [],
          (_, result) => resolve(result.rows._array),
          (error) => reject(error)
        );
      });
    });
  },
};
```

### Offline Sync
```javascript
// services/sync.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOffline } from '../hooks/useOffline';
import { storage } from './storage';
import api from './api';

export function useOfflineSync() {
  const dispatch = useDispatch();
  const isOffline = useOffline();

  useEffect(() => {
    if (!isOffline) {
      syncOfflineData();
    }
  }, [isOffline]);

  async function syncOfflineData() {
    try {
      const queue = await storage.getOfflineQueue();
      
      for (const action of queue) {
        try {
          // Execute action
          await executeAction(action);
          // Remove from queue
          queue.splice(queue.indexOf(action), 1);
        } catch (error) {
          console.error('Sync error:', error);
        }
      }

      await storage.clearOfflineQueue();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async function executeAction(action) {
    switch (action.type) {
      case 'SEND_MESSAGE':
        return await api.post('/messages', action.payload);
      case 'CREATE_POST':
        return await api.post('/community/posts', action.payload);
      case 'COMPLETE_LESSON':
        return await api.post('/courses/complete-lesson', action.payload);
      // ... more actions
    }
  }
}
```

---

## Hafta 6: Native Features

### Camera Integration
```javascript
// services/camera.js
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  return result.assets?.[0];
}

export async function takePhoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  return result.assets?.[0];
}

export async function uploadImage(image) {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });

  return await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
```

### Location Services
```javascript
// services/location.js
import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
}

export async function startLocationTracking(callback) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  return Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 1000 },
    callback
  );
}

export async function getAddressFromCoords(latitude, longitude) {
  const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
  return addresses[0];
}
```

### Video Playback
```javascript
// components/VideoPlayer.js
import { Video } from 'expo-av';
import { View, StyleSheet } from 'react-native';

export function VideoPlayer({ source, onProgress, onLoad }) {
  const videoRef = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onProgress={onProgress}
        onLoad={onLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});
```

---

## Hafta 7: Testing & Optimization

### Unit Tests
```javascript
// __tests__/authSlice.test.js
import authSlice, { login, logout } from '../redux/slices/authSlice';

describe('authSlice', () => {
  it('should handle login', () => {
    const state = { token: null, user: null };
    const action = login({ token: 'abc123', user: { id: '1' } });
    const result = authSlice(state, action);
    expect(result.token).toBe('abc123');
  });

  it('should handle logout', () => {
    const state = { token: 'abc123', user: { id: '1' } };
    const action = logout();
    const result = authSlice(state, action);
    expect(result.token).toBeNull();
  });
});
```

### Integration Tests
```javascript
// __tests__/integration/auth.test.js
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';

describe('Authentication Flow', () => {
  it('should login successfully', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Dashboard')).toBeTruthy();
    });
  });
});
```

### Performance Optimization
```javascript
// Performance improvements
- Image optimization (compress, lazy load)
- Code splitting (separate bundles)
- Memory management (cleanup listeners)
- Bundle size optimization (tree shaking)
- Caching strategies (API responses)
```

---

## Hafta 8: App Store Deployment

### iOS Deployment
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios

# Metadata
- App Name: F-KOD
- Description: Discover your personality archetype
- Keywords: personality, archetype, mentoring, courses
- Screenshots: 5 high-quality images
- Privacy Policy: https://fkod.com/privacy
- Support URL: https://support.fkod.com
```

### Android Deployment
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android

# Metadata
- App Name: F-KOD
- Description: Discover your personality archetype
- Keywords: personality, archetype, mentoring, courses
- Screenshots: 8 high-quality images
- Privacy Policy: https://fkod.com/privacy
```

---

## Success Metrics

| Metrik | Hedef |
|--------|-------|
| App startup time | < 3s |
| Screen transition | < 500ms |
| API response | < 2s |
| Memory usage | < 200MB |
| Battery usage | < 5% per hour |
| Crash rate | < 0.1% |
| Test coverage | > 80% |
| App rating | > 4.5 stars |

---

## Sonraki Adımlar

- [ ] Aşama 4: Advanced Features
- [ ] Aşama 5: International Expansion
- [ ] Continuous monitoring & updates
- [ ] User feedback integration
- [ ] Performance optimization
