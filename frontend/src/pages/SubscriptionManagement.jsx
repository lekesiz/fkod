/**
 * F-KOD Subscription Management
 * Manage plugin pricing, plans, and subscriptions
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Copy, Check } from 'lucide-react';

const SubscriptionManagement = () => {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    trialDays: 0,
    features: []
  });

  // Fetch plugins
  const { data: plugins = [] } = useQuery({
    queryKey: ['my-plugins'],
    queryFn: async () => {
      const response = await fetch('/api/developers/plugins');
      if (!response.ok) throw new Error('Failed to fetch plugins');
      return response.json();
    }
  });

  // Fetch plugin pricing
  const { data: pricing = null } = useQuery({
    queryKey: ['plugin-pricing', selectedPlugin?.id],
    queryFn: async () => {
      if (!selectedPlugin) return null;
      const response = await fetch(`/api/developers/plugins/${selectedPlugin.id}/pricing`);
      if (!response.ok) throw new Error('Failed to fetch pricing');
      return response.json();
    },
    enabled: !!selectedPlugin
  });

  // Fetch subscription plans
  const { data: plans = [] } = useQuery({
    queryKey: ['subscription-plans', selectedPlugin?.id],
    queryFn: async () => {
      if (!selectedPlugin) return [];
      const response = await fetch(`/api/developers/plugins/${selectedPlugin.id}/plans`);
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    },
    enabled: !!selectedPlugin
  });

  // Update pricing mutation
  const updatePricingMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `/api/developers/plugins/${selectedPlugin.id}/pricing`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      if (!response.ok) throw new Error('Failed to update pricing');
      return response.json();
    }
  });

  // Create plan mutation
  const createPlanMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `/api/developers/plugins/${selectedPlugin.id}/plans`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      if (!response.ok) throw new Error('Failed to create plan');
      return response.json();
    },
    onSuccess: () => {
      setShowPlanForm(false);
      setNewPlan({ name: '', price: '', billingCycle: 'monthly', trialDays: 0, features: [] });
    }
  });

  // Delete plan mutation
  const deletePlanMutation = useMutation({
    mutationFn: async (planId) => {
      const response = await fetch(
        `/api/developers/plugins/${selectedPlugin.id}/plans/${planId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete plan');
      return response.json();
    }
  });

  if (!selectedPlugin) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Subscription Management</h1>
            <p className="text-lg opacity-90">Configure pricing and subscription plans for your plugins</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Select a Plugin</h2>

          {plugins.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No plugins yet</p>
              <Button>Create Your First Plugin</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plugins.map((plugin) => (
                <Card
                  key={plugin.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPlugin(plugin)}
                >
                  <h3 className="text-lg font-bold mb-2">{plugin.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plugin.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge>{plugin.status}</Badge>
                    <Button variant="outline" size="sm">
                      Configure Pricing
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{selectedPlugin.name}</h1>
              <p className="text-lg opacity-90">Configure pricing and subscription plans</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedPlugin(null)}
              className="text-white border-white hover:bg-white/10"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs defaultValue="pricing">
          <TabsList>
            <TabsTrigger value="pricing">Pricing Model</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Pricing Model</h2>
                <Button onClick={() => setShowPricingForm(!showPricingForm)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              {showPricingForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Model Type</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md">
                      <option>Free</option>
                      <option>Freemium</option>
                      <option>Subscription</option>
                      <option>One-Time Purchase</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price</label>
                    <div className="flex gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">$</span>
                      <Input type="number" placeholder="0.00" step="0.01" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowPricingForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Model Type</p>
                    <p className="text-lg font-semibold">{pricing?.modelType || 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Base Price</p>
                    <p className="text-lg font-semibold">
                      ${(pricing?.basePrice || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Revenue Share</p>
                    <p className="text-lg font-semibold">{pricing?.revenueShare || 0}%</p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Subscription Plans</h2>
              <Button onClick={() => setShowPlanForm(!showPlanForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </div>

            {/* Add Plan Form */}
            {showPlanForm && (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Create New Plan</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Name</label>
                    <Input
                      placeholder="e.g., Professional"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <div className="flex gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Billing Cycle</label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md"
                      value={newPlan.billingCycle}
                      onChange={(e) => setNewPlan({ ...newPlan, billingCycle: e.target.value })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Trial Days (Optional)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newPlan.trialDays}
                      onChange={(e) => setNewPlan({ ...newPlan, trialDays: parseInt(e.target.value) })}
                      min="0"
                      max="30"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowPlanForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createPlanMutation.mutate(newPlan)}
                      disabled={createPlanMutation.isPending}
                    >
                      {createPlanMutation.isPending ? 'Creating...' : 'Create Plan'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Plans List */}
            <div className="space-y-4">
              {plans.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No subscription plans yet</p>
                  <Button onClick={() => setShowPlanForm(true)}>
                    Create Your First Plan
                  </Button>
                </Card>
              ) : (
                plans.map((plan) => (
                  <Card key={plan.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-semibold">${plan.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Billing Cycle</p>
                            <p className="font-semibold capitalize">{plan.billingCycle}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Trial Period</p>
                            <p className="font-semibold">{plan.trialDays} days</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Subscribers</p>
                            <p className="font-semibold">{plan.subscriberCount || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePlanMutation.mutate(plan.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="mt-6">
            <h2 className="text-2xl font-bold mb-6">Active Subscribers</h2>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Renewal Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">john@example.com</td>
                      <td className="py-3 px-4">Professional</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </td>
                      <td className="py-3 px-4">July 15, 2026</td>
                      <td className="py-3 px-4 font-semibold">$29.99</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">jane@example.com</td>
                      <td className="py-3 px-4">Basic</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </td>
                      <td className="py-3 px-4">July 20, 2026</td>
                      <td className="py-3 px-4 font-semibold">$9.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
