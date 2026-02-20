import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation';
import Button from '../components/Button';

export default function Dashboard() {
  const { user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to F-Kod</h1>
          <p className="text-foreground/70 mb-8">Please login to continue</p>
          <Button onClick={() => (window.location.href = '/login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-foreground/70">
            Your fıtrat archetype: <span className="text-primary font-semibold">{user.archetype_code}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
            <div className="text-foreground/70 text-sm mb-2">Courses Enrolled</div>
            <div className="text-3xl font-bold text-primary">0</div>
          </div>
          <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
            <div className="text-foreground/70 text-sm mb-2">Learning Hours</div>
            <div className="text-3xl font-bold text-primary">0</div>
          </div>
          <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
            <div className="text-foreground/70 text-sm mb-2">Mentors Connected</div>
            <div className="text-3xl font-bold text-primary">0</div>
          </div>
          <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
            <div className="text-foreground/70 text-sm mb-2">Community Posts</div>
            <div className="text-3xl font-bold text-primary">0</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Courses */}
            <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-display">Recommended Courses</h2>
              <div className="space-y-4">
                <p className="text-foreground/70">No courses recommended yet. Start exploring!</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-display">Recent Activity</h2>
              <div className="space-y-4">
                <p className="text-foreground/70">No recent activity yet.</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 font-display">Your Profile</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-foreground/70 text-sm">Name</div>
                  <div className="text-foreground font-semibold">{user.name}</div>
                </div>
                <div>
                  <div className="text-foreground/70 text-sm">Email</div>
                  <div className="text-foreground font-semibold text-sm break-all">{user.email}</div>
                </div>
                <div>
                  <div className="text-foreground/70 text-sm">Archetype</div>
                  <div className="text-foreground font-semibold">{user.archetype_code}</div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 font-display">Quick Links</h3>
              <div className="space-y-2">
                <a href="/mentors" className="block text-primary hover:text-secondary transition">
                  → Find a Mentor
                </a>
                <a href="/courses" className="block text-primary hover:text-secondary transition">
                  → Browse Courses
                </a>
                <a href="/community" className="block text-primary hover:text-secondary transition">
                  → Join Community
                </a>
                <a href="/events" className="block text-primary hover:text-secondary transition">
                  → Upcoming Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
