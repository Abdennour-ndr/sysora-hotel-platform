// Design Tokens System for Consistent UI
export const designTokens = {
  // Spacing System (based on 4px grid)
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },

  // Icon Sizes
  iconSize: {
    xs: 'w-3 h-3',    // 12px - indicators
    sm: 'w-4 h-4',    // 16px - buttons, inline
    md: 'w-5 h-5',    // 20px - cards, status
    lg: 'w-6 h-6',    // 24px - headers, stats
    xl: 'w-8 h-8',    // 32px - main icons
    '2xl': 'w-12 h-12' // 48px - hero icons
  },

  // Typography Scale
  fontSize: {
    xs: 'text-xs',     // 12px
    sm: 'text-sm',     // 14px
    base: 'text-base', // 16px
    lg: 'text-lg',     // 18px
    xl: 'text-xl',     // 20px
    '2xl': 'text-2xl', // 24px
    '3xl': 'text-3xl'  // 30px
  },

  // Font Weights
  fontWeight: {
    normal: 'font-normal',     // 400
    medium: 'font-medium',     // 500
    semibold: 'font-semibold', // 600
    bold: 'font-bold'          // 700
  },

  // Border Radius
  borderRadius: {
    sm: 'rounded-md',    // 6px
    md: 'rounded-lg',    // 8px
    lg: 'rounded-xl',    // 12px
    xl: 'rounded-2xl',   // 16px
    full: 'rounded-full' // 50%
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm',     // subtle
    md: 'shadow-md',     // default
    lg: 'shadow-lg',     // prominent
    xl: 'shadow-xl'      // dramatic
  },

  // Color System
  colors: {
    // Primary Grays
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },

    // Status Colors
    status: {
      available: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        light: 'bg-emerald-50'
      },
      occupied: {
        bg: 'bg-blue-500',
        text: 'text-blue-700',
        border: 'border-blue-200',
        light: 'bg-blue-50'
      },
      cleaning: {
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        border: 'border-amber-200',
        light: 'bg-amber-50'
      },
      maintenance: {
        bg: 'bg-red-500',
        text: 'text-red-700',
        border: 'border-red-200',
        light: 'bg-red-50'
      },
      outOfOrder: {
        bg: 'bg-gray-500',
        text: 'text-gray-700',
        border: 'border-gray-200',
        light: 'bg-gray-50'
      }
    },

    // Semantic Colors
    semantic: {
      success: {
        bg: 'bg-emerald-600',
        text: 'text-emerald-700',
        light: 'bg-emerald-50'
      },
      warning: {
        bg: 'bg-amber-600',
        text: 'text-amber-700',
        light: 'bg-amber-50'
      },
      error: {
        bg: 'bg-red-600',
        text: 'text-red-700',
        light: 'bg-red-50'
      },
      info: {
        bg: 'bg-blue-600',
        text: 'text-blue-700',
        light: 'bg-blue-50'
      }
    }
  },

  // Component Specific Tokens
  components: {
    card: {
      padding: 'p-6',
      radius: 'rounded-xl',
      shadow: 'shadow-sm',
      border: 'border border-gray-200/60',
      hover: 'hover:shadow-md',
      transition: 'transition-shadow duration-200'
    },

    button: {
      padding: {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-6 py-3'
      },
      radius: 'rounded-lg',
      transition: 'transition-all duration-200',
      focus: 'focus:outline-none focus:ring-2 focus:ring-offset-2'
    },

    input: {
      padding: 'px-3 py-2',
      radius: 'rounded-lg',
      border: 'border border-gray-300',
      focus: 'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent',
      transition: 'transition-colors'
    },

    modal: {
      backdrop: 'bg-gray-900/50 backdrop-blur-sm',
      container: 'bg-white rounded-2xl shadow-xl',
      maxWidth: 'max-w-lg',
      padding: 'p-6'
    },

    notification: {
      padding: 'p-4',
      radius: 'rounded-lg',
      shadow: 'shadow-lg',
      border: 'border-l-4',
      maxWidth: 'max-w-sm'
    },

    statCard: {
      iconContainer: 'w-12 h-12 rounded-xl flex items-center justify-center',
      valueText: 'text-2xl font-bold text-gray-900',
      labelText: 'text-sm text-gray-600'
    },

    roomCard: {
      container: 'group hover:shadow-lg transition-all duration-200 relative',
      header: 'flex items-start justify-between mb-4',
      roomNumber: 'w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center',
      actions: 'flex space-x-2',
      expandedActions: 'mt-3 pt-3 border-t border-gray-200 space-y-2'
    }
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: 'duration-150',
      normal: 'duration-200',
      slow: 'duration-300'
    },
    ease: {
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out'
    }
  },

  // Breakpoints (for reference)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// Helper functions for consistent usage
export const getIconSize = (size = 'md') => designTokens.iconSize[size];
export const getSpacing = (size = 'md') => designTokens.spacing[size];
export const getStatusColor = (status, type = 'bg') => designTokens.colors.status[status]?.[type];
export const getComponentStyle = (component, property) => designTokens.components[component]?.[property];

// Utility function to combine design tokens
export const combineTokens = (...tokens) => {
  return tokens.filter(Boolean).join(' ');
};

// Pre-defined component classes for consistency
export const componentClasses = {
  // Standard Card
  card: combineTokens(
    designTokens.components.card.padding,
    designTokens.components.card.radius,
    designTokens.components.card.shadow,
    designTokens.components.card.border,
    designTokens.components.card.hover,
    designTokens.components.card.transition
  ),

  // Primary Button
  buttonPrimary: combineTokens(
    designTokens.components.button.padding.md,
    designTokens.components.button.radius,
    designTokens.components.button.transition,
    designTokens.components.button.focus,
    'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-sm'
  ),

  // Secondary Button
  buttonSecondary: combineTokens(
    designTokens.components.button.padding.md,
    designTokens.components.button.radius,
    designTokens.components.button.transition,
    designTokens.components.button.focus,
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm'
  ),

  // Standard Input
  input: combineTokens(
    'block w-full',
    designTokens.components.input.padding,
    designTokens.components.input.radius,
    designTokens.components.input.border,
    designTokens.components.input.focus,
    designTokens.components.input.transition,
    'text-sm placeholder-gray-500'
  ),

  // Stat Card
  statCard: combineTokens(
    designTokens.components.card.padding,
    'cursor-pointer hover:shadow-lg transition-all'
  ),

  // Room Card
  roomCard: combineTokens(
    designTokens.components.roomCard.container
  )
};

export default designTokens;
