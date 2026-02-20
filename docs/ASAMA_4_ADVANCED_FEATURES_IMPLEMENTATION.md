# Aşama 4: Advanced Features - Detaylı Implementation Rehberi

## Hafta 1-2: AI-Powered Recommendations Engine

### 1. Recommendation System Architecture

```javascript
// services/recommendations.js
import tf from '@tensorflow/tfjs';
import { loadLayersModel } from '@tensorflow/tfjs-layers';

class RecommendationEngine {
  constructor() {
    this.model = null;
    this.userEmbeddings = {};
    this.courseEmbeddings = {};
  }

  // Initialize ML model
  async initialize() {
    // Load pre-trained model
    this.model = await loadLayersModel('indexeddb://fkod-recommendation-model');
    
    if (!this.model) {
      // Create new model if not exists
      this.model = this.createModel();
      await this.model.save('indexeddb://fkod-recommendation-model');
    }
  }

  // Create neural network model
  createModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [128], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    return model;
  }

  // Get user embedding (from user profile, behavior, preferences)
  async getUserEmbedding(userId) {
    if (this.userEmbeddings[userId]) {
      return this.userEmbeddings[userId];
    }

    const user = await api.get(`/users/${userId}`);
    const embedding = this.createEmbedding(user);
    this.userEmbeddings[userId] = embedding;
    return embedding;
  }

  // Get course embedding (from course metadata, content)
  async getCourseEmbedding(courseId) {
    if (this.courseEmbeddings[courseId]) {
      return this.courseEmbeddings[courseId];
    }

    const course = await api.get(`/courses/${courseId}`);
    const embedding = this.createEmbedding(course);
    this.courseEmbeddings[courseId] = embedding;
    return embedding;
  }

  // Create embedding from data
  createEmbedding(data) {
    // Convert user/course data to 128-dimensional vector
    const vector = new Array(128).fill(0);
    
    // Extract features
    if (data.archetype) {
      vector[this.getArchetypeIndex(data.archetype)] = 1;
    }
    if (data.level) {
      vector[this.getLevelIndex(data.level)] = 1;
    }
    if (data.interests) {
      data.interests.forEach((interest, i) => {
        vector[i + 20] = 1;
      });
    }
    if (data.rating) {
      vector[50] = data.rating / 5;
    }
    if (data.completionRate) {
      vector[51] = data.completionRate;
    }

    return tf.tensor1d(vector);
  }

  // Get recommendations for user
  async getRecommendations(userId, limit = 10) {
    const userEmbedding = await this.getUserEmbedding(userId);
    const courses = await api.get('/courses');

    const scores = [];
    for (const course of courses) {
      const courseEmbedding = await this.getCourseEmbedding(course.id);
      
      // Calculate similarity using model
      const input = tf.concat([userEmbedding, courseEmbedding], 0);
      const score = this.model.predict(input.expandDims(0));
      
      scores.push({
        courseId: course.id,
        course: course,
        score: score.dataSync()[0],
      });
    }

    // Sort by score and return top N
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.course);
  }

  // Collaborative filtering
  async getCollaborativeRecommendations(userId) {
    // Find similar users
    const userEmbedding = await this.getUserEmbedding(userId);
    const allUsers = await api.get('/users');

    const similarUsers = [];
    for (const user of allUsers) {
      if (user.id === userId) continue;
      
      const otherEmbedding = await this.getUserEmbedding(user.id);
      const similarity = this.cosineSimilarity(userEmbedding, otherEmbedding);
      
      if (similarity > 0.7) {
        similarUsers.push({ userId: user.id, similarity });
      }
    }

    // Get courses from similar users
    const recommendations = {};
    for (const { userId: similarUserId } of similarUsers) {
      const userCourses = await api.get(`/users/${similarUserId}/courses`);
      
      for (const course of userCourses) {
        if (!recommendations[course.id]) {
          recommendations[course.id] = 0;
        }
        recommendations[course.id]++;
      }
    }

    return Object.entries(recommendations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([courseId]) => courseId);
  }

  // Content-based filtering
  async getContentBasedRecommendations(userId) {
    const user = await api.get(`/users/${userId}`);
    const userCourses = await api.get(`/users/${userId}/courses`);

    // Extract features from user's courses
    const features = {
      archetypes: {},
      levels: {},
      topics: {},
    };

    for (const course of userCourses) {
      features.archetypes[course.archetype] = (features.archetypes[course.archetype] || 0) + 1;
      features.levels[course.level] = (features.levels[course.level] || 0) + 1;
      course.topics?.forEach(topic => {
        features.topics[topic] = (features.topics[topic] || 0) + 1;
      });
    }

    // Find similar courses
    const allCourses = await api.get('/courses');
    const recommendations = [];

    for (const course of allCourses) {
      if (userCourses.some(c => c.id === course.id)) continue;

      let score = 0;
      if (features.archetypes[course.archetype]) {
        score += features.archetypes[course.archetype] * 0.4;
      }
      if (features.levels[course.level]) {
        score += features.levels[course.level] * 0.3;
      }
      course.topics?.forEach(topic => {
        if (features.topics[topic]) {
          score += features.topics[topic] * 0.3;
        }
      });

      if (score > 0) {
        recommendations.push({ course, score });
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.course);
  }

  // Cosine similarity
  cosineSimilarity(a, b) {
    const aData = a.dataSync();
    const bData = b.dataSync();
    
    let dotProduct = 0;
    let aMagnitude = 0;
    let bMagnitude = 0;

    for (let i = 0; i < aData.length; i++) {
      dotProduct += aData[i] * bData[i];
      aMagnitude += aData[i] * aData[i];
      bMagnitude += bData[i] * bData[i];
    }

    aMagnitude = Math.sqrt(aMagnitude);
    bMagnitude = Math.sqrt(bMagnitude);

    return dotProduct / (aMagnitude * bMagnitude);
  }

  // Train model with user feedback
  async trainModel(trainingData) {
    const inputs = tf.tensor2d(trainingData.inputs);
    const labels = tf.tensor2d(trainingData.labels);

    await this.model.fit(inputs, labels, {
      epochs: 10,
      batchSize: 32,
      verbose: 0,
    });

    await this.model.save('indexeddb://fkod-recommendation-model');
  }
}

export const recommendationEngine = new RecommendationEngine();
```

