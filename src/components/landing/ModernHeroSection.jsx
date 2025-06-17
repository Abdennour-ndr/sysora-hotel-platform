import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Play, Sparkles, Zap, Shield, Clock, Star } from 'lucide-react';
import { Button, Card } from '../ui';

/**
 * Modern Hero Section for Sysora Landing Page
 * Professional design with the new design system
 */
const ModernHeroSection = ({ onGetStarted, onWatchDemo }) => {
  const stats = [
    { value: '500+', label: 'Hotels Trust Us', icon: <Shield className="w-5 h-5" /> },
    { value: '99.9%', label: 'Uptime', icon: <Zap className="w-5 h-5" /> },
    { value: '24/7', label: 'Support', icon: <Clock className="w-5 h-5" /> },
    { value: '4.9/5', label: 'Rating', icon: <Star className="w-5 h-5" /> },
  ];

  const benefits = [
    'Save 15+ hours per week',
    'Increase revenue by 25%',
    'Real-time analytics',
    '24/7 Arabic support'
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sysora-midnight via-sysora-midnight-light to-sysora-midnight overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-sysora-mint/5 via-transparent to-blue-500/5" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-sysora-mint/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </div>

      <div className="relative container-responsive py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Trust Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-sysora-mint/20 backdrop-blur-sm border border-sysora-mint/30 rounded-full px-4 py-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-sysora-mint" />
              <span className="text-sm font-medium text-sysora-mint">
                #1 Hotel Management Platform in Algeria
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Manage Your Hotel in
                <motion.span
                  className="block bg-gradient-to-r from-sysora-mint to-sysora-mint-light bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Minutes, Not Hours
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-neutral-300 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Save 40% of daily management time with Algeria's first intelligent hotel management system. 
                From reservations to billing, everything you need in one place.
              </motion.p>
            </div>

            {/* Benefits List */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                  <span className="text-neutral-300">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={onGetStarted}
                icon={<Zap className="w-5 h-5" />}
                className="text-lg px-8 py-4 shadow-mint-lg hover:shadow-mint-xl"
              >
                Start 14-Day Free Trial
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={onWatchDemo}
                icon={<Play className="w-5 h-5" />}
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center gap-6 text-sm text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-info-400" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-warning-400" />
                <span>30-day money-back guarantee</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex items-center justify-center mb-2 text-sysora-mint">
                    {stat.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Main Dashboard Card */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                variant="glass"
                className="p-8 backdrop-blur-xl border-white/20 shadow-2xl"
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Hotel Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-error-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div
                    className="bg-sysora-mint/10 backdrop-blur-sm p-4 rounded-xl border border-sysora-mint/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-sysora-mint rounded-full"></div>
                      <span className="text-sm text-neutral-300">Today's Bookings</span>
                    </div>
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-success-400">+12% from yesterday</div>
                  </motion.div>

                  <motion.div
                    className="bg-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-neutral-300">Occupancy</span>
                    </div>
                    <div className="text-2xl font-bold text-white">87%</div>
                    <div className="text-xs text-success-400">+5% this week</div>
                  </motion.div>
                </div>

                {/* Chart Area */}
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-300">Revenue Trend</span>
                    <Zap className="w-4 h-4 text-sysora-mint" />
                  </div>
                  <div className="h-24 bg-gradient-to-r from-sysora-mint/20 to-blue-500/20 rounded-lg flex items-end justify-center relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sysora-mint/30 to-blue-500/30"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                    <div className="relative text-sm text-white font-medium">
                      ↗ +23% this month
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-6 w-20 h-20 bg-sysora-mint/20 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;
