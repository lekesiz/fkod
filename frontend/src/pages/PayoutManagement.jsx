/**
 * F-KOD Payout Management
 * Manage payouts, view earnings, and track financial transactions
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Clock, DollarSign, Wallet, Download, Plus } from 'lucide-react';

const PayoutManagement = () => {
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');

  // Fetch balance
  const { data: balance = {} } = useQuery({
    queryKey: ['payout-balance'],
    queryFn: async () => {
      const response = await fetch('/api/payouts/balance');
      if (!response.ok) throw new Error('Failed to fetch balance');
      return response.json();
    }
  });

  // Fetch payout history
  const { data: payoutHistory = [] } = useQuery({
    queryKey: ['payout-history'],
    queryFn: async () => {
      const response = await fetch('/api/payouts/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    }
  });

  // Fetch bank account
  const { data: bankAccount = null } = useQuery({
    queryKey: ['bank-account'],
    queryFn: async () => {
      const response = await fetch('/api/developers/bank-account');
      if (!response.ok) throw new Error('Failed to fetch bank account');
      return response.json();
    }
  });

  // Request payout mutation
  const requestPayoutMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to request payout');
      return response.json();
    },
    onSuccess: () => {
      setShowPayoutForm(false);
      setPayoutAmount('');
    }
  });

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) < 100) {
      alert('Minimum payout amount is $100');
      return;
    }

    await requestPayoutMutation.mutateAsync({
      amount: parseFloat(payoutAmount),
      method: payoutMethod
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Payout Management</h1>
          <p className="text-lg opacity-90">Manage your earnings and request payouts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-900">Available Balance</h3>
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-900 mb-2">
              ${(balance.available || 0).toLocaleString()}
            </p>
            <p className="text-sm text-green-700">Ready to withdraw</p>
          </Card>

          {/* Pending Balance */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-yellow-900">Pending Balance</h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-yellow-900 mb-2">
              ${(balance.pending || 0).toLocaleString()}
            </p>
            <p className="text-sm text-yellow-700">Processing or held for review</p>
          </Card>

          {/* Total Earned */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900">Total Earned</h3>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-900 mb-2">
              ${(balance.total || 0).toLocaleString()}
            </p>
            <p className="text-sm text-blue-700">All time earnings</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payouts">
          <TabsList>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="taxes">Tax Documents</TabsTrigger>
          </TabsList>

          {/* Payout History Tab */}
          <TabsContent value="payouts" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Payout History</h2>
              <Button onClick={() => setShowPayoutForm(!showPayoutForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </div>

            {/* Payout Form */}
            {showPayoutForm && (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Request Payout</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <div className="flex gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        min="100"
                        step="0.01"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum: $100 | Available: ${(balance.available || 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payout Method</label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md"
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                    >
                      <option value="bank">Bank Transfer (ACH)</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe Connect</option>
                      <option value="check">Check (for amounts over $1,000)</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      Payouts are processed weekly on Mondays. Funds typically arrive within 2-5 business days.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowPayoutForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRequestPayout}
                      disabled={requestPayoutMutation.isPending}
                    >
                      {requestPayoutMutation.isPending ? 'Processing...' : 'Request Payout'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Payout List */}
            <div className="space-y-4">
              {payoutHistory.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No payouts yet</p>
                  <Button onClick={() => setShowPayoutForm(true)}>
                    Request Your First Payout
                  </Button>
                </Card>
              ) : (
                payoutHistory.map((payout) => (
                  <Card key={payout.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">
                          {getStatusIcon(payout.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              ${payout.amount.toLocaleString()}
                            </h3>
                            <Badge className={getStatusColor(payout.status)}>
                              {payout.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {payout.method} • {new Date(payout.created_at).toLocaleDateString()}
                          </p>
                          {payout.expected_arrival && (
                            <p className="text-sm text-muted-foreground">
                              Expected arrival: {new Date(payout.expected_arrival).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="methods" className="mt-6">
            <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

            <div className="space-y-4">
              {bankAccount ? (
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">Bank Account</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {bankAccount.bank_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Account ending in {bankAccount.account_number.slice(-4)}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <p className="text-muted-foreground mb-4">
                    No bank account set up yet. Add a payment method to receive payouts.
                  </p>
                  <Button>Add Bank Account</Button>
                </Card>
              )}

              <Card className="p-6 border-dashed">
                <p className="text-sm text-muted-foreground mb-4">
                  Add alternative payment methods for more flexibility
                </p>
                <Button variant="outline">Add PayPal</Button>
              </Card>
            </div>
          </TabsContent>

          {/* Tax Documents Tab */}
          <TabsContent value="taxes" className="mt-6">
            <h2 className="text-2xl font-bold mb-6">Tax Documents</h2>

            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">2026 Tax Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Total earnings: $15,234.50 | Tax withheld: $4,570.35
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">1099-NEC Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Available after January 31st each year
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-900">
                  Tax documents are automatically generated and available for download. Keep them for your records and provide to your accountant.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PayoutManagement;