### 2. Recommendation Components

```javascript
// components/RecommendationCard.js
export function RecommendationCard({ course, onPress, reason }) {
  return (
    <Card onPress={onPress}>
      <Image source={{ uri: course.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.reason}>{reason}</Text>
        <View style={styles.footer}>
          <Rating value={course.rating} />
          <Text style={styles.price}>${course.price}</Text>
        </View>
      </View>
    </Card>
  );
}
```

### 3. Recommendation API Endpoints

```javascript
// Backend endpoints
GET /api/recommendations/personalized - Get personalized recommendations
GET /api/recommendations/trending - Get trending courses
GET /api/recommendations/similar/:courseId - Get similar courses
GET /api/recommendations/mentor-matches - Get mentor recommendations
POST /api/recommendations/feedback - Submit recommendation feedback
```

---

## Hafta 3-4: Video Streaming Platform

### 1. Video Streaming Architecture

```javascript
// services/videoStreaming.js
import { Video } from 'expo-av';
import HLS from 'hls.js';

class VideoStreamingService {
  constructor() {
    this.activeStreams = {};
    this.qualityLevels = ['360p', '480p', '720p', '1080p'];
  }

  // Adaptive bitrate streaming
  async startStream(videoId, videoRef) {
    const videoUrl = await this.getStreamUrl(videoId);
    
    // For HLS streams
    if (videoUrl.includes('.m3u8')) {
      this.setupHLS(videoUrl, videoRef);
    } else {
      // For direct video files
      videoRef.current.loadAsync({ uri: videoUrl });
    }

    this.activeStreams[videoId] = {
      startTime: Date.now(),
      watched: 0,
    };
  }

  // Setup HLS streaming
  setupHLS(streamUrl, videoRef) {
    if (HLS.isSupported()) {
      const hls = new HLS({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      // Handle quality changes
      hls.on(HLS.Events.hlsManifestParsed, () => {
        const availableLevels = hls.levels;
        console.log('Available quality levels:', availableLevels);
      });

      // Auto quality switching based on bandwidth
      hls.on(HLS.Events.hlsFragChanged, (event, data) => {
        const level = hls.currentLevel;
        console.log('Current quality level:', level);
      });
    }
  }

  // Get stream URL with quality
  async getStreamUrl(videoId, quality = 'auto') {
    const response = await api.get(`/videos/${videoId}/stream`, {
      params: { quality },
    });
    return response.data.streamUrl;
  }

  // Download video for offline viewing
  async downloadVideo(videoId, quality = '480p') {
    const videoUrl = await this.getStreamUrl(videoId, quality);
    const fileName = `video_${videoId}_${quality}.mp4`;
    
    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      FileSystem.documentDirectory + fileName,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${progress * 100}%`);
      }
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      await this.saveDownloadMetadata(videoId, uri, quality);
      return uri;
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  // Track video progress
  async trackProgress(videoId, currentTime, duration) {
    const progress = (currentTime / duration) * 100;
    
    // Save to local storage
    await storage.saveVideoProgress(videoId, {
      currentTime,
      duration,
      progress,
      lastWatched: new Date().toISOString(),
    });

    // Send to backend (when online)
    if (!isOffline) {
      await api.post(`/videos/${videoId}/progress`, {
        currentTime,
        duration,
        progress,
      });
    }
  }

  // Get video analytics
  async getVideoAnalytics(videoId) {
    return await api.get(`/videos/${videoId}/analytics`);
  }
}

