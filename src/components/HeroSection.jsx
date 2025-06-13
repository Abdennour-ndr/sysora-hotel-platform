import React from 'react'
import { ArrowRight, BarChart3, Calendar, Users, Zap } from 'lucide-react'

const HeroSection = ({ onGetStarted }) => {
  const scrollToModules = () => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section-padding bg-gradient-to-br from-sysora-light to-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sysora-midnight leading-tight">
                Sysora
                <span className="block text-sysora-mint">Master Your Operations</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                All-in-one cloud platform for managing hotels, restaurants, retail, and more. 
                Start with our hotel reservation system and expand as you grow.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="btn-primary flex items-center justify-center space-x-2 text-lg"
              >
                <span>Start Hotel Reservation – $1 for 3 Months</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollToModules}
                className="btn-secondary flex items-center justify-center space-x-2 text-lg"
              >
                <span>See All Modules</span>
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-sysora-midnight">3 Days</div>
                <div className="text-sm text-gray-600">Free Trial</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sysora-midnight">$1</div>
                <div className="text-sm text-gray-600">First 3 Months</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sysora-midnight">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="card bg-white p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-sysora-midnight">Hotel Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sysora-light p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-sysora-mint" />
                      <span className="text-sm text-gray-600">Today's Bookings</span>
                    </div>
                    <div className="text-2xl font-bold text-sysora-midnight mt-2">24</div>
                  </div>
                  <div className="bg-sysora-light p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-sysora-mint" />
                      <span className="text-sm text-gray-600">Occupancy</span>
                    </div>
                    <div className="text-2xl font-bold text-sysora-midnight mt-2">87%</div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-sysora-light p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Revenue Trend</span>
                    <Zap className="w-4 h-4 text-sysora-mint" />
                  </div>
                  <div className="h-20 bg-gradient-to-r from-sysora-mint/20 to-sysora-mint/40 rounded-xl flex items-end justify-center">
                    <div className="text-xs text-sysora-midnight font-medium">↗ +23% this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
