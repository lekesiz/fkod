/**
 * F-KOD Plugin Detail Page
 * Shows detailed information about a plugin
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Download, User, AlertCircle } from 'lucide-react';

const PluginDetail = () => {
  const { pluginId } = useParams();
  const [isInstalling, setIsInstalling] = useState(false);

  // Fetch plugin details
  const { data: plugin, isLoading, error } = useQuery({
    queryKey: ['plugin', pluginId],
    queryFn: async () => {
      const response = await fetch(`/api/plugins/${pluginId}`);
      if (!response.ok) throw new Error('Failed to fetch plugin');
      return response.json();
    }
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['plugin-reviews', pluginId],
    queryFn: async () => {
      const response = await fetch(`/api/plugins/${pluginId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  // Install mutation
  const installMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/plugins/${pluginId}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: 1 })
      });
      if (!response.ok) throw new Error('Failed to install plugin');
      return response.json();
    },
    onSuccess: () => {
      setIsInstalling(false);
    }
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error || !plugin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          Plugin not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            {plugin.icon_url && (
              <img
                src={plugin.icon_url}
                alt={plugin.name}
                className="w-24 h-24 rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{plugin.name}</h1>
              <p className="text-lg opacity-90 mb-4">{plugin.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">v{plugin.version}</Badge>
                <Badge variant="secondary">{plugin.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Screenshots */}
            {plugin.banner_url && (
              <div className="mb-8">
                <img
                  src={plugin.banner_url}
                  alt="Plugin banner"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">About</h3>
                  <p className="text-muted-foreground mb-6">{plugin.long_description}</p>
                  
                  <h3 className="text-xl font-bold mb-4">Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                  </ul>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <Card className="p-6 text-center text-muted-foreground">
                      No reviews yet
                    </Card>
                  ) : (
                    reviews.map((review) => (
                      <Card key={review.id} className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.title}</p>
                            <p className="text-sm text-muted-foreground">{review.name}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.review}</p>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="changelog" className="mt-6">
                <Card className="p-6">
                  <p className="text-muted-foreground">Changelog coming soon</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Install Card */}
            <Card className="p-6 mb-6 sticky top-4">
              <Button
                className="w-full mb-4"
                size="lg"
                onClick={() => installMutation.mutate()}
                disabled={installMutation.isPending}
              >
                {installMutation.isPending ? 'Installing...' : 'Install Plugin'}
              </Button>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(plugin.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{plugin.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({plugin.review_count})</span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Downloads</p>
                  <p className="font-semibold">{plugin.downloads.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Version</p>
                  <p className="font-semibold">{plugin.version}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold">{plugin.category}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Developer</p>
                  <p className="font-semibold">Developer Name</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-semibold">
                    {new Date(plugin.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Developer Card */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Developer</h3>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-10 h-10 rounded-full bg-primary/10 p-2" />
                <div>
                  <p className="font-semibold">Developer Name</p>
                  <p className="text-sm text-muted-foreground">Verified Developer</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginDetail;
