import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { PLATFORM_STATS } from '../constants/promotions';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Enhanced testimonials with more realistic and detailed feedback
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "General Manager",
      hotel: "Seaside Resort & Spa",
      location: "California, USA",
      rating: 5,
      text: "Sysora has completely transformed how we manage our 120-room resort. The reservation system is intuitive, and the housekeeping coordination has reduced our room turnover time by 30%. Our staff loves how easy it is to use.",
      highlight: "Reduced room turnover time by 30%",
      verified: true,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Ahmed Al-Rashid",
      role: "Hotel Owner",
      hotel: "Desert Oasis Hotel",
      location: "Dubai, UAE",
      rating: 5,
      text: "As a boutique hotel owner, I needed a system that could handle our unique requirements without breaking the bank. Sysora's pricing is fair, and the features are exactly what we needed. The guest management system has improved our service quality significantly.",
      highlight: "Improved service quality significantly",
      verified: true,
      avatar: "AR"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Operations Director",
      hotel: "City Center Business Hotel",
      location: "Barcelona, Spain",
      rating: 5,
      text: "We switched from a legacy system to Sysora 6 months ago. The migration was smooth, and the support team was exceptional. The real-time analytics help us make better decisions, and our revenue has increased by 15% since implementation.",
      highlight: "Revenue increased by 15%",
      verified: true,
      avatar: "MR"
    },
    {
      id: 4,
      name: "David Chen",
      role: "IT Manager",
      hotel: "Mountain View Lodge",
      location: "Vancouver, Canada",
      rating: 5,
      text: "From a technical perspective, Sysora is solid. The API integration was straightforward, the system is reliable with 99.9% uptime, and the security features meet our compliance requirements. It's a well-built platform.",
      highlight: "99.9% uptime reliability",
      verified: true,
      avatar: "DC"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Front Desk Supervisor",
      hotel: "Historic Downtown Inn",
      location: "Boston, USA",
      rating: 5,
      text: "Our front desk team adapted to Sysora within days. The check-in/check-out process is so much faster now, and guests appreciate the professional service. The system rarely has issues, and when it does, support responds quickly.",
      highlight: "Faster check-in/check-out process",
      verified: true,
      avatar: "LT"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials[currentTestimonial];

  return (
    <section className="section-padding bg-gradient-to-br from-sysora-midnight to-blue-900 text-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-sysora-mint/20 text-sysora-mint px-6 py-3 rounded-full font-medium">
            <Star className="w-5 h-5" />
            <span>Customer Success Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by Hotels Worldwide
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how hotel owners and managers are transforming their operations with Sysora
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">
              {PLATFORM_STATS.hotels.value}{PLATFORM_STATS.hotels.suffix}
            </div>
            <div className="text-sm text-gray-300">Active Hotels</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">4.9/5</div>
            <div className="text-sm text-gray-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">
              {PLATFORM_STATS.bookings.value}{PLATFORM_STATS.bookings.suffix}
            </div>
            <div className="text-sm text-gray-300">Bookings Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">
              {PLATFORM_STATS.uptime.value}{PLATFORM_STATS.uptime.suffix}
            </div>
            <div className="text-sm text-gray-300">System Uptime</div>
          </div>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Customer Info */}
              <div className="text-center md:text-left">
                <div className="w-20 h-20 bg-sysora-mint rounded-full flex items-center justify-center text-sysora-midnight font-bold text-xl mx-auto md:mx-0 mb-4">
                  {currentReview.avatar}
                </div>
                <h3 className="text-xl font-bold">{currentReview.name}</h3>
                <p className="text-sysora-mint font-medium">{currentReview.role}</p>
                <p className="text-gray-300 text-sm">{currentReview.hotel}</p>
                <p className="text-gray-400 text-xs">{currentReview.location}</p>
                
                {/* Rating */}
                <div className="flex justify-center md:justify-start space-x-1 mt-3">
                  {[...Array(currentReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Verified Badge */}
                {currentReview.verified && (
                  <div className="inline-flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs mt-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Customer</span>
                  </div>
                )}
              </div>

              {/* Testimonial Content */}
              <div className="md:col-span-2 space-y-6">
                <Quote className="w-12 h-12 text-sysora-mint/50" />
                
                <blockquote className="text-lg md:text-xl leading-relaxed">
                  "{currentReview.text}"
                </blockquote>
                
                {/* Highlight */}
                <div className="bg-sysora-mint/20 border border-sysora-mint/30 rounded-xl p-4">
                  <div className="text-sysora-mint font-semibold text-sm">Key Result:</div>
                  <div className="text-white font-medium">{currentReview.highlight}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-sysora-mint' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Join Hundreds of Successful Hotels</h3>
            <p className="text-gray-300">Start your free trial today and see the difference Sysora can make</p>
            <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

Testimonials.propTypes = {
  className: PropTypes.string,
  onStartTrial: PropTypes.func
};

Testimonials.defaultProps = {
  className: '',
  onStartTrial: () => {}
};

export default Testimonials;
