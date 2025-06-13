import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  const requirements = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
      id: 'length'
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      id: 'uppercase'
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      id: 'lowercase'
    },
    {
      label: 'Contains number',
      test: (pwd) => /\d/.test(pwd),
      id: 'number'
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      id: 'special'
    }
  ];

  const getPasswordStrength = () => {
    const passedRequirements = requirements.filter(req => req.test(password)).length;
    
    if (passedRequirements === 0) return { level: 0, label: '', color: '' };
    if (passedRequirements <= 2) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (passedRequirements <= 3) return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (passedRequirements <= 4) return { level: 3, label: 'Good', color: 'bg-blue-500' };
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength();

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Password Strength</span>
          {strength.label && (
            <span className={`text-xs font-medium ${
              strength.level === 1 ? 'text-red-600' :
              strength.level === 2 ? 'text-yellow-600' :
              strength.level === 3 ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {strength.label}
            </span>
          )}
        </div>
        
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                level <= strength.level ? strength.color : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((requirement) => {
          const isPassed = requirement.test(password);
          return (
            <div
              key={requirement.id}
              className={`flex items-center space-x-2 text-xs transition-colors duration-200 ${
                isPassed ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {isPassed ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              <span>{requirement.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