export const videoStreamingService = new VideoStreamingService();
```

### 2. Video Player Component

```javascript
// components/AdvancedVideoPlayer.js
import { Video } from 'expo-av';
import { View, TouchableOpacity, Slider, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function AdvancedVideoPlayer({ videoId, videoUrl }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('720p');

  const handlePlayPause = () => {
    status.isPlaying
      ? videoRef.current.pauseAsync()
      : videoRef.current.playAsync();
  };

  const handleQualityChange = async (newQuality) => {
    setQuality(newQuality);
    const currentTime = status.positionMillis;
    const newUrl = await videoStreamingService.getStreamUrl(videoId, newQuality);
    
    await videoRef.current.loadAsync({ uri: newUrl });
    await videoRef.current.playFromPositionAsync(currentTime);
  };

  const handleDownload = async () => {
    await videoStreamingService.downloadVideo(videoId, quality);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        useNativeControls={false}
        onPlayStatusUpdate={setStatus}
        progressUpdateIntervalMillis={500}
      />

      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePlayPause}>
            <MaterialCommunityIcons
              name={status.isPlaying ? 'pause' : 'play'}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          <Slider
            style={styles.slider}
            value={status.positionMillis || 0}
            maximumValue={status.durationMillis || 0}
            onValueChange={(value) =>
              videoRef.current.setPositionAsync(value)
            }
          />

          <TouchableOpacity onPress={handleDownload}>
            <MaterialCommunityIcons name="download" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleQualityChange('1080p')}>
            <Text style={styles.quality}>{quality}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
```

### 3. Video Encoding & Delivery

```javascript
// Backend: Video processing
const AWS = require('aws-sdk');
const mediaConvert = new AWS.MediaConvert();

async function encodeVideo(videoId, sourceUrl) {
  const jobSettings = {
    Inputs: [
      {
        FileInput: sourceUrl,
        AudioSelectors: { 'Audio Selector 1': { DefaultSelection: 'DEFAULT' } },
        VideoSelector: {},
      },
    ],
    OutputGroups: [
      {
        Name: 'HLS Output',
        OutputGroupSettings: {
          Type: 'HLS_GROUP_SETTINGS',
          HlsGroupSettings: {
            Destination: `s3://fkod-videos/${videoId}/`,
            SegmentLength: 10,
            MinSegmentLength: 0,
          },
        },
        Outputs: [
          {
            NameModifier: '_1080p',
            VideoDescription: {
              Width: 1920,
              Height: 1080,
              CodecSettings: {
                Codec: 'H_264',
                H264Settings: { Bitrate: 5000 },
              },
            },
          },
          {
            NameModifier: '_720p',
            VideoDescription: {
              Width: 1280,
              Height: 720,
              CodecSettings: {
                Codec: 'H_264',
                H264Settings: { Bitrate: 2500 },
              },
            },
          },
          {
            NameModifier: '_480p',
            VideoDescription: {
              Width: 854,
              Height: 480,
              CodecSettings: {
                Codec: 'H_264',
                H264Settings: { Bitrate: 1200 },
              },
            },
          },
          {
            NameModifier: '_360p',
            VideoDescription: {
              Width: 640,
              Height: 360,
              CodecSettings: {
                Codec: 'H_264',
                H264Settings: { Bitrate: 600 },
              },
            },
          },
        ],
      },
    ],
  };

  const result = await mediaConvert.createJob({ JobSettings: jobSettings }).promise();
  return result.Job.Id;
}
```

---

## Hafta 5-6: Live Mentoring Sessions

### 1. WebRTC Setup

```javascript
// services/liveSession.js
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';

class LiveSessionService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
  }

  // Initialize WebRTC connection
  async initializePeerConnection() {
    const configuration = {
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(event.candidate);
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState);
    };
  }

  // Start local stream
  async startLocalStream() {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      });

      this.localStream = stream;

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, stream);
      });

      return stream;
    } catch (error) {
      console.error('Failed to get user media:', error);
    }
  }

  // Create offer
  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  // Handle answer
  async handleAnswer(answer) {
    const remoteDescription = new RTCSessionDescription(answer);
    await this.peerConnection.setRemoteDescription(remoteDescription);
  }

  // Handle ICE candidate
  async handleIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  // Send ICE candidate via signaling server
  async sendIceCandidate(candidate) {
    await api.post('/sessions/ice-candidate', { candidate });
  }

  // Stop session
  async stopSession() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.close();
  }
}

