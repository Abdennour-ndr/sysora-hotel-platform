import React from 'react';
import { Zap, Clock, Activity, TrendingUp } from 'lucide-react';

const PerformanceAnalytics = ({ timeframe = '30days' }) => {
  const mockData = {
    overview: {
      responseTime: 145,
      uptime: 99.9,
      throughput: 2847,
      errorRate: 0.02
    },
    insights: [
      {
        type: 'success',
        title: 'Excellent System Performance',
        description: '99.9% uptime with 145ms average response time',
        recommendation: 'System performing optimally, continue monitoring'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Performance Analytics</h2>
        <p className="text-gray-600">System performance and resource monitoring</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <Clock className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.responseTime}ms</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.uptime}%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <Activity className="w-5 h-5 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.throughput}</div>
          <div className="text-sm text-gray-600">Requests/min</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <Zap className="w-5 h-5 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.errorRate}%</div>
          <div className="text-sm text-gray-600">Error Rate</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="space-y-3">
          {mockData.insights.map((insight, index) => (
            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-600">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <p className="text-sm text-gray-500 mt-2 italic">⚡ {insight.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
