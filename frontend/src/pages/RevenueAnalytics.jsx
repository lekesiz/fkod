/**
 * F-KOD Revenue Analytics Dashboard
 * Track earnings, revenue, and financial metrics
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Download, Filter } from 'lucide-react';

const RevenueAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedPlugin, setSelectedPlugin] = useState('all');

  // Fetch revenue data
  const { data: revenueData = {} } = useQuery({
    queryKey: ['revenue-data', timeRange, selectedPlugin],
    queryFn: async () => {
      const params = new URLSearchParams({ timeRange, plugin: selectedPlugin });
      const response = await fetch(`/api/analytics/revenue?${params}`);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      return response.json();
    }
  });

  // Fetch plugins list
  const { data: plugins = [] } = useQuery({
    queryKey: ['my-plugins'],
    queryFn: async () => {
      const response = await fetch('/api/developers/plugins');
      if (!response.ok) throw new Error('Failed to fetch plugins');
      return response.json();
    }
  });

  // Fetch transaction history
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', timeRange],
    queryFn: async () => {
      const params = new URLSearchParams({ timeRange });
      const response = await fetch(`/api/analytics/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    }
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Revenue Analytics</h1>
          <p className="text-lg opacity-90">Track your earnings and financial metrics</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">Time Range:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'quarter', label: 'Quarter' },
              { value: 'year', label: 'Year' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="font-semibold">Plugin:</span>
            <select
              className="px-3 py-2 border border-input rounded-md"
              value={selectedPlugin}
              onChange={(e) => setSelectedPlugin(e.target.value)}
            >
              <option value="all">All Plugins</option>
              {plugins.map((plugin) => (
                <option key={plugin.id} value={plugin.id}>
                  {plugin.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">${(revenueData.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Earnings</p>
                <p className="text-3xl font-bold">${(revenueData.totalEarnings || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">F-KOD Commission</p>
                <p className="text-3xl font-bold">${(revenueData.totalCommission || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                <p className="text-3xl font-bold">{revenueData.transactionCount || 0}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  name="Total Revenue"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10b981"
                  name="Your Earnings"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue by Plugin */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Revenue by Plugin</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData.revenueByPlugin || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(revenueData.revenueByPlugin || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Earnings Breakdown */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold mb-6">Earnings Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData.earningsBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plugin" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Total Revenue" />
              <Bar dataKey="commission" fill="#ef4444" name="F-KOD Commission" />
              <Bar dataKey="earnings" fill="#10b981" name="Your Earnings" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Transaction History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Transaction History</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Plugin</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold">Commission</th>
                  <th className="text-right py-3 px-4 font-semibold">Your Earnings</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{transaction.pluginName}</td>
                      <td className="py-3 px-4">{transaction.customerEmail}</td>
                      <td className="text-right py-3 px-4">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4">
                        ${transaction.commission.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        ${transaction.earnings.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }>
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
