import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';

const ARCHETYPES = [
  { code: 'HERO', label: 'The Hero' },
  { code: 'SAGE', label: 'The Sage' },
  { code: 'LOVER', label: 'The Lover' },
  { code: 'JESTER', label: 'The Jester' },
  { code: 'EVERYMAN', label: 'The Everyman' },
  { code: 'MAGICIAN', label: 'The Magician' },
  { code: 'INNOCENT', label: 'The Innocent' },
  { code: 'EXPLORER', label: 'The Explorer' },
  { code: 'OUTLAW', label: 'The Outlaw' },
  { code: 'CAREGIVER', label: 'The Caregiver' },
  { code: 'RULER', label: 'The Ruler' },
  { code: 'CREATOR', label: 'The Creator' },
];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    age: '',
    archetypeCode: '',
  });
  const { register, isLoading, error } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(
      formData.email,
      formData.name,
      formData.password,
      parseInt(formData.age),
      formData.archetypeCode
    );
    if (!error) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-display">Join F-Kod</h1>
          <p className="text-foreground/70 mb-8">Create your account and discover your fıtrat</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                placeholder="18"
                min="14"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Your Fıtrat Archetype</label>
              <select
                name="archetypeCode"
                value={formData.archetypeCode}
                onChange={handleChange}
                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                required
              >
                <option value="">Select an archetype</option>
                {ARCHETYPES.map((arch) => (
                  <option key={arch.code} value={arch.code}>
                    {arch.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-foreground/70 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-secondary transition">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
