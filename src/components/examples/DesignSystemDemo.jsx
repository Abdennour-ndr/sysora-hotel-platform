import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UIShowcase from './UIShowcase';
import ModernDashboard from './ModernDashboard';

/**
 * Design System Demo - Complete showcase of the new Sysora design system
 * This component allows switching between different demo views
 */
const DesignSystemDemo = () => {
  const [activeDemo, setActiveDemo] = useState('showcase');

  const demos = [
    {
      id: 'showcase',
      title: 'UI Components Showcase',
      description: 'Explore all available UI components',
      component: UIShowcase
    },
    {
      id: 'dashboard',
      title: 'Modern Dashboard',
      description: 'Complete dashboard implementation',
      component: ModernDashboard
    }
  ];

  const ActiveComponent = demos.find(demo => demo.id === activeDemo)?.component;

  return (
    <div className="min-h-screen bg-sysora-light">
      {/* Demo Selector */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sysora-midnight">
                🎨 Sysora Design System
              </h1>
              <p className="text-neutral-600 mt-1">
                Professional UI components for modern hotel management
              </p>
            </div>
            <div className="flex space-x-2">
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`
                    px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
                    ${activeDemo === demo.id
                      ? 'bg-sysora-mint text-sysora-midnight shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }
                  `}
                >
                  {demo.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <motion.div
        key={activeDemo}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {ActiveComponent && <ActiveComponent />}
      </motion.div>

      {/* Design System Info */}
      <div className="bg-sysora-midnight text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🎨 Design Principles</h3>
              <ul className="space-y-2 text-neutral-300">
                <li>• Professional & Modern</li>
                <li>• Consistent & Scalable</li>
                <li>• Accessible & Inclusive</li>
                <li>• Mobile-First Responsive</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">🛠️ Technologies</h3>
              <ul className="space-y-2 text-neutral-300">
                <li>• React 18 + Hooks</li>
                <li>• Tailwind CSS 3.3</li>
                <li>• Framer Motion</li>
                <li>• Inter Font Family</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">📱 Features</h3>
              <ul className="space-y-2 text-neutral-300">
                <li>• Dark/Light Mode Support</li>
                <li>• RTL Language Support</li>
                <li>• Advanced Animations</li>
                <li>• Accessibility Ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
