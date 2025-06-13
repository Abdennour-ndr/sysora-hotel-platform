import React, { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Settings,
  Eye,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Calculator,
  Zap,
  X
} from 'lucide-react';

const CurrencyManager = () => {
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('DZD');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showConverter, setShowConverter] = useState(false);
  const [converterData, setConverterData] = useState({
    from: 'DZD',
    to: 'EUR',
    amount: 1000
  });

  // Mock currency data
  useEffect(() => {
    const mockCurrencies = [
      {
        code: 'DZD',
        name: 'Algerian Dinar',
        symbol: 'د.ج',
        flag: '🇩🇿',
        isBase: true,
        isActive: true,
        rate: 1.0000,
        change24h: 0.0,
        lastUpdate: new Date()
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        flag: '🇪🇺',
        isBase: false,
        isActive: true,
        rate: 0.0074,
        change24h: 0.12,
        lastUpdate: new Date()
      },
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        flag: '🇺🇸',
        isBase: false,
        isActive: true,
        rate: 0.0075,
        change24h: -0.08,
        lastUpdate: new Date()
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        flag: '🇬🇧',
        isBase: false,
        isActive: true,
        rate: 0.0059,
        change24h: 0.15,
        lastUpdate: new Date()
      },
      {
        code: 'MAD',
        name: 'Moroccan Dirham',
        symbol: 'د.م.',
        flag: '🇲🇦',
        isBase: false,
        isActive: false,
        rate: 0.075,
        change24h: 0.05,
        lastUpdate: new Date()
      },
      {
        code: 'TND',
        name: 'Tunisian Dinar',
        symbol: 'د.ت',
        flag: '🇹🇳',
        isBase: false,
        isActive: false,
        rate: 0.023,
        change24h: -0.02,
        lastUpdate: new Date()
      }
    ];

    setCurrencies(mockCurrencies);
    
    // Create exchange rates object
    const rates = {};
    mockCurrencies.forEach(currency => {
      rates[currency.code] = currency.rate;
    });
    setExchangeRates(rates);
  }, []);

  // Update exchange rates
  const updateRates = async () => {
    setLoading(true);
    try {
      // Simulate API call to get real exchange rates
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock rate updates with small random changes
      const updatedCurrencies = currencies.map(currency => {
        if (currency.code === baseCurrency) return currency;
        
        const randomChange = (Math.random() - 0.5) * 0.02; // ±1% change
        const newRate = currency.rate * (1 + randomChange);
        
        return {
          ...currency,
          rate: newRate,
          change24h: randomChange * 100,
          lastUpdate: new Date()
        };
      });
      
      setCurrencies(updatedCurrencies);
      setLastUpdate(new Date());
      window.showToast && window.showToast('Exchange rates updated successfully', 'success');
    } catch (error) {
      window.showToast && window.showToast('Error updating exchange rates', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Convert currency
  const convertCurrency = (amount, fromCode, toCode) => {
    if (fromCode === toCode) return amount;
    
    const fromRate = exchangeRates[fromCode] || 1;
    const toRate = exchangeRates[toCode] || 1;
    
    // Convert to base currency first, then to target currency
    const baseAmount = amount / fromRate;
    const convertedAmount = baseAmount * toRate;
    
    return convertedAmount;
  };

  // Toggle currency status
  const toggleCurrencyStatus = (currencyCode) => {
    setCurrencies(prev => prev.map(currency => 
      currency.code === currencyCode 
        ? { ...currency, isActive: !currency.isActive }
        : currency
    ));
  };

  // Get change color
  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Get change icon
  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <ArrowUpDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sysora-midnight via-blue-800 to-sysora-midnight rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-sysora-mint/20 rounded-2xl">
                <Globe className="w-8 h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Multi-Currency Management</h2>
                <p className="text-blue-100/80 text-lg">Real-time exchange rates & currency conversion</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">{currencies.filter(c => c.isActive).length}</p>
                    <p className="text-sm text-blue-100/70">Active Currencies</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold">{baseCurrency}</p>
                    <p className="text-sm text-blue-100/70">Base Currency</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{lastUpdate.toLocaleTimeString().slice(0, 5)}</p>
                    <p className="text-sm text-blue-100/70">Last Update</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold">{autoUpdate ? 'ON' : 'OFF'}</p>
                    <p className="text-sm text-blue-100/70">Auto Update</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={updateRates}
              disabled={loading}
              className={`flex items-center justify-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="sm:hidden">{loading ? 'Updating...' : 'Refresh'}</span>
            </button>
            
            <button
              onClick={() => setShowConverter(!showConverter)}
              className="flex items-center space-x-2 p-4 bg-blue-600/90 hover:bg-blue-600 rounded-2xl transition-colors"
            >
              <Calculator className="w-5 h-5" />
              <span>Converter</span>
            </button>
            
            <button className="flex items-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-colors font-semibold">
              <Plus className="w-5 h-5" />
              <span>Add Currency</span>
            </button>
          </div>
        </div>
      </div>

      {/* Currency Converter */}
      {showConverter && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Calculator className="w-6 h-6" />
              <span>Currency Converter</span>
            </h3>
            <button
              onClick={() => setShowConverter(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="space-y-2">
                <select
                  value={converterData.from}
                  onChange={(e) => setConverterData(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
                >
                  {currencies.filter(c => c.isActive).map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={converterData.amount}
                  onChange={(e) => setConverterData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setConverterData(prev => ({ ...prev, from: prev.to, to: prev.from }))}
                className="p-3 bg-sysora-mint/10 text-sysora-mint rounded-xl hover:bg-sysora-mint/20 transition-colors"
              >
                <ArrowUpDown className="w-6 h-6" />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="space-y-2">
                <select
                  value={converterData.to}
                  onChange={(e) => setConverterData(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
                >
                  {currencies.filter(c => c.isActive).map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-sysora-midnight">
                  {convertCurrency(converterData.amount, converterData.from, converterData.to).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-600">
              <strong>Exchange Rate:</strong> 1 {converterData.from} = {(exchangeRates[converterData.to] / exchangeRates[converterData.from]).toLocaleString(undefined, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 6
              })} {converterData.to}
            </p>
          </div>
        </div>
      )}

      {/* Currency List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Supported Currencies</h3>
              <p className="text-gray-500 mt-1">Manage exchange rates and currency settings</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="w-4 h-4 text-sysora-mint border-gray-300 rounded focus:ring-sysora-mint"
                />
                <span className="text-sm text-gray-600">Auto-update rates</span>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Currency</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Exchange Rate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">24h Change</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Update</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currencies.map((currency) => (
                <tr key={currency.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{currency.code}</span>
                          {currency.isBase && (
                            <span className="px-2 py-1 bg-sysora-mint/10 text-sysora-mint text-xs rounded-full font-medium">
                              BASE
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{currency.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">
                        {currency.isBase ? '1.0000' : currency.rate.toLocaleString(undefined, {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 6
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        1 {baseCurrency} = {currency.rate.toLocaleString()} {currency.code}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getChangeIcon(currency.change24h)}
                      <span className={`font-medium ${getChangeColor(currency.change24h)}`}>
                        {currency.change24h > 0 ? '+' : ''}{currency.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {currency.lastUpdate.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleCurrencyStatus(currency.code)}
                      disabled={currency.isBase}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        currency.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${currency.isBase ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {currency.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" 
                        title="Edit Settings"
                        disabled={currency.isBase}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurrencyManager;
