import React from 'react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencies';

const CurrencyDisplay = ({ 
  amount, 
  currencyCode = 'DZD', 
  className = '', 
  showCode = false,
  size = 'normal' 
}) => {
  const formattedAmount = formatCurrency(amount, currencyCode);
  const symbol = getCurrencySymbol(currencyCode);
  
  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  return (
    <span className={`font-medium ${sizeClasses[size]} ${className}`}>
      {formattedAmount}
      {showCode && (
        <span className="text-xs text-gray-500 ml-1">
          {currencyCode}
        </span>
      )}
    </span>
  );
};

// Hook to get current hotel currency
export const useCurrency = () => {
  const [currency, setCurrency] = React.useState({
    code: 'DZD',
    symbol: 'DZD',
    name: 'Algerian Dinar',
    nameEn: 'Algerian Dinar',
    position: 'after'
  });

  React.useEffect(() => {
    // Get currency from hotel settings
    const fetchCurrency = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/hotels/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.settings?.currency) {
            setCurrency(data.data.settings.currency);
          }
        }
      } catch (error) {
        console.error('Failed to fetch currency settings:', error);
      }
    };

    fetchCurrency();
  }, []);

  return currency;
};

export default CurrencyDisplay;
