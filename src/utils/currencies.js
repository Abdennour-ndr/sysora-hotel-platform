// Supported currencies for Sysora platform
export const CURRENCIES = {
  // الدينار الجزائري - العملة الافتراضية
  DZD: {
    code: 'DZD',
    symbol: 'دج',
    name: 'الدينار الجزائري',
    nameEn: 'Algerian Dinar',
    position: 'after',
    decimals: 2,
    country: 'الجزائر',
    flag: '🇩🇿'
  },

  // العملات العربية
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'الريال السعودي',
    nameEn: 'Saudi Riyal',
    position: 'after',
    decimals: 2,
    country: 'السعودية',
    flag: '🇸🇦'
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'الدرهم الإماراتي',
    nameEn: 'UAE Dirham',
    position: 'after',
    decimals: 2,
    country: 'الإمارات',
    flag: '🇦🇪'
  },
  EGP: {
    code: 'EGP',
    symbol: 'ج.م',
    name: 'الجنيه المصري',
    nameEn: 'Egyptian Pound',
    position: 'after',
    decimals: 2,
    country: 'مصر',
    flag: '🇪🇬'
  },
  MAD: {
    code: 'MAD',
    symbol: 'د.م',
    name: 'الدرهم المغربي',
    nameEn: 'Moroccan Dirham',
    position: 'after',
    decimals: 2,
    country: 'المغرب',
    flag: '🇲🇦'
  },
  TND: {
    code: 'TND',
    symbol: 'د.ت',
    name: 'الدينار التونسي',
    nameEn: 'Tunisian Dinar',
    position: 'after',
    decimals: 3,
    country: 'تونس',
    flag: '🇹🇳'
  },
  JOD: {
    code: 'JOD',
    symbol: 'د.أ',
    name: 'الدينار الأردني',
    nameEn: 'Jordanian Dinar',
    position: 'after',
    decimals: 3,
    country: 'الأردن',
    flag: '🇯🇴'
  },
  KWD: {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'الدينار الكويتي',
    nameEn: 'Kuwaiti Dinar',
    position: 'after',
    decimals: 3,
    country: 'الكويت',
    flag: '🇰🇼'
  },
  BHD: {
    code: 'BHD',
    symbol: 'د.ب',
    name: 'الدينار البحريني',
    nameEn: 'Bahraini Dinar',
    position: 'after',
    decimals: 3,
    country: 'البحرين',
    flag: '🇧🇭'
  },
  QAR: {
    code: 'QAR',
    symbol: 'ر.ق',
    name: 'الريال القطري',
    nameEn: 'Qatari Riyal',
    position: 'after',
    decimals: 2,
    country: 'قطر',
    flag: '🇶🇦'
  },
  OMR: {
    code: 'OMR',
    symbol: 'ر.ع',
    name: 'الريال العماني',
    nameEn: 'Omani Rial',
    position: 'after',
    decimals: 3,
    country: 'عمان',
    flag: '🇴🇲'
  },
  LBP: {
    code: 'LBP',
    symbol: 'ل.ل',
    name: 'الليرة اللبنانية',
    nameEn: 'Lebanese Pound',
    position: 'after',
    decimals: 2,
    country: 'لبنان',
    flag: '🇱🇧'
  },
  SYP: {
    code: 'SYP',
    symbol: 'ل.س',
    name: 'الليرة السورية',
    nameEn: 'Syrian Pound',
    position: 'after',
    decimals: 2,
    country: 'سوريا',
    flag: '🇸🇾'
  },
  IQD: {
    code: 'IQD',
    symbol: 'د.ع',
    name: 'الدينار العراقي',
    nameEn: 'Iraqi Dinar',
    position: 'after',
    decimals: 3,
    country: 'العراق',
    flag: '🇮🇶'
  },

  // العملات الدولية الرئيسية
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'الدولار الأمريكي',
    nameEn: 'US Dollar',
    position: 'before',
    decimals: 2,
    country: 'الولايات المتحدة',
    flag: '🇺🇸'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'اليورو',
    nameEn: 'Euro',
    position: 'before',
    decimals: 2,
    country: 'الاتحاد الأوروبي',
    flag: '🇪🇺'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'الجنيه الإسترليني',
    nameEn: 'British Pound',
    position: 'before',
    decimals: 2,
    country: 'المملكة المتحدة',
    flag: '🇬🇧'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'الين الياباني',
    nameEn: 'Japanese Yen',
    position: 'before',
    decimals: 0,
    country: 'اليابان',
    flag: '🇯🇵'
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'الفرنك السويسري',
    nameEn: 'Swiss Franc',
    position: 'after',
    decimals: 2,
    country: 'سويسرا',
    flag: '🇨🇭'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'الدولار الكندي',
    nameEn: 'Canadian Dollar',
    position: 'before',
    decimals: 2,
    country: 'كندا',
    flag: '🇨🇦'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'الدولار الأسترالي',
    nameEn: 'Australian Dollar',
    position: 'before',
    decimals: 2,
    country: 'أستراليا',
    flag: '🇦🇺'
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'اليوان الصيني',
    nameEn: 'Chinese Yuan',
    position: 'before',
    decimals: 2,
    country: 'الصين',
    flag: '🇨🇳'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'الروبية الهندية',
    nameEn: 'Indian Rupee',
    position: 'before',
    decimals: 2,
    country: 'الهند',
    flag: '🇮🇳'
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'الليرة التركية',
    nameEn: 'Turkish Lira',
    position: 'after',
    decimals: 2,
    country: 'تركيا',
    flag: '🇹🇷'
  },
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'الروبل الروسي',
    nameEn: 'Russian Ruble',
    position: 'after',
    decimals: 2,
    country: 'روسيا',
    flag: '🇷🇺'
  }
};

// Get currency list grouped by region
export const getCurrenciesByRegion = () => {
  return {
    'العملات العربية': [
      'DZD', 'SAR', 'AED', 'EGP', 'MAD', 'TND', 
      'JOD', 'KWD', 'BHD', 'QAR', 'OMR', 'LBP', 'SYP', 'IQD'
    ],
    'العملات الدولية': [
      'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR', 'TRY', 'RUB'
    ]
  };
};

// Format currency amount
export const formatCurrency = (amount, currencyCode = 'DZD') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.DZD;
  const formattedAmount = Number(amount).toFixed(currency.decimals);
  
  if (currency.position === 'before') {
    return `${currency.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${currency.symbol}`;
  }
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode = 'DZD') => {
  return CURRENCIES[currencyCode]?.symbol || 'DZD';
};

// Get currency name
export const getCurrencyName = (currencyCode = 'DZD', language = 'ar') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.DZD;
  return language === 'en' ? currency.nameEn : currency.name;
};

// Convert currency (placeholder - would need real exchange rates)
export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRates = {}) => {
  if (fromCurrency === toCurrency) return amount;
  
  // This would integrate with a real exchange rate API
  // For now, return the same amount as placeholder
  return amount;
};

export default CURRENCIES;