export const liveSessionService = new LiveSessionService();
```

### 2. Live Session Screen

```javascript
// screens/LiveSessionScreen.js
export function LiveSessionScreen({ sessionId, mentorId }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    initializeSession();
    return () => endSession();
  }, []);

  const initializeSession = async () => {
    await liveSessionService.initializePeerConnection();
    const stream = await liveSessionService.startLocalStream();
    setLocalStream(stream);

    // Connect to signaling server
    const offer = await liveSessionService.createOffer();
    await api.post(`/sessions/${sessionId}/offer`, { offer });
  };

  const startRecording = async () => {
    // Record session for playback
    setIsRecording(true);
    // Implementation for recording
  };

  const endSession = async () => {
    await liveSessionService.stopSession();
    await api.post(`/sessions/${sessionId}/end`);
  };

  return (
    <View style={styles.container}>
      <RTCView streamURL={remoteStream?.toURL()} style={styles.remoteVideo} />
      <RTCView streamURL={localStream?.toURL()} style={styles.localVideo} />
      
      <View style={styles.controls}>
        <Button title="Record" onPress={startRecording} />
        <Button title="End Session" onPress={endSession} />
      </View>
    </View>
  );
}
```

---

## Hafta 7: Advanced Analytics Dashboard

### 1. Analytics Data Collection

```javascript
// services/analytics.js
import { Analytics } from '@segment/analytics-react-native';

