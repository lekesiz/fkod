import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (!error) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-display">Welcome Back</h1>
          <p className="text-foreground/70 mb-8">Login to your F-Kod account</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-foreground/70 mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:text-secondary transition">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
