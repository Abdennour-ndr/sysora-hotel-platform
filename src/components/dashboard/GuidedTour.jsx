import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Play,
  BarChart3,
  Calendar,
  Users,
  Bed,
  CreditCard,
  Settings
} from 'lucide-react';

const GuidedTour = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Sysora!',
      description: 'Let\'s take a quick tour to help you get started with your hotel management system.',
      icon: Play,
      target: null,
      position: 'center'
    },
    {
      id: 'overview',
      title: 'Dashboard Overview',
      description: 'This is your main dashboard where you can see all important metrics at a glance.',
      icon: BarChart3,
      target: '[data-tour="overview"]',
      position: 'bottom'
    },
    {
      id: 'reservations',
      title: 'Reservations Management',
      description: 'Manage all your bookings, check-ins, and check-outs from this section.',
      icon: Calendar,
      target: '[data-tour="reservations"]',
      position: 'bottom'
    },
    {
      id: 'rooms',
      title: 'Room Management',
      description: 'Add, edit, and manage your hotel rooms, including pricing and availability.',
      icon: Bed,
      target: '[data-tour="rooms"]',
      position: 'bottom'
    },
    {
      id: 'guests',
      title: 'Guest Management',
      description: 'Keep track of your guests, their preferences, and booking history.',
      icon: Users,
      target: '[data-tour="guests"]',
      position: 'bottom'
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      description: 'Handle payments, generate invoices, and track your revenue.',
      icon: CreditCard,
      target: '[data-tour="payments"]',
      position: 'bottom'
    },
    {
      id: 'settings',
      title: 'Settings & Customization',
      description: 'Customize your hotel profile, preferences, and system settings.',
      icon: Settings,
      target: '[data-tour="settings"]',
      position: 'bottom'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'You\'ve completed the tour. Start managing your hotel with confidence!',
      icon: CheckCircle,
      target: null,
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when tour is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('sysora_tour_completed', 'true');
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('sysora_tour_skipped', 'true');
    onClose();
  };

  const getTooltipPosition = (target, position) => {
    if (!target) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const element = document.querySelector(target);
    if (!element) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = element.getBoundingClientRect();
    
    switch (position) {
      case 'bottom':
        return {
          top: rect.bottom + 20,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'top':
        return {
          top: rect.top - 20,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%) translateY(-100%)'
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 20,
          transform: 'translateY(-50%)'
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 20,
          transform: 'translateY(-50%) translateX(-100%)'
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  if (!isVisible) return null;

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;
  const tooltipStyle = getTooltipPosition(currentStepData.target, currentStepData.position);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Highlight target element */}
      {currentStepData.target && (
        <div 
          className="absolute pointer-events-none"
          style={{
            boxShadow: '0 0 0 4px rgba(46, 196, 182, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}

      {/* Tooltip */}
      <div 
        className="absolute z-10 max-w-sm"
        style={tooltipStyle}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sysora-mint/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-sysora-mint" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-sysora-midnight">{currentStepData.title}</h3>
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {tourSteps.length}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-600 mb-6">{currentStepData.description}</p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-sysora-mint h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-sysora-mint hover:bg-sysora-mint/90 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                <span>{currentStep === tourSteps.length - 1 ? 'Complete' : 'Next'}</span>
                {currentStep === tourSteps.length - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
