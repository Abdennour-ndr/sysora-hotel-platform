import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Sysora Brand Colors - مطابقة للويب أبليكيشن
export const COLORS = {
  // Primary Colors
  primary: '#2EC4B6',        // sysora-mint
  primaryDark: '#26A69A',    // darker mint
  primaryLight: '#4FD1C7',   // lighter mint
  
  // Secondary Colors
  secondary: '#002D5B',      // sysora-midnight
  secondaryDark: '#001A35',  // darker midnight
  secondaryLight: '#1A4B73', // lighter midnight
  
  // Background Colors
  background: '#F9FAFB',     // sysora-light
  surface: '#FFFFFF',        // white
  card: '#FFFFFF',           // white
  
  // Text Colors
  text: '#1F2937',           // dark gray
  textSecondary: '#6B7280',  // medium gray
  textLight: '#9CA3AF',      // light gray
  textInverse: '#FFFFFF',    // white
  
  // Status Colors
  success: '#10B981',        // green
  warning: '#F59E0B',        // amber
  error: '#EF4444',          // red
  info: '#3B82F6',           // blue
  
  // Utility Colors
  border: '#E5E7EB',         // light gray
  divider: '#F3F4F6',        // very light gray
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Transparent variations
  primaryAlpha: 'rgba(46, 196, 182, 0.1)',
  secondaryAlpha: 'rgba(0, 45, 91, 0.1)',
  successAlpha: 'rgba(16, 185, 129, 0.1)',
  warningAlpha: 'rgba(245, 158, 11, 0.1)',
  errorAlpha: 'rgba(239, 68, 68, 0.1)',
};

// Typography
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
    arabic: Platform.OS === 'ios' ? 'System' : 'NotoSansArabic',
  },
  
  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Text Styles
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: COLORS.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: COLORS.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: COLORS.text,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textInverse,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border Radius
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
};

// Layout
export const LAYOUT = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isLargeDevice: width >= 414,
  headerHeight: Platform.OS === 'ios' ? 88 : 64,
  tabBarHeight: Platform.OS === 'ios' ? 83 : 60,
  statusBarHeight: Platform.OS === 'ios' ? 44 : 24,
};

// Animation
export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Complete Theme Object
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  layout: LAYOUT,
  animation: ANIMATION,
};

export default theme;
