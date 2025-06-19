import React, { useState } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, Button, LoadingSpinner, EmptyState } from '../ui/DesignSystem';

const ModernShiftReport = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Shift Reports</h1>
            <p className="text-gray-600 mt-1">Daily summaries and handover reports</p>
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
          <h1 className="text-2xl font-semibold text-gray-900">Shift Reports</h1>
          <p className="text-gray-600 mt-1">Daily summaries and handover reports</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-12">
          <EmptyState
            icon={FileText}
            title="Shift Reporting"
            description="Comprehensive reporting and analytics coming soon"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernShiftReport;
