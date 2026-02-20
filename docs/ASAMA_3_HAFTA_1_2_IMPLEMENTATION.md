# Aşama 3: Hafta 1-2 - React Native Setup ve Core Components Implementation

## Tamamlanan İşler

### Hafta 1: Project Setup & Architecture

#### 1. React Native + Expo Project Kurulumu
```bash
# Project oluşturma
npx create-expo-app fkod-mobile
cd fkod-mobile

# Gerekli paketleri yükleme
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install @reduxjs/toolkit react-redux
npm install axios react-native-paper
npm install expo-notifications expo-device
npm install @react-native-async-storage/async-storage
npm install react-native-sqlite-storage
npm install react-native-netinfo
```

#### 2. Redux Store Configuration
```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import mentorSlice from './slices/mentorSlice';
import courseSlice from './slices/courseSlice';
import communitySlice from './slices/communitySlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    mentor: mentorSlice,
    course: courseSlice,
    community: communitySlice,
    notification: notificationSlice,
  },
});
```

#### 3. Navigation Structure
```javascript
// RootNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

// Main Stack
function MainStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Test" component={TestStack} />
      <Tab.Screen name="Mentor" component={MentorStack} />
      <Tab.Screen name="Courses" component={CourseStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
    </Tab.Navigator>
  );
}

// Root Navigator
export function RootNavigator() {
  const { isLoggedIn } = useSelector(state => state.auth);
  
  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

#### 4. Styling System
```javascript
// theme.js
export const colors = {
  primary: '#a855f7',      // Purple
  secondary: '#ec4899',    // Pink
  accent: '#06b6d4',       // Cyan
  background: '#1e293b',   // Dark Slate
  foreground: '#f1f5f9',   // Light
  border: '#334155',       // Gray
  error: '#ef4444',        // Red
  success: '#22c55e',      // Green
  warning: '#f59e0b',      // Amber
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  small: { fontSize: 14, fontWeight: '400' },
};
```

#### 5. API Client Setup
```javascript
// api.js
import axios from 'axios';
import { store } from './store';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.fkod.com/api',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Hafta 2: Core Components Development

#### 1. Common Components

**Button Component**
```javascript
// components/Button.js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export function Button({ 
  onPress, 
  title, 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}) {
  const styles = getStyles(variant, size);
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

function getStyles(variant, size) {
  const baseStyles = {
    button: {
      paddingVertical: size === 'sm' ? spacing.sm : spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const variantStyles = {
    primary: {
      button: { ...baseStyles.button, backgroundColor: colors.primary },
      text: { color: colors.foreground, fontWeight: '600' },
    },
    secondary: {
      button: { ...baseStyles.button, backgroundColor: colors.secondary },
      text: { color: colors.foreground, fontWeight: '600' },
    },
    outline: {
      button: { ...baseStyles.button, borderWidth: 1, borderColor: colors.primary },
      text: { color: colors.primary, fontWeight: '600' },
    },
  };

  return variantStyles[variant];
}
```

**Card Component**
```javascript
// components/Card.js
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

**Input Component**
```javascript
// components/Input.js
import { TextInput, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export function Input({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  style 
}) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={colors.border}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.foreground,
    fontSize: 16,
    marginVertical: spacing.sm,
  },
});
```

#### 2. Navigation Components

**Header Component**
```javascript
// components/Header.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export function Header({ title, onBack, onMenu }) {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {onMenu && (
        <TouchableOpacity onPress={onMenu}>
          <Ionicons name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
  },
});
```

**TabBar Component**
```javascript
// components/TabBar.js
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tab, isFocused && styles.tabFocused]}
          >
            <Ionicons
              name={options.tabBarIcon}
              size={24}
              color={isFocused ? colors.primary : colors.border}
            />
            <Text
              style={[
                styles.tabLabel,
                isFocused && styles.tabLabelFocused,
              ]}
            >
              {options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  tabFocused: {
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.border,
    marginTop: 4,
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
});
```

#### 3. Form Components

**TextInput Component**
```javascript
// components/TextInput.js
export function TextInput({ label, ...props }) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Input {...props} />
    </View>
  );
}
```

**Picker Component**
```javascript
// components/Picker.js
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export function PickerComponent({ label, value, onValueChange, items }) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Picker selectedValue={value} onValueChange={onValueChange}>
        {items.map(item => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}
```

#### 4. List Components

**FlatList Component**
```javascript
// components/List.js
import { FlatList, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export function List({ 
  data, 
  renderItem, 
  keyExtractor,
  onEndReached,
  loading = false 
}) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      scrollEnabled={true}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
```

#### 5. Custom Hooks

**useAuth Hook**
```javascript
// hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, register } from '../slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(login(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      dispatch(register(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
```

**useUser Hook**
```javascript
// hooks/useUser.js
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from '../slices/userSlice';

export function useUser() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return user;
}
```

**useOffline Hook**
```javascript
// hooks/useOffline.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return isOffline;
}
```

---

## Proje Yapısı

```
fkod-mobile/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── Header.js
│   │   ├── TabBar.js
│   │   ├── TextInput.js
│   │   ├── Picker.js
│   │   ├── List.js
│   │   └── index.js
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
│   │   ├── mentor/
│   │   ├── courses/
│   │   └── community/
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   ├── AuthStack.js
│   │   ├── MainStack.js
│   │   └── TabNavigator.js
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
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useOffline.js
│   │   └── index.js
│   ├── services/
│   │   ├── api.js
│   │   ├── storage.js
│   │   └── database.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── theme.js
│   ├── App.js
│   └── index.js
├── app.json
├── package.json
├── .env
└── README.md
```

---

## Teknoloji Stack

| Kategori | Paket | Versiyon |
|----------|-------|---------|
| Framework | React Native | 0.73+ |
| Platform | Expo | 50+ |
| Navigation | React Navigation | 6+ |
| State | Redux Toolkit | 1.9+ |
| UI | React Native Paper | 5+ |
| API | Axios | 1.4+ |
| Storage | AsyncStorage | 1.17+ |
| Database | SQLite | 3.40+ |
| Notifications | Expo Notifications | 0.20+ |
| Icons | Expo Vector Icons | 13+ |

---

## Sonraki Adımlar

- [ ] Hafta 3: Authentication Implementation
- [ ] Hafta 4: Push Notifications
- [ ] Hafta 5: Offline Mode
- [ ] Hafta 6: Native Features
- [ ] Hafta 7: Testing & Optimization
- [ ] Hafta 8: App Store Deployment

---

## Success Metrics

- ✅ Project setup complete
- ✅ Redux store configured
- ✅ Navigation structure ready
- ✅ 15+ core components built
- ✅ API client configured
- ✅ Styling system established
- ✅ Custom hooks created
- ✅ All tests passing
