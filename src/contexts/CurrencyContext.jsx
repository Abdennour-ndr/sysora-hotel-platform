import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Return default currency if context is not available
    return {
      code: 'DZD',
      symbol: 'دج',
      name: 'Algerian Dinar',
      rate: 1
    };
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState({
    code: 'DZD',
    symbol: 'دج',
    name: 'Algerian Dinar',
    rate: 1
  });

  const [availableCurrencies] = useState([
    { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar', rate: 1 },
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0075 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0068 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0059 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.010 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.011 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1.1 },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.0067 },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 0.054 },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', rate: 0.028 },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.027 },
    { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound', rate: 0.37 },
    { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', rate: 0.023 },
    { code: 'MAD', symbol: 'د.م', name: 'Moroccan Dirham', rate: 0.075 }
  ]);

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('sysora_currency');
    if (savedCurrency) {
      try {
        const parsedCurrency = JSON.parse(savedCurrency);
        const foundCurrency = availableCurrencies.find(c => c.code === parsedCurrency.code);
        if (foundCurrency) {
          setCurrency(foundCurrency);
        }
      } catch (error) {
        console.error('Error parsing saved currency:', error);
      }
    }
  }, [availableCurrencies]);

  const changeCurrency = (currencyCode) => {
    const newCurrency = availableCurrencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
      localStorage.setItem('sysora_currency', JSON.stringify(newCurrency));
    }
  };

  const convertAmount = (amount, fromCurrency = 'DZD', toCurrency = currency.code) => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = availableCurrencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = availableCurrencies.find(c => c.code === toCurrency)?.rate || 1;
    
    // Convert to DZD first, then to target currency
    const dzdAmount = amount / fromRate;
    return dzdAmount * toRate;
  };

  const formatAmount = (amount, currencyCode = currency.code, options = {}) => {
    const targetCurrency = availableCurrencies.find(c => c.code === currencyCode) || currency;
    const convertedAmount = convertAmount(amount, 'DZD', currencyCode);
    
    const defaultOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    };

    try {
      // Use Intl.NumberFormat for proper formatting
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        ...defaultOptions
      });
      
      return formatter.format(convertedAmount);
    } catch (error) {
      // Fallback formatting
      return `${targetCurrency.symbol} ${convertedAmount.toLocaleString('en-US', defaultOptions)}`;
    }
  };

  const value = {
    ...currency,
    availableCurrencies,
    changeCurrency,
    convertAmount,
    formatAmount
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
