import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Target,
  Zap,
  Database,
  Cpu,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Eye,
  BarChart3,
  Sliders
} from 'lucide-react';

const ModelManager = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      // Simulate loading AI models
      const modelsData = [
        {
          id: 'demand-forecast-v2',
          name: 'Demand Forecasting Model v2.1',
          type: 'forecasting',
          status: 'active',
          accuracy: 94.2,
          lastTrained: '2024-12-10T08:30:00Z',
          version: '2.1.0',
          description: 'Advanced LSTM model for predicting hotel demand patterns',
          metrics: {
            mae: 0.087,
            rmse: 0.124,
            mape: 8.7,
            r2: 0.942
          },
          parameters: {
            epochs: 100,
            batchSize: 32,
            learningRate: 0.001,
            hiddenLayers: 3,
            neurons: [128, 64, 32]
          },
          trainingData: {
            samples: 15420,
            features: 24,
            timeRange: '2022-01-01 to 2024-12-01'
          },
          performance: {
            cpu: 15,
            memory: 256,
            inferenceTime: 45
          }
        },
        {
          id: 'price-optimization-v1',
          name: 'Dynamic Pricing Model v1.3',
          type: 'optimization',
          status: 'active',
          accuracy: 91.7,
          lastTrained: '2024-12-08T14:20:00Z',
          version: '1.3.2',
          description: 'Reinforcement learning model for optimal pricing strategies',
          metrics: {
            revenueIncrease: 12.5,
            occupancyImprovement: 8.3,
            competitorAccuracy: 89.2,
            priceElasticity: -1.2
          },
          parameters: {
            algorithm: 'Q-Learning',
            explorationRate: 0.1,
            discountFactor: 0.95,
            learningRate: 0.01,
            episodes: 5000
          },
          trainingData: {
            samples: 8750,
            features: 18,
            timeRange: '2023-01-01 to 2024-11-30'
          },
          performance: {
            cpu: 22,
            memory: 512,
            inferenceTime: 120
          }
        },
        {
          id: 'customer-segmentation-v1',
          name: 'Customer Segmentation Model v1.0',
          type: 'classification',
          status: 'training',
          accuracy: 88.9,
          lastTrained: '2024-12-12T10:15:00Z',
          version: '1.0.5',
          description: 'K-means clustering for customer behavior analysis',
          metrics: {
            silhouetteScore: 0.73,
            inertia: 1247.8,
            clusters: 5,
            purity: 0.889
          },
          parameters: {
            algorithm: 'K-Means++',
            clusters: 5,
            maxIterations: 300,
            tolerance: 0.0001,
            randomState: 42
          },
          trainingData: {
            samples: 12340,
            features: 15,
            timeRange: '2023-06-01 to 2024-12-01'
          },
          performance: {
            cpu: 8,
            memory: 128,
            inferenceTime: 25
          }
        },
        {
          id: 'recommendation-engine-v3',
          name: 'Smart Recommendations Engine v3.0',
          type: 'recommendation',
          status: 'active',
          accuracy: 96.1,
          lastTrained: '2024-12-11T16:45:00Z',
          version: '3.0.1',
          description: 'Hybrid collaborative filtering and content-based recommendations',
          metrics: {
            precision: 0.94,
            recall: 0.89,
            f1Score: 0.915,
            ndcg: 0.923
          },
          parameters: {
            algorithm: 'Hybrid CF-CB',
            factors: 50,
            regularization: 0.01,
            iterations: 20,
            alpha: 0.7
          },
          trainingData: {
            samples: 25680,
            features: 32,
            timeRange: '2022-01-01 to 2024-12-01'
          },
          performance: {
            cpu: 18,
            memory: 384,
            inferenceTime: 35
          }
        },
        {
          id: 'anomaly-detection-v1',
          name: 'Anomaly Detection Model v1.2',
          type: 'detection',
          status: 'paused',
          accuracy: 92.4,
          lastTrained: '2024-12-05T09:30:00Z',
          version: '1.2.0',
          description: 'Isolation Forest for detecting unusual booking patterns',
          metrics: {
            precision: 0.91,
            recall: 0.88,
            f1Score: 0.895,
            auc: 0.924
          },
          parameters: {
            algorithm: 'Isolation Forest',
            contamination: 0.1,
            maxSamples: 256,
            maxFeatures: 1.0,
            randomState: 42
          },
          trainingData: {
            samples: 18920,
            features: 20,
            timeRange: '2023-01-01 to 2024-11-30'
          },
          performance: {
            cpu: 12,
            memory: 192,
            inferenceTime: 30
          }
        }
      ];

      setModels(modelsData);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'training': return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'paused': return <Pause className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'forecasting': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'optimization': return <Target className="w-5 h-5 text-green-600" />;
      case 'classification': return <BarChart3 className="w-5 h-5 text-purple-600" />;
      case 'recommendation': return <Brain className="w-5 h-5 text-orange-600" />;
      case 'detection': return <Eye className="w-5 h-5 text-red-600" />;
      default: return <Cpu className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleModelAction = async (modelId, action) => {
    try {
      setModels(prev => prev.map(model => {
        if (model.id === modelId) {
          switch (action) {
            case 'start':
              return { ...model, status: 'active' };
            case 'pause':
              return { ...model, status: 'paused' };
            case 'retrain':
              return { ...model, status: 'training', lastTrained: new Date().toISOString() };
            default:
              return model;
          }
        }
        return model;
      }));

      window.showToast && window.showToast(`Model ${action} initiated successfully`, 'success');
    } catch (error) {
      console.error(`Error ${action} model:`, error);
      window.showToast && window.showToast(`Failed to ${action} model`, 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI models...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Model Manager</h2>
              <p className="text-purple-100">Manage and monitor machine learning models</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Model</span>
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Models Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">ACTIVE MODELS</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {models.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">
            {models.length} total models
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">AVG ACCURACY</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Across all models
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">CPU USAGE</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {models.reduce((sum, m) => sum + m.performance.cpu, 0)}%
          </div>
          <div className="text-sm text-gray-600">
            Total consumption
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">MEMORY</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(models.reduce((sum, m) => sum + m.performance.memory, 0) / 1024).toFixed(1)} GB
          </div>
          <div className="text-sm text-gray-600">
            Total allocated
          </div>
        </div>
      </div>

      {/* Models List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI Models</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {models.map(model => (
            <div key={model.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(model.type)}
                    {getStatusIcon(model.status)}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{model.name}</h4>
                    <p className="text-sm text-gray-600">{model.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>v{model.version}</span>
                      <span>Accuracy: {model.accuracy}%</span>
                      <span>Last trained: {formatDate(model.lastTrained)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                    {model.status}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {model.status === 'active' ? (
                      <button
                        onClick={() => handleModelAction(model.id, 'pause')}
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Pause model"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModelAction(model.id, 'start')}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Start model"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleModelAction(model.id, 'retrain')}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Retrain model"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setShowConfigModal(true)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Configure model"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CPU</span>
                    <span className="font-medium">{model.performance.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${model.performance.cpu}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Memory</span>
                    <span className="font-medium">{model.performance.memory} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-green-500 h-1 rounded-full" 
                      style={{ width: `${Math.min(100, (model.performance.memory / 1024) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Inference</span>
                    <span className="font-medium">{model.performance.inferenceTime}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-purple-500 h-1 rounded-full" 
                      style={{ width: `${Math.min(100, (model.performance.inferenceTime / 200) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelManager;
