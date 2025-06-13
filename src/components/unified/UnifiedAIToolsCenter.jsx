import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Bot,
  Lightbulb,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Star,
  Activity,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Cpu,
  Database,
  Network,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

const UnifiedAIToolsCenter = ({ 
  reservations = [], 
  rooms = [], 
  guests = [], 
  payments = [],
  operations = []
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [aiModels, setAiModels] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelPerformance, setModelPerformance] = useState({});

  // AI Tools sections configuration
  const aiSections = [
    {
      id: 'overview',
      title: 'AI Overview',
      icon: Brain,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'AI system status and performance overview'
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      icon: TrendingUp,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Demand forecasting and trend predictions'
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'AI-powered business recommendations'
    },
    {
      id: 'automation',
      title: 'Intelligent Automation',
      icon: Zap,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Automated workflows and processes'
    },
    {
      id: 'insights',
      title: 'AI Insights',
      icon: Target,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Deep learning insights and patterns'
    },
    {
      id: 'models',
      title: 'Model Management',
      icon: Cpu,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'AI model training and deployment'
    }
  ];

  useEffect(() => {
    loadAIData();
    startAIProcessing();
  }, []);

  const loadAIData = async () => {
    try {
      // Simulate loading AI models and data
      const models = [
        {
          id: 'demand-forecast',
          name: 'Demand Forecasting Model',
          type: 'Time Series',
          accuracy: 94.2,
          status: 'active',
          lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          predictions: 156
        },
        {
          id: 'price-optimization',
          name: 'Price Optimization Model',
          type: 'Regression',
          accuracy: 89.7,
          status: 'active',
          lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          predictions: 89
        },
        {
          id: 'guest-behavior',
          name: 'Guest Behavior Analysis',
          type: 'Classification',
          accuracy: 91.5,
          status: 'training',
          lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          predictions: 234
        },
        {
          id: 'revenue-prediction',
          name: 'Revenue Prediction Model',
          type: 'Neural Network',
          accuracy: 96.1,
          status: 'active',
          lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          predictions: 78
        }
      ];

      setAiModels(models);

      // Generate predictions
      const predictionsData = {
        demandForecast: {
          nextWeek: 'High Demand',
          confidence: 94.2,
          expectedBookings: 156,
          peakDays: ['Friday', 'Saturday', 'Sunday']
        },
        priceOptimization: {
          recommendedIncrease: 15,
          optimalPrice: 250,
          revenueImpact: '+$12,500',
          confidence: 89.7
        },
        guestBehavior: {
          loyaltyPrediction: 'High',
          churnRisk: 'Low',
          satisfactionScore: 4.6,
          confidence: 91.5
        },
        revenueProjection: {
          nextMonth: '$145,000',
          growth: '+18.5%',
          confidence: 96.1,
          factors: ['Seasonal trends', 'Market demand', 'Pricing strategy']
        }
      };

      setPredictions(predictionsData);

      // Generate recommendations
      const recommendationsData = [
        {
          id: 1,
          type: 'pricing',
          priority: 'high',
          title: 'Optimize Weekend Pricing',
          description: 'Increase weekend rates by 15% based on high demand forecast',
          impact: '+$12,500 revenue',
          confidence: 94.2,
          action: 'Implement dynamic pricing for weekends'
        },
        {
          id: 2,
          type: 'marketing',
          priority: 'medium',
          title: 'Target Business Travelers',
          description: 'Focus marketing on business segment during weekdays',
          impact: '+25% occupancy',
          confidence: 87.3,
          action: 'Launch targeted business traveler campaign'
        },
        {
          id: 3,
          type: 'operations',
          priority: 'high',
          title: 'Staff Optimization',
          description: 'Adjust staffing levels for predicted high-demand period',
          impact: '+15% efficiency',
          confidence: 91.8,
          action: 'Schedule additional staff for peak days'
        },
        {
          id: 4,
          type: 'guest-experience',
          priority: 'medium',
          title: 'Personalized Services',
          description: 'Implement personalized services for VIP guests',
          impact: '+0.3 rating points',
          confidence: 89.5,
          action: 'Deploy personalization engine'
        }
      ];

      setRecommendations(recommendationsData);

      // Model performance metrics
      const performance = {
        totalPredictions: 1247,
        accuracyRate: 92.8,
        processingTime: 145,
        modelsActive: 3,
        modelsTraining: 1,
        dataProcessed: '2.4TB',
        computeUsage: 67
      };

      setModelPerformance(performance);

    } catch (error) {
      console.error('Error loading AI data:', error);
    }
  };

  const startAIProcessing = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const runPrediction = async (modelId) => {
    setIsProcessing(true);
    try {
      // Simulate running prediction
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.showToast && window.showToast('Prediction completed successfully', 'success');
      
      // Update model predictions count
      setAiModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, predictions: model.predictions + 1 }
            : model
        )
      );
    } catch (error) {
      window.showToast && window.showToast('Error running prediction', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const trainModel = async (modelId) => {
    setIsProcessing(true);
    try {
      // Simulate model training
      await new Promise(resolve => setTimeout(resolve, 5000));
      window.showToast && window.showToast('Model training completed', 'success');
      
      // Update model status
      setAiModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { 
                ...model, 
                status: 'active', 
                lastTrained: new Date(),
                accuracy: Math.min(model.accuracy + Math.random() * 2, 99.9)
              }
            : model
        )
      );
    } catch (error) {
      window.showToast && window.showToast('Error training model', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const implementRecommendation = (recommendationId) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, status: 'implemented' }
          : rec
      )
    );
    window.showToast && window.showToast('Recommendation implemented', 'success');
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'training': return 'text-blue-600 bg-blue-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">AI Tools Center</h1>
                <p className="text-pink-100 text-sm">Artificial intelligence and machine learning hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                <span className="text-sm text-pink-100">
                  {isProcessing ? 'Processing...' : 'Ready'}
                </span>
              </div>
              
              <button
                onClick={loadAIData}
                className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors"
                title="Refresh AI Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Performance Overview */}
        {modelPerformance.totalPredictions && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{modelPerformance.totalPredictions}</div>
                <div className="text-xs text-gray-600">Predictions</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{modelPerformance.accuracyRate}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{modelPerformance.processingTime}ms</div>
                <div className="text-xs text-gray-600">Avg Response</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{modelPerformance.modelsActive}</div>
                <div className="text-xs text-gray-600">Active Models</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{modelPerformance.modelsTraining}</div>
                <div className="text-xs text-gray-600">Training</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">{modelPerformance.dataProcessed}</div>
                <div className="text-xs text-gray-600">Data Processed</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{modelPerformance.computeUsage}%</div>
                <div className="text-xs text-gray-600">Compute Usage</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isActive ? 'ring-2 ring-pink-500' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-xl ${section.lightColor}`}>
                  <Icon className={`w-6 h-6 ${section.textColor}`} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                </div>
                
                <div className="text-xs text-gray-500">
                  {isProcessing ? 'Processing...' : 'Ready'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {aiSections.find(s => s.id === activeSection)?.title || 'AI Tools'}
          </h2>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={startAIProcessing}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-3 py-2 bg-pink-100 text-pink-700 hover:bg-pink-200 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Run AI Analysis'}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors">
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Models Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">AI Models Status</h3>
                {aiModels.map((model) => (
                  <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Accuracy:</span> {model.accuracy}%
                      </div>
                      <div>
                        <span className="font-medium">Predictions:</span> {model.predictions}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {model.type}
                      </div>
                      <div>
                        <span className="font-medium">Last Trained:</span> {formatDate(model.lastTrained)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => runPrediction(model.id)}
                        disabled={isProcessing || model.status !== 'active'}
                        className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs transition-colors disabled:opacity-50"
                      >
                        Run Prediction
                      </button>
                      
                      <button
                        onClick={() => trainModel(model.id)}
                        disabled={isProcessing}
                        className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs transition-colors disabled:opacity-50"
                      >
                        Retrain
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Smart Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Smart Recommendations</h3>
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Impact:</span> {rec.impact} • 
                        <span className="font-medium"> Confidence:</span> {rec.confidence}%
                      </div>
                      
                      <button
                        onClick={() => implementRecommendation(rec.id)}
                        disabled={rec.status === 'implemented'}
                        className="px-3 py-1 bg-pink-100 text-pink-700 hover:bg-pink-200 rounded text-xs transition-colors disabled:opacity-50"
                      >
                        {rec.status === 'implemented' ? 'Implemented' : 'Implement'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection !== 'overview' && (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Advanced {aiSections.find(s => s.id === activeSection)?.title} coming soon...</p>
              <p className="text-sm mt-2">AI-powered features and tools will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedAIToolsCenter;
