import React from 'react';
import { useAuthStore } from '../store/authStore';
import Button from './Button';
import { cn } from '../utils/cn';

export default function Navigation() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-background border-b border-foreground/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary font-display">F-Kod</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition">
              Dashboard
            </a>
            <a href="/mentors" className="text-foreground hover:text-primary transition">
              Mentors
            </a>
            <a href="/courses" className="text-foreground hover:text-primary transition">
              Courses
            </a>
            <a href="/community" className="text-foreground hover:text-primary transition">
              Community
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <a href="/profile" className="text-foreground hover:text-primary transition">
                  {user.name}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => (window.location.href = '/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="/" className="block text-foreground hover:text-primary transition py-2">
              Dashboard
            </a>
            <a href="/mentors" className="block text-foreground hover:text-primary transition py-2">
              Mentors
            </a>
            <a href="/courses" className="block text-foreground hover:text-primary transition py-2">
              Courses
            </a>
            <a href="/community" className="block text-foreground hover:text-primary transition py-2">
              Community
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
