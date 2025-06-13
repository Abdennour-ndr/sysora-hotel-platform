import React from 'react';
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
  Star
} from 'lucide-react';

const WhySysoraSection = ({ onGetStarted }) => {
  const benefits = [
    {
      icon: Clock,
      title: "Save 15 Hours Per Week",
      description: "Automate repetitive tasks and streamline operations with intelligent workflows",
      stat: "40% time savings",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Increase Revenue by 25%",
      description: "Optimize pricing, reduce no-shows, and maximize occupancy rates",
      stat: "25% revenue boost",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Headphones,
      title: "24/7 Arabic Support",
      description: "Get help when you need it with our dedicated local support team",
      stat: "< 2min response",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with data encryption and regular backups",
      stat: "99.9% uptime",
      color: "from-red-500 to-red-600"
    }
  ];

  const comparisons = [
    {
      traditional: "Manual booking management",
      sysora: "Automated reservation system",
      improvement: "10x faster"
    },
    {
      traditional: "Paper-based guest records",
      sysora: "Digital guest profiles with history",
      improvement: "Instant access"
    },
    {
      traditional: "Excel spreadsheet reporting",
      sysora: "Real-time analytics dashboard",
      improvement: "Live insights"
    },
    {
      traditional: "Phone-only customer service",
      sysora: "Multi-channel guest communication",
      improvement: "Better experience"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Why Choose Sysora?</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-sysora-midnight mb-6">
            The Smart Choice for
            <span className="block text-sysora-mint">Modern Hotels</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of hotels across Algeria who have transformed their operations 
            and increased profitability with Sysora's intelligent management platform.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-sysora-midnight mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{benefit.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sysora-mint font-semibold text-sm">{benefit.stat}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-sysora-mint transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Before vs After Comparison */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-sysora-midnight mb-4">
              Traditional vs Sysora
            </h3>
            <p className="text-gray-600 text-lg">
              See how Sysora transforms hotel management
            </p>
          </div>

          <div className="grid gap-6">
            {comparisons.map((comparison, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <span className="text-gray-600">{comparison.traditional}</span>
                </div>
                
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-sysora-mint" />
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sysora-midnight font-medium">{comparison.sysora}</span>
                    <div className="text-sysora-mint text-sm font-semibold">{comparison.improvement}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-sysora-midnight to-blue-900 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Hotel?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the growing community of successful hotels using Sysora. 
              Start your free trial today and see the difference in just 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="btn-primary bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <Zap className="w-5 h-5" />
                </span>
              </button>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySysoraSection;