class AnalyticsService {
  constructor() {
    this.analytics = new Analytics({
      writeKey: process.env.SEGMENT_WRITE_KEY,
    });
  }

  // Track user events
  trackEvent(eventName, properties) {
    this.analytics.track(eventName, properties);
  }

  // Track screen views
  trackScreen(screenName, properties) {
    this.analytics.screen(screenName, properties);
  }

  // Track user properties
  identifyUser(userId, traits) {
    this.analytics.identify(userId, traits);
  }

  // Custom events
  trackCourseStarted(courseId, userId) {
    this.trackEvent('Course Started', { courseId, userId });
  }

  trackLessonCompleted(courseId, lessonId, timeSpent) {
    this.trackEvent('Lesson Completed', { courseId, lessonId, timeSpent });
  }

  trackMentorSessionBooked(mentorId, sessionDuration) {
    this.trackEvent('Mentor Session Booked', { mentorId, sessionDuration });
  }

  trackCommunityPostCreated(postId, archetype) {
    this.trackEvent('Community Post Created', { postId, archetype });
  }

  trackTestCompleted(testId, score, archetype) {
    this.trackEvent('Test Completed', { testId, score, archetype });
  }
}

export const analyticsService = new AnalyticsService();
```

### 2. Analytics Dashboard Components

```javascript
// components/AnalyticsDashboard.js
export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const data = await api.get('/analytics/dashboard');
    setAnalytics(data);
  };

  return (
    <ScrollView>
      {/* User Metrics */}
      <MetricCard
        title="Active Users"
        value={analytics?.activeUsers}
        change={analytics?.userGrowth}
      />

      {/* Course Metrics */}
      <MetricCard
        title="Courses Completed"
        value={analytics?.coursesCompleted}
        change={analytics?.completionRate}
      />

      {/* Mentor Metrics */}
      <MetricCard
        title="Mentor Sessions"
        value={analytics?.mentorSessions}
        change={analytics?.sessionGrowth}
      />

      {/* Community Metrics */}
      <MetricCard
        title="Community Posts"
        value={analytics?.communityPosts}
        change={analytics?.postGrowth}
      />

      {/* Charts */}
      <LineChart
        data={analytics?.userGrowthChart}
        title="User Growth"
      />
      
      <BarChart
        data={analytics?.courseCompletionChart}
        title="Course Completion"
      />

      <PieChart
        data={analytics?.archetypeDistribution}
        title="Archetype Distribution"
      />
    </ScrollView>
  );
}
```

---

## Hafta 8: Gamification System

### 1. Gamification Models

```javascript
// models/gamification.js
const gamificationSchema = {
  // Points system
  points: {
    courseCompletion: 100,
    lessonCompletion: 10,
    testCompletion: 50,
    communityPost: 5,
    mentorSession: 25,
    eventAttendance: 15,
  },

  // Badges
  badges: [
    {
      id: 'first-course',
      name: 'First Step',
      description: 'Complete your first course',
      icon: 'medal',
      points: 50,
    },
    {
      id: 'mentor-master',
      name: 'Mentor Master',
      description: 'Complete 10 mentor sessions',
      icon: 'star',
      points: 200,
    },
    {
      id: 'community-leader',
      name: 'Community Leader',
      description: 'Create 50 community posts',
      icon: 'crown',
      points: 300,
    },
    {
      id: 'archetype-expert',
      name: 'Archetype Expert',
      description: 'Learn about all 12 archetypes',
      icon: 'book',
      points: 250,
    },
  ],

  // Levels
  levels: [
    { level: 1, minPoints: 0, maxPoints: 500, title: 'Novice' },
    { level: 2, minPoints: 500, maxPoints: 1000, title: 'Explorer' },
    { level: 3, minPoints: 1000, maxPoints: 2000, title: 'Learner' },
    { level: 4, minPoints: 2000, maxPoints: 5000, title: 'Master' },
    { level: 5, minPoints: 5000, maxPoints: Infinity, title: 'Legend' },
  ],

  // Leaderboards
  leaderboards: {
    global: 'Global Leaderboard',
    archetype: 'Archetype Leaderboard',
    monthly: 'Monthly Challenge',
    weekly: 'Weekly Challenge',
  },
};
```

### 2. Gamification Service

```javascript
// services/gamification.js
class GamificationService {
  async awardPoints(userId, action, points) {
    const user = await api.get(`/users/${userId}`);
    const newPoints = user.totalPoints + points;

    await api.put(`/users/${userId}`, {
      totalPoints: newPoints,
      level: this.calculateLevel(newPoints),
    });

    // Check for badge unlocks
    await this.checkBadges(userId, action);

    return { newPoints, level: this.calculateLevel(newPoints) };
  }

