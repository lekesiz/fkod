/**
 * F-KOD Developer Registration
 * Multi-step registration and onboarding flow
 */

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const DeveloperRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    taxId: ''
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/developers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    }
  });

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/developers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Verification failed');
      return response.json();
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (step) => {
    if (step < currentStep || step === currentStep + 1) {
      setCurrentStep(step);
    }
  };

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName
      });
      setCurrentStep(2);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleVerify = async () => {
    try {
      await verifyMutation.mutateAsync({
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        taxId: formData.taxId
      });
      setCurrentStep(3);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Become an F-KOD Developer</h1>
          <p className="text-lg text-muted-foreground">
            Create plugins and earn revenue by extending F-KOD
          </p>
        </div>

        {/* Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepChange(step)}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step < currentStep ? 'bg-primary text-white' :
                    step === currentStep ? 'bg-primary text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">
                      {step === 1 ? 'Registration' : step === 2 ? 'Verification' : 'Setup'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step === 1 ? 'Create account' : step === 2 ? 'Verify identity' : 'SDK setup'}
                    </p>
                  </div>
                </button>
                {step < 3 && (
                  <div className={`h-1 flex-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="p-8">
          {/* Step 1: Registration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Name (Optional)</label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="My Company"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  By registering, you agree to our Developer Terms of Service and Privacy Policy.
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleRegister}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Registering...' : 'Continue to Verification'}
              </Button>
            </div>
          )}

          {/* Step 2: Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Verify Your Identity</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-900 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900">
                  We need to verify your identity to enable payments. This information is kept secure and encrypted.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Legal Name</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zip Code</label>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Bank Account Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name</label>
                  <Input
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Bank of America"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <Input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Routing Number</label>
                    <Input
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Tax ID / SSN</label>
                  <Input
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? 'Verifying...' : 'Continue to Setup'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Setup */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold">Welcome to F-KOD Developer Program!</h2>
              
              <p className="text-muted-foreground">
                Your account has been successfully created and verified. You're now ready to start developing plugins.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold mb-4">Next Steps:</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">1.</span>
                    <span>Download the F-KOD Plugin SDK</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">2.</span>
                    <span>Read the documentation and examples</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">3.</span>
                    <span>Create your first plugin</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-blue-600">4.</span>
                    <span>Submit to marketplace for review</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  View Documentation
                </Button>
                <Button className="flex-1">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DeveloperRegistration;
