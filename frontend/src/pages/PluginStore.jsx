/**
 * F-KOD Plugin Store
 * Main marketplace page for browsing and installing plugins
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Download, TrendingUp, Zap } from 'lucide-react';

const PluginStore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');

  // Fetch plugins
  const { data: plugins = [], isLoading: pluginsLoading } = useQuery({
    queryKey: ['plugins', searchQuery, selectedCategory, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        limit: 20
      });
      const response = await fetch(`/api/plugins?${params}`);
      if (!response.ok) throw new Error('Failed to fetch plugins');
      return response.json();
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['plugin-categories'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  // Fetch trending plugins
  const { data: trendingPlugins = [] } = useQuery({
    queryKey: ['trending-plugins'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/trending');
      if (!response.ok) throw new Error('Failed to fetch trending');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Plugin Marketplace</h1>
          <p className="text-lg opacity-90">Discover and install plugins to extend F-KOD</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Search</h3>
              <Input
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Plugins
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.category}
                    variant={selectedCategory === cat.category ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat.category)}
                  >
                    {cat.category} ({cat.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'downloads', label: 'Most Downloaded' },
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'newest', label: 'Newest' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Trending Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendingPlugins.slice(0, 3).map((plugin) => (
                  <PluginCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            </div>

            {/* All Plugins */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Plugins'}
              </h2>
              
              {pluginsLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading plugins...</p>
                </div>
              ) : plugins.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No plugins found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plugins.map((plugin) => (
                    <PluginCard key={plugin.id} plugin={plugin} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Plugin Card Component
 */
const PluginCard = ({ plugin }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{plugin.name}</h3>
            <p className="text-sm text-muted-foreground">v{plugin.version}</p>
          </div>
          {plugin.icon_url && (
            <img
              src={plugin.icon_url}
              alt={plugin.name}
              className="w-10 h-10 rounded"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {plugin.description}
        </p>

        {/* Category Badge */}
        <div className="mb-3">
          <Badge variant="secondary">{plugin.category}</Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{plugin.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({plugin.review_count})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="w-4 h-4" />
            <span>{plugin.downloads.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full" size="sm">
          <Zap className="w-4 h-4 mr-2" />
          Install
        </Button>
      </div>
    </Card>
  );
};

export default PluginStore;