  async checkBadges(userId, action) {
    const user = await api.get(`/users/${userId}`);
    const unlockedBadges = [];

    // Check each badge condition
    if (action === 'courseCompletion' && user.coursesCompleted === 1) {
      unlockedBadges.push('first-course');
    }
    if (action === 'mentorSession' && user.mentorSessions === 10) {
      unlockedBadges.push('mentor-master');
    }
    if (action === 'communityPost' && user.communityPosts === 50) {
      unlockedBadges.push('community-leader');
    }

    // Award badges
    for (const badge of unlockedBadges) {
      await api.post(`/users/${userId}/badges`, { badgeId: badge });
    }

    return unlockedBadges;
  }

  calculateLevel(points) {
    for (const level of gamificationSchema.levels) {
      if (points >= level.minPoints && points < level.maxPoints) {
        return level.level;
      }
    }
    return 5;
  }

  async getLeaderboard(type = 'global', limit = 100) {
    return await api.get(`/leaderboards/${type}?limit=${limit}`);
  }

  async getUserRank(userId, leaderboardType = 'global') {
    return await api.get(`/leaderboards/${leaderboardType}/rank/${userId}`);
  }
}

export const gamificationService = new GamificationService();
```

### 3. Gamification UI Components

```javascript
// components/GamificationCard.js
export function GamificationCard({ user }) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.level}>Level {user.level}</Text>
        <Text style={styles.title}>{user.levelTitle}</Text>
      </View>

      <View style={styles.progress}>
        <ProgressBar
          value={user.pointsInLevel}
          maxValue={user.pointsToNextLevel}
        />
        <Text>{user.totalPoints} points</Text>
      </View>

      <View style={styles.badges}>
        {user.badges.map((badge) => (
          <BadgeIcon key={badge.id} badge={badge} />
        ))}
      </View>

      <Button
        title="View Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
      />
    </Card>
  );
}

// components/LeaderboardScreen.js
export function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await gamificationService.getLeaderboard('global');
    setLeaderboard(data);

    const rank = await gamificationService.getUserRank(userId);
    setUserRank(rank);
  };

  return (
    <FlatList
      data={leaderboard}
      renderItem={({ item, index }) => (
        <LeaderboardRow
          rank={index + 1}
          user={item}
          isCurrentUser={item.id === userId}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## 📊 Advanced Features Summary

| Feature | Teknoloji | Timeline |
|---------|-----------|----------|
| AI Recommendations | TensorFlow.js | Hafta 1-2 |
| Video Streaming | HLS/DASH | Hafta 3-4 |
| Live Mentoring | WebRTC | Hafta 5-6 |
| Advanced Analytics | Segment/Mixpanel | Hafta 7 |
| Gamification | Custom System | Hafta 8 |

---

## 🎯 Success Metrics

- Recommendation accuracy: > 85%
- Video streaming uptime: > 99.9%
- Live session quality: > 4.5/5
- Analytics latency: < 5 seconds
- Gamification engagement: > 70%

---

## Sonraki Adımlar

- Aşama 5: International Expansion
- Continuous monitoring & optimization
- User feedback integration
- Performance tuning
