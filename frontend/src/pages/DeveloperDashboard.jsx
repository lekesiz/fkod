/**
 * F-KOD Developer Dashboard
 * Plugin management, analytics, and earnings tracking
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, DollarSign, Download, Star } from 'lucide-react';

const DeveloperDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch developer plugins
  const { data: plugins = [] } = useQuery({
    queryKey: ['developer-plugins'],
    queryFn: async () => {
      const response = await fetch('/api/developers/plugins');
      if (!response.ok) throw new Error('Failed to fetch plugins');
      return response.json();
    }
  });

  // Fetch earnings
  const { data: earnings = {} } = useQuery({
    queryKey: ['developer-earnings'],
    queryFn: async () => {
      const response = await fetch('/api/developers/earnings');
      if (!response.ok) throw new Error('Failed to fetch earnings');
      return response.json();
    }
  });

  // Fetch analytics
  const { data: analytics = [] } = useQuery({
    queryKey: ['developer-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/developers/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });

  const totalDownloads = plugins.reduce((sum, p) => sum + (p.downloads || 0), 0);
  const totalRating = plugins.length > 0 ? (plugins.reduce((sum, p) => sum + (p.rating || 0), 0) / plugins.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Developer Dashboard</h1>
              <p className="text-lg opacity-90">Manage your plugins and track earnings</p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Create Plugin
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Plugins</p>
                <p className="text-3xl font-bold">{plugins.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                <p className="text-3xl font-bold">{totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                <p className="text-3xl font-bold">{totalRating}</p>
              </div>
              <Star className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">${(earnings.total || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Plugins */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Recent Plugins</h3>
                <div className="space-y-4">
                  {plugins.slice(0, 5).map((plugin) => (
                    <div key={plugin.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div>
                        <p className="font-semibold">{plugin.name}</p>
                        <p className="text-sm text-muted-foreground">{plugin.downloads} downloads</p>
                      </div>
                      <Badge>{plugin.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Revenue Chart */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Revenue (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.slice(0, 7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Plugins Tab */}
          <TabsContent value="plugins" className="mt-6">
            <div className="space-y-4">
              {plugins.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No plugins yet</p>
                  <Button>Create Your First Plugin</Button>
                </Card>
              ) : (
                plugins.map((plugin) => (
                  <Card key={plugin.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{plugin.name}</h3>
                        <p className="text-muted-foreground mb-4">{plugin.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">v{plugin.version}</span>
                          <span className="text-muted-foreground">{plugin.downloads} downloads</span>
                          <span className="text-muted-foreground">Rating: {plugin.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{plugin.status}</Badge>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Plugin Analytics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="downloads" fill="#3b82f6" />
                  <Bar dataKey="installations" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Earnings Summary */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-xl font-bold mb-6">Earnings Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="text-2xl font-bold">${(earnings.thisMonth || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-muted-foreground">Last Month</span>
                    <span className="text-2xl font-bold">${(earnings.lastMonth || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="text-2xl font-bold">${(earnings.total || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pending Payout</span>
                    <span className="text-2xl font-bold text-primary">${(earnings.pending || 0).toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              {/* Payout Card */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Payout</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Payout Method</p>
                    <p className="font-semibold">Bank Transfer</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Last Payout</p>
                    <p className="font-semibold">May 1, 2026</p>
                  </div>
                  <Button className="w-full">Request Payout</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
