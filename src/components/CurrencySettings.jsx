import React, { useState, useEffect } from 'react';
import { DollarSign, Globe, Check, Search } from 'lucide-react';
import { CURRENCIES, getCurrenciesByRegion, formatCurrency } from '../utils/currencies';

const CurrencySettings = ({ currentCurrency, onCurrencyChange, onSave }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency || 'DZD');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const currenciesByRegion = getCurrenciesByRegion();

  // Filter currencies based on search term
  const filterCurrencies = (currencies) => {
    if (!searchTerm) return currencies;
    
    return currencies.filter(code => {
      const currency = CURRENCIES[code];
      return (
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.symbol.includes(searchTerm)
      );
    });
  };

  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    if (onCurrencyChange) {
      onCurrencyChange(currencyCode);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(selectedCurrency);
      }
      window.showToast?.('تم تحديث العملة بنجاح', 'success');
    } catch (error) {
      console.error('Currency save error:', error);
      window.showToast?.('فشل في تحديث العملة', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-sysora-mint" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sysora-midnight">إعدادات العملة</h3>
          <p className="text-sm text-gray-600">اختر العملة الافتراضية لفندقك</p>
        </div>
      </div>

      {/* Current Currency Display */}
      <div className="bg-sysora-light p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">العملة الحالية</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl">{CURRENCIES[selectedCurrency]?.flag}</span>
              <div>
                <p className="font-semibold text-sysora-midnight">
                  {CURRENCIES[selectedCurrency]?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {CURRENCIES[selectedCurrency]?.code} - {CURRENCIES[selectedCurrency]?.symbol}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">مثال</p>
            <p className="text-lg font-bold text-sysora-mint">
              {formatCurrency(1250.50, selectedCurrency)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="البحث عن عملة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent"
        />
      </div>

      {/* Currency List */}
      <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
        {Object.entries(currenciesByRegion).map(([region, currencies]) => {
          const filteredCurrencies = filterCurrencies(currencies);
          
          if (filteredCurrencies.length === 0) return null;

          return (
            <div key={region}>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>{region}</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {filteredCurrencies.map((currencyCode) => {
                  const currency = CURRENCIES[currencyCode];
                  const isSelected = selectedCurrency === currencyCode;
                  
                  return (
                    <button
                      key={currencyCode}
                      onClick={() => handleCurrencySelect(currencyCode)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-sysora-mint bg-sysora-mint/5'
                          : 'border-gray-200 hover:border-sysora-mint/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sysora-midnight">
                                {currency.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({currency.nameEn})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                {currency.code}
                              </span>
                              <span className="text-sm text-gray-600">
                                {currency.symbol}
                              </span>
                              <span className="text-xs text-gray-500">
                                {currency.country}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-sysora-midnight">
                              {formatCurrency(100, currencyCode)}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-sysora-mint rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving || selectedCurrency === currentCurrency}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>حفظ العملة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CurrencySettings;
