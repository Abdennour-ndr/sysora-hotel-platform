import React from 'react';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';

const AIAnalytics = ({ data = {}, timeframe = '30days' }) => {
  const mockData = {
    overview: {
      predictionAccuracy: 94.2,
      aiRecommendations: 23,
      automatedTasks: 156,
      mlModelPerformance: 91.8
    },
    insights: [
      {
        type: 'success',
        title: 'High AI Prediction Accuracy',
        description: 'ML models achieving 94.2% accuracy in demand forecasting',
        recommendation: 'Continue training models with new data for improved accuracy'
      },
      {
        type: 'info',
        title: 'AI-Powered Recommendations',
        description: '23 actionable recommendations generated this period',
        recommendation: 'Review and implement high-impact AI suggestions'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">AI Analytics</h2>
        <p className="text-gray-600">Machine learning insights and AI performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-pink-50 rounded-xl p-4">
          <Brain className="w-5 h-5 text-pink-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.predictionAccuracy}%</div>
          <div className="text-sm text-gray-600">Prediction Accuracy</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <Target className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.aiRecommendations}</div>
          <div className="text-sm text-gray-600">AI Recommendations</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <Zap className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.automatedTasks}</div>
          <div className="text-sm text-gray-600">Automated Tasks</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{mockData.overview.mlModelPerformance}%</div>
          <div className="text-sm text-gray-600">Model Performance</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
        <div className="space-y-3">
          {mockData.insights.map((insight, index) => {
            const config = insight.type === 'success' 
              ? { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
              : { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
            
            return (
              <div key={index} className={`${config.bg} ${config.border} border rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                  <Brain className={`w-5 h-5 ${config.color} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`font-medium ${config.color}`}>{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-sm text-gray-500 mt-2 italic">🤖 {insight.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
