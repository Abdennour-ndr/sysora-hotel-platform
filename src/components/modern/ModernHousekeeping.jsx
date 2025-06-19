import React, { useState } from 'react';
import { ClipboardList, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, Button, LoadingSpinner, EmptyState } from '../ui/DesignSystem';

const ModernHousekeeping = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Housekeeping</h1>
            <p className="text-gray-600 mt-1">Manage cleaning tasks and assignments</p>
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
          <h1 className="text-2xl font-semibold text-gray-900">Housekeeping</h1>
          <p className="text-gray-600 mt-1">Manage cleaning tasks and assignments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-12">
          <EmptyState
            icon={ClipboardList}
            title="Housekeeping Management"
            description="Task assignment and tracking system coming soon"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernHousekeeping;
