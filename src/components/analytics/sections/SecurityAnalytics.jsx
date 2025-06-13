import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const SecurityAnalytics = ({ security = [], timeframe = '30days' }) => {
  const mockData = {
    overview: {
      securityScore: 98.5,
      threatsBlocked: 12,
      accessAttempts: 1247,
      vulnerabilities: 0
    },
    insights: [
      {
        type: 'success',
        title: 'Excellent Security Posture',
        description: 'Security score of 98.5% with zero critical vulnerabilities',
        recommendation: 'Maintain current security protocols and monitoring'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Security Analytics</h2>
        <p className="text-gray-600">Security monitoring and threat analysis</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <Shield className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.securityScore}%</div>
          <div className="text-sm text-gray-600">Security Score</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.threatsBlocked}</div>
          <div className="text-sm text-gray-600">Threats Blocked</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <Activity className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.accessAttempts}</div>
          <div className="text-sm text-gray-600">Access Attempts</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.vulnerabilities}</div>
          <div className="text-sm text-gray-600">Vulnerabilities</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Insights</h3>
        <div className="space-y-3">
          {mockData.insights.map((insight, index) => (
            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-600">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <p className="text-sm text-gray-500 mt-2 italic">🔒 {insight.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalytics;
