import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  TrendingUp, 
  Headphones, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Star,
  Sparkles
} from 'lucide-react';
import { Button, Card } from '../ui';

/**
 * Modern Why Sysora Section
 * Updated to match the new design system
 */
const ModernWhySysoraSection = ({ onGetStarted }) => {
  const benefits = [
    {
      icon: Clock,
      title: "Save 15 Hours Per Week",
      description: "Automate repetitive tasks and streamline operations with intelligent workflows that work 24/7",
      stat: "40% time savings",
      color: "sysora-mint",
      gradient: "from-sysora-mint/20 to-sysora-mint/5",
      statColor: "text-sysora-mint"
    },
    {
      icon: TrendingUp,
      title: "Increase Revenue by 25%",
      description: "Optimize pricing strategies, reduce no-shows, and maximize occupancy rates with AI insights",
      stat: "25% revenue boost",
      color: "success-500",
      gradient: "from-success-100 to-success-50",
      statColor: "text-success-600",
      iconBg: "bg-success-100",
      iconColor: "text-success-600"
    },
    {
      icon: Headphones,
      title: "24/7 Arabic Support",
      description: "Get expert help when you need it with our dedicated local support team in your language",
      stat: "< 2min response",
      color: "info-500",
      gradient: "from-info-100 to-info-50",
      statColor: "text-info-600",
      iconBg: "bg-info-100",
      iconColor: "text-info-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption, regular backups, and compliance standards",
      stat: "99.9% uptime",
      color: "warning-500",
      gradient: "from-warning-100 to-warning-50",
      statColor: "text-warning-600",
      iconBg: "bg-warning-100",
      iconColor: "text-warning-600"
    }
  ];

  const comparisons = [
    {
      traditional: "Manual booking management",
      sysora: "Automated reservation system with real-time sync",
      improvement: "10x faster processing",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      traditional: "Paper-based guest records",
      sysora: "Digital guest profiles with complete history",
      improvement: "Instant access anywhere",
      icon: <Users className="w-5 h-5" />
    },
    {
      traditional: "Excel spreadsheet reporting",
      sysora: "Real-time analytics dashboard with AI insights",
      improvement: "Live business intelligence",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      traditional: "Phone-only customer service",
      sysora: "Multi-channel guest communication platform",
      improvement: "Superior guest experience",
      icon: <Headphones className="w-5 h-5" />
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
    <section className="section-padding bg-gradient-to-br from-sysora-light via-white to-neutral-50">
      <div className="container-responsive">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-6 py-3 rounded-full font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-5 h-5" />
            <span>Why Choose Sysora?</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-sysora-midnight mb-6">
            The Smart Choice for
            <span className="block bg-gradient-to-r from-sysora-mint to-sysora-mint-dark bg-clip-text text-transparent">
              Modern Hotels
            </span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Join 500+ hotels across Algeria who have transformed their operations 
            and increased profitability with Sysora's intelligent management platform.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant="elevated"
                  hover
                  className={`h-full bg-gradient-to-br ${benefit.gradient} border-l-4 border-l-sysora-mint`}
                >
                  <Card.Content className="p-8">
                    <div className="space-y-4">
                      <div className={`w-16 h-16 ${benefit.iconBg} rounded-xl flex items-center justify-center ${benefit.iconColor} mb-6`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-sysora-midnight">
                        {benefit.title}
                      </h3>
                      
                      <p className="text-neutral-600 leading-relaxed">
                        {benefit.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                        <span className={`${benefit.statColor} font-bold text-lg`}>
                          {benefit.stat}
                        </span>
                        <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-sysora-mint transition-colors" />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Before vs After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card variant="elevated" className="overflow-hidden">
            <Card.Content className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl lg:text-4xl font-bold text-sysora-midnight mb-4">
                  Traditional vs Sysora
                </h3>
                <p className="text-neutral-600 text-lg">
                  See how Sysora transforms every aspect of hotel management
                </p>
              </div>

              <div className="space-y-6">
                {comparisons.map((comparison, index) => (
                  <motion.div
                    key={index}
                    className="grid md:grid-cols-3 gap-6 items-center p-6 rounded-xl hover:bg-neutral-50 transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    {/* Traditional Method */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-error-600 text-lg font-bold">✕</span>
                      </div>
                      <div>
                        <span className="text-neutral-700 font-medium">{comparison.traditional}</span>
                        <div className="text-sm text-neutral-500">Old way</div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-sysora-mint/10 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 text-sysora-mint" />
                      </div>
                    </div>
                    
                    {/* Sysora Method */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sysora-midnight font-semibold">{comparison.sysora}</div>
                        <div className="text-sysora-mint text-sm font-bold">{comparison.improvement}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-sysora-midnight via-sysora-midnight-light to-sysora-midnight">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sysora-mint/10 via-transparent to-blue-500/10" />
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 bg-sysora-mint/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <Card.Content className="relative p-8 lg:p-12 text-center text-white">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Transform Your Hotel?
              </h3>
              <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join the growing community of successful hotels using Sysora. 
                Start your free trial today and see the difference in just 24 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={onGetStarted}
                  icon={<Zap className="w-5 h-5" />}
                  className="text-lg px-8 py-4 shadow-mint-lg hover:shadow-mint-xl"
                >
                  Start Free Trial Now
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('/hotel-demo', '_blank')}
                  className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-400" />
                  <span>Setup in 5 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernWhySysoraSection;
