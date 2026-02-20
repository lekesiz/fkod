/**
 * F-KOD Developer Support Portal
 * Support tickets, knowledge base, and community
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MessageSquare, BookOpen, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const DeveloperSupport = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: '', description: '' });

  // Fetch support tickets
  const { data: tickets = [] } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const response = await fetch('/api/developers/support/tickets');
      if (!response.ok) throw new Error('Failed to fetch tickets');
      return response.json();
    }
  });

  // Fetch knowledge base articles
  const { data: articles = [] } = useQuery({
    queryKey: ['knowledge-base', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({ q: searchQuery });
      const response = await fetch(`/api/developers/knowledge-base?${params}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/developers/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create ticket');
      return response.json();
    },
    onSuccess: () => {
      setShowNewTicket(false);
      setNewTicket({ subject: '', category: '', description: '' });
    }
  });

  const handleCreateTicket = async () => {
    await createTicketMutation.mutateAsync(newTicket);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Developer Support</h1>
          <p className="text-lg opacity-90">Get help with your plugins and development questions</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
                <p className="text-3xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
                <p className="text-3xl font-bold">24h</p>
              </div>
              <Clock className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Knowledge Base</p>
                <p className="text-3xl font-bold">150+</p>
              </div>
              <BookOpen className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Community Members</p>
                <p className="text-3xl font-bold">5K+</p>
              </div>
              <Users className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Support Tickets</h2>
              <Button onClick={() => setShowNewTicket(!showNewTicket)}>
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {/* New Ticket Form */}
            {showNewTicket && (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Create Support Ticket</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md">
                      <option>Technical Issue</option>
                      <option>Account Issue</option>
                      <option>Marketplace Issue</option>
                      <option>Billing Issue</option>
                      <option>General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-input rounded-md"
                      rows={6}
                      placeholder="Provide detailed information about your issue"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewTicket(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTicket}
                      disabled={createTicketMutation.isPending}
                    >
                      {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Tickets List */}
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No support tickets yet</p>
                  <Button onClick={() => setShowNewTicket(true)}>
                    Create Your First Ticket
                  </Button>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Ticket #{ticket.id}</span>
                          <span>Category: {ticket.category}</span>
                          <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold mb-1">Replies</p>
                        <p className="text-2xl font-bold">{ticket.replies || 0}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge-base" className="mt-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge base..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.length === 0 ? (
                <Card className="p-12 text-center md:col-span-2">
                  <p className="text-muted-foreground">No articles found</p>
                </Card>
              ) : (
                articles.map((article) => (
                  <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3 mb-3">
                      <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <h3 className="text-lg font-semibold">{article.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{article.category}</span>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Community Stats */}
              <Card className="p-6 md:col-span-3">
                <h3 className="text-lg font-bold mb-4">Community Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Members</p>
                    <p className="text-2xl font-bold">5,234</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Discussions</p>
                    <p className="text-2xl font-bold">1,847</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Code Snippets</p>
                    <p className="text-2xl font-bold">3,421</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Helpful Answers</p>
                    <p className="text-2xl font-bold">8,956</p>
                  </div>
                </div>
              </Card>

              {/* Community Channels */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Discord Channel</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our Discord community to chat with other developers in real-time.
                </p>
                <Button className="w-full">Join Discord</Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Developer Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask questions and share knowledge with the community.
                </p>
                <Button className="w-full">Visit Forum</Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">GitHub Discussions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discuss features and contribute to the F-KOD SDK.
                </p>
                <Button className="w-full">View Discussions</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperSupport;
