/**
 * F-KOD Plugin Submission & Review
 * Submit plugins for marketplace review and track review status
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Clock, Upload, FileText, Shield, Zap } from 'lucide-react';

const PluginSubmission = () => {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Fetch plugins
  const { data: plugins = [] } = useQuery({
    queryKey: ['my-plugins'],
    queryFn: async () => {
      const response = await fetch('/api/developers/plugins');
      if (!response.ok) throw new Error('Failed to fetch plugins');
      return response.json();
    }
  });

  // Fetch review details
  const { data: reviewDetails = null } = useQuery({
    queryKey: ['plugin-review', selectedPlugin?.id],
    queryFn: async () => {
      if (!selectedPlugin) return null;
      const response = await fetch(`/api/developers/plugins/${selectedPlugin.id}/review`);
      if (!response.ok) throw new Error('Failed to fetch review');
      return response.json();
    },
    enabled: !!selectedPlugin
  });

  // Submit plugin mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/developers/plugins/${data.pluginId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit plugin');
      return response.json();
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in-review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'draft':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Plugin Submission</h1>
          <p className="text-lg opacity-90">Submit your plugins for marketplace review</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!selectedPlugin ? (
          <>
            {/* Plugins List */}
            <h2 className="text-2xl font-bold mb-6">Your Plugins</h2>
            
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
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{plugin.name}</h3>
                        <p className="text-sm text-muted-foreground">v{plugin.version}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(plugin.status)}
                        <Badge className={getStatusColor(plugin.status)}>
                          {plugin.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{plugin.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Last updated: {new Date(plugin.updated_at).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Plugin Details */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedPlugin(null)}
              >
                ← Back to Plugins
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="p-6 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{selectedPlugin.name}</h1>
                      <p className="text-muted-foreground">{selectedPlugin.description}</p>
                    </div>
                    <Badge className={getStatusColor(selectedPlugin.status)}>
                      {selectedPlugin.status}
                    </Badge>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="review">Review Status</TabsTrigger>
                      <TabsTrigger value="checklist">Submission Checklist</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6 space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Version</p>
                        <p className="text-muted-foreground">{selectedPlugin.version}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Category</p>
                        <p className="text-muted-foreground">{selectedPlugin.category}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Last Updated</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedPlugin.updated_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlugin.permissions?.map((perm) => (
                            <Badge key={perm} variant="secondary">{perm}</Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Review Status Tab */}
                    <TabsContent value="review" className="mt-6">
                      {reviewDetails ? (
                        <div className="space-y-6">
                          {/* Code Review */}
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <Zap className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Code Review</h3>
                              <Badge className={getStatusColor(reviewDetails.codeReview?.status)}>
                                {reviewDetails.codeReview?.status}
                              </Badge>
                            </div>
                            {reviewDetails.codeReview?.feedback && (
                              <p className="text-sm text-muted-foreground ml-8">
                                {reviewDetails.codeReview.feedback}
                              </p>
                            )}
                          </div>

                          {/* Security Review */}
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <Shield className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Security Review</h3>
                              <Badge className={getStatusColor(reviewDetails.securityReview?.status)}>
                                {reviewDetails.securityReview?.status}
                              </Badge>
                            </div>
                            {reviewDetails.securityReview?.feedback && (
                              <p className="text-sm text-muted-foreground ml-8">
                                {reviewDetails.securityReview.feedback}
                              </p>
                            )}
                          </div>

                          {/* Performance Review */}
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <Zap className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Performance Review</h3>
                              <Badge className={getStatusColor(reviewDetails.performanceReview?.status)}>
                                {reviewDetails.performanceReview?.status}
                              </Badge>
                            </div>
                            {reviewDetails.performanceReview?.feedback && (
                              <p className="text-sm text-muted-foreground ml-8">
                                {reviewDetails.performanceReview.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Plugin has not been submitted for review yet.
                        </p>
                      )}
                    </TabsContent>

                    {/* Checklist Tab */}
                    <TabsContent value="checklist" className="mt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>Plugin name and description</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>Plugin icon and banner</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>README documentation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>Code follows best practices</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>Security review passed</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>Performance optimized</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {selectedPlugin.status === 'draft' && (
                  <Card className="p-6 mb-6">
                    <h3 className="font-bold mb-4">Ready to Submit?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your plugin will go through code review, security review, and performance testing.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => setShowSubmitForm(true)}
                      disabled={submitMutation.isPending}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {submitMutation.isPending ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                  </Card>
                )}

                {selectedPlugin.status === 'in-review' && (
                  <Card className="p-6 mb-6 bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-bold text-yellow-900">Under Review</h3>
                    </div>
                    <p className="text-sm text-yellow-800">
                      Your plugin is currently being reviewed. This typically takes 3-5 business days.
                    </p>
                  </Card>
                )}

                {selectedPlugin.status === 'approved' && (
                  <Card className="p-6 mb-6 bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-green-900">Approved!</h3>
                    </div>
                    <p className="text-sm text-green-800 mb-4">
                      Your plugin has been approved and is now available on the marketplace.
                    </p>
                    <Button className="w-full" variant="outline">
                      View on Marketplace
                    </Button>
                  </Card>
                )}

                {selectedPlugin.status === 'rejected' && (
                  <Card className="p-6 mb-6 bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-red-900">Rejected</h3>
                    </div>
                    <p className="text-sm text-red-800 mb-4">
                      Your plugin was rejected. Please review the feedback and make the necessary changes.
                    </p>
                    <Button className="w-full" variant="outline">
                      View Feedback
                    </Button>
                  </Card>
                )}

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Review Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold">Code Review</p>
                      <p className="text-muted-foreground">3-5 days</p>
                    </div>
                    <div>
                      <p className="font-semibold">Security Review</p>
                      <p className="text-muted-foreground">2-3 days</p>
                    </div>
                    <div>
                      <p className="font-semibold">Performance Review</p>
                      <p className="text-muted-foreground">1-2 days</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PluginSubmission;
