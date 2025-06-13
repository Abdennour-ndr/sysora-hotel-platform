import React from 'react';
import { Activity, Clock, Users, CheckCircle } from 'lucide-react';

const OperationalAnalytics = ({ operations = [], timeframe = '30days' }) => {
  const mockData = {
    overview: {
      efficiency: 92.5,
      staffUtilization: 87.3,
      serviceQuality: 4.6,
      responseTime: 12.5
    },
    insights: [
      {
        type: 'success',
        title: 'High Operational Efficiency',
        description: 'Operations running at 92.5% efficiency',
        recommendation: 'Maintain current operational standards'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Operational Analytics</h2>
        <p className="text-gray-600">Staff performance and operational efficiency</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <Activity className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.efficiency}%</div>
          <div className="text-sm text-gray-600">Efficiency</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <Users className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.staffUtilization}%</div>
          <div className="text-sm text-gray-600">Staff Utilization</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.serviceQuality}</div>
          <div className="text-sm text-gray-600">Service Quality</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <Clock className="w-5 h-5 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.responseTime}min</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {mockData.insights.map((insight, index) => (
            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Activity className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-600">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <p className="text-sm text-gray-500 mt-2 italic">💡 {insight.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationalAnalytics;
