import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Sparkles } from 'lucide-react';
import { Card, Button } from './ui';

/**
 * Modern Testimonials Section for Sysora Landing Page
 * Updated to match the new design system and landing page style
 */
const ModernTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Ahmed Benali",
      position: "Hotel Manager",
      company: "Hotel Aurassi",
      location: "Algiers, Algeria",
      rating: 5,
      text: "Sysora transformed our hotel operations completely. We've seen a 30% increase in efficiency and our guests are happier than ever. The Arabic support is exceptional!",
      avatar: "AB",
      stats: { efficiency: "+30%", satisfaction: "98%" }
    },
    {
      id: 2,
      name: "Fatima Zahra",
      position: "Operations Director",
      company: "Sheraton Algiers",
      location: "Algiers, Algeria", 
      rating: 5,
      text: "The best investment we've made for our hotel. Real-time analytics helped us optimize our pricing strategy and increase revenue by 25%.",
      avatar: "FZ",
      stats: { revenue: "+25%", bookings: "+40%" }
    },
    {
      id: 3,
      name: "Omar Khelifi",
      position: "General Manager",
      company: "Hilton Alger",
      location: "Algiers, Algeria",
      rating: 5,
      text: "Outstanding platform with incredible support. The team understands the Algerian market perfectly. Setup was seamless and results were immediate.",
      avatar: "OK",
      stats: { setup: "2 days", support: "24/7" }
    },
    {
      id: 4,
      name: "Amina Boudjema",
      position: "Hotel Owner",
      company: "Sofitel Algiers",
      location: "Algiers, Algeria",
      rating: 5,
      text: "Sysora made managing our boutique hotel so much easier. The interface is intuitive and the automation features save us hours every day.",
      avatar: "AB",
      stats: { time: "-15h/week", automation: "90%" }
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-br from-sysora-midnight via-sysora-midnight-light to-sysora-midnight text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sysora-mint/10 via-transparent to-blue-500/10" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-sysora-mint/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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

      <div className="relative container-responsive">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-sysora-mint/20 backdrop-blur-sm border border-sysora-mint/30 rounded-full px-6 py-3 font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-5 h-5 text-sysora-mint" />
            <span className="text-sysora-mint">Customer Success Stories</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Leading
            <span className="block bg-gradient-to-r from-sysora-mint to-sysora-mint-light bg-clip-text text-transparent">
              Hotels Across Algeria
            </span>
          </h2>
          
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            See how hotels like yours are transforming their operations and 
            increasing revenue with Sysora's intelligent platform.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card
                variant="glass"
                className="backdrop-blur-xl border-white/20 shadow-2xl"
              >
                <Card.Content className="p-8 lg:p-12">
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {/* Quote Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Quote Icon */}
                      <div className="w-16 h-16 bg-sysora-mint/20 rounded-xl flex items-center justify-center">
                        <Quote className="w-8 h-8 text-sysora-mint" />
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-warning-400 fill-current" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-xl lg:text-2xl text-white leading-relaxed font-medium">
                        "{currentTestimonial.text}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-sysora-mint to-sysora-mint-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {currentTestimonial.avatar}
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {currentTestimonial.name}
                          </div>
                          <div className="text-sysora-mint font-medium">
                            {currentTestimonial.position}
                          </div>
                          <div className="text-neutral-400 text-sm">
                            {currentTestimonial.company} • {currentTestimonial.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Results Achieved
                      </h4>
                      <div className="space-y-4">
                        {Object.entries(currentTestimonial.stats).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                          >
                            <div className="text-2xl font-bold text-sysora-mint mb-1">
                              {value}
                            </div>
                            <div className="text-sm text-neutral-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              icon={<ChevronLeft className="w-4 h-4" />}
              className="border-white/30 text-white hover:bg-white/10"
            />
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-sysora-mint scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              icon={<ChevronRight className="w-4 h-4" />}
              className="border-white/30 text-white hover:bg-white/10"
            />
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { value: '500+', label: 'Happy Hotels', icon: <Users className="w-6 h-6" /> },
            { value: '4.9★', label: 'Average Rating', icon: <Star className="w-6 h-6" /> },
            { value: '99.9%', label: 'Uptime', icon: <Sparkles className="w-6 h-6" /> },
            { value: '24/7', label: 'Support', icon: <Users className="w-6 h-6" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-sysora-mint mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernTestimonials;
