import React, { useState } from 'react';
import { Users, Search, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, Button, Input, LoadingSpinner, EmptyState } from '../ui/DesignSystem';

const ModernGuestLookup = ({ data, loading, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Guest Management</h1>
            <p className="text-gray-600 mt-1">Search and manage guest profiles</p>
          </div>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Guest Management</h1>
          <p className="text-gray-600 mt-1">Search and manage guest profiles</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search guests by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-12">
          <EmptyState
            icon={Users}
            title="Guest Management"
            description="Advanced guest lookup and profile management coming soon"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernGuestLookup;
