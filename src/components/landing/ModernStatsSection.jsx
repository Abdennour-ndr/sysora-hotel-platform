import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building, Star, Clock, Shield, Zap, Globe } from 'lucide-react';
import { Card } from '../ui';
import AnimatedCounter from '../AnimatedCounter';

/**
 * Modern Stats Section for Sysora Landing Page
 * Showcases platform statistics and achievements
 */
const ModernStatsSection = () => {
  const mainStats = [
    {
      icon: <Building className="w-8 h-8" />,
      value: 500,
      suffix: '+',
      label: 'Hotels Trust Us',
      description: 'Across Algeria and MENA',
      color: 'sysora-mint',
      gradient: 'from-sysora-mint/20 to-sysora-mint/5'
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: 50000,
      suffix: '+',
      label: 'Reservations Managed',
      description: 'Monthly bookings processed',
      color: 'blue-500',
      gradient: 'from-blue-500/20 to-blue-500/5'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: 25,
      suffix: '%',
      label: 'Revenue Increase',
      description: 'Average for our clients',
      color: 'success-500',
      gradient: 'from-success-500/20 to-success-500/5'
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.9,
      suffix: '/5',
      decimals: 1,
      label: 'Customer Rating',
      description: 'Based on 1000+ reviews',
      color: 'warning-500',
      gradient: 'from-warning-500/20 to-warning-500/5'
    }
  ];

  const achievements = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: '99.9% Uptime',
      description: 'Reliable service you can count on'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Bank-level Security',
      description: 'Your data is protected with enterprise-grade encryption'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Average response time under 200ms'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-language',
      description: 'Arabic, English, and French support'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="section-padding bg-gradient-to-br from-sysora-midnight to-sysora-midnight-light text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
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
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </div>

      <div className="relative container-responsive">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-sysora-mint/20 backdrop-blur-sm border border-sysora-mint/30 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TrendingUp className="w-4 h-4 text-sysora-mint" />
            <span className="text-sm font-medium text-sysora-mint">
              Trusted by Industry Leaders
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Numbers That Speak for
            <span className="block bg-gradient-to-r from-sysora-mint to-sysora-mint-light bg-clip-text text-transparent">
              Our Success
            </span>
          </h2>
          
          <p className="text-xl text-neutral-300 leading-relaxed">
            Join hundreds of hotels that have transformed their operations and 
            increased revenue with Sysora's intelligent platform.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mainStats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                variant="glass"
                className={`h-full bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border-white/20 hover:border-${stat.color}/30 transition-all duration-300`}
                hover
              >
                <Card.Content className="p-8 text-center">
                  <div className={`w-16 h-16 bg-${stat.color}/20 rounded-xl flex items-center justify-center text-${stat.color} mx-auto mb-6`}>
                    {stat.icon}
                  </div>
                  
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter 
                      end={stat.value} 
                      duration={2500 + index * 500}
                      decimals={stat.decimals || 0}
                    />
                    <span className={`text-${stat.color}`}>{stat.suffix}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {stat.label}
                  </h3>
                  
                  <p className="text-sm text-neutral-400">
                    {stat.description}
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-sysora-mint mx-auto mb-4">
                {achievement.icon}
              </div>
              
              <h4 className="font-semibold text-white mb-2">
                {achievement.title}
              </h4>
              
              <p className="text-sm text-neutral-400 leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Customer Logos Section */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <p className="text-neutral-400 mb-6">Trusted by leading hotels across Algeria</p>
            
            {/* Placeholder for customer logos */}
            <div className="flex items-center justify-center space-x-12 opacity-60">
              <div className="text-neutral-400 font-medium">Hotel Aurassi</div>
              <div className="text-neutral-400 font-medium">Sheraton Algiers</div>
              <div className="text-neutral-400 font-medium">Hilton Alger</div>
              <div className="text-neutral-400 font-medium">Sofitel Algiers</div>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning-400 fill-current" />
                ))}
              </div>
              <span className="text-white font-medium">4.9/5</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-400">1000+ reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernStatsSection;
