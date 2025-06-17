import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { PLATFORM_STATS } from '../constants/promotions';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Beta testimonials - honest feedback from early partners
  const testimonials = [
    {
      id: 1,
      name: "أحمد الحسن",
      role: "مدير فندق",
      hotel: "فندق الأندلس",
      location: "الجزائر العاصمة",
      rating: 4,
      text: "نحن من الشركاء الأوائل في برنامج Beta. النظام واعد جداً والفريق متجاوب مع ملاحظاتنا. نتطلع لرؤية المزيد من الميزات قريباً.",
      highlight: "شريك Beta مبكر",
      verified: true,
      avatar: "أح",
      betaPartner: true
    },
    {
      id: 2,
      name: "محمد بن سالم",
      role: "مالك فندق",
      hotel: "فندق الواحة",
      location: "قسنطينة، الجزائر",
      rating: 4,
      text: "انضممنا لبرنامج Beta منذ شهر. النظام بسيط ومفهوم، والفريق يستمع لاقتراحاتنا. نحن متفائلون بالمستقبل.",
      highlight: "نظام بسيط ومفهوم",
      verified: true,
      avatar: "مس",
      betaPartner: true
    },
    {
      id: 3,
      name: "ليلى العربي",
      role: "مديرة الاستقبال",
      hotel: "فندق الشروق",
      location: "عنابة، الجزائر",
      rating: 4,
      text: "نجرب النظام حالياً ونقدم ملاحظاتنا للفريق. الواجهة جميلة والاستخدام سهل. نتطلع للميزات الجديدة.",
      highlight: "واجهة جميلة وسهلة",
      verified: true,
      avatar: "لع",
      betaPartner: true
    },
    {
      id: 4,
      name: "عبد الرحمن قاسم",
      role: "مدير تقني",
      hotel: "فندق الأمل",
      location: "تلمسان، الجزائر",
      rating: 4,
      text: "من الناحية التقنية، النظام مستقر ومبني بشكل جيد. نحن نساعد في اختبار الميزات الجديدة ونقدر الشفافية في التطوير.",
      highlight: "نظام مستقر ومبني جيداً",
      verified: true,
      avatar: "عق",
      betaPartner: true
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
    <section id="testimonials" className="section-padding bg-gradient-to-br from-sysora-midnight to-blue-900 text-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-sysora-mint/20 text-sysora-mint px-6 py-3 rounded-full font-medium">
            <Star className="w-5 h-5" />
            <span>ملاحظات الشركاء الأوائل</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold">
            نبني الثقة مع شركائنا
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            استمع لآراء الفنادق التي تشاركنا رحلة تطوير أفضل منصة إدارة فنادق
          </p>
        </div>

        {/* Beta Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">
              Beta
            </div>
            <div className="text-sm text-gray-300">شركاء التجربة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">إيجابية</div>
            <div className="text-sm text-gray-300">ملاحظات الشركاء</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">
              نشطة
            </div>
            <div className="text-sm text-gray-300">اختبارات يومية</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sysora-mint">
              {PLATFORM_STATS.uptime.value}{PLATFORM_STATS.uptime.suffix}
            </div>
            <div className="text-sm text-gray-300">استقرار النظام</div>
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
                
                {/* Beta Partner Badge */}
                {currentReview.betaPartner && (
                  <div className="inline-flex items-center space-x-1 bg-sysora-mint/20 text-sysora-mint px-2 py-1 rounded-full text-xs mt-2">
                    <Star className="w-3 h-3" />
                    <span>شريك Beta</span>
                  </div>
                )}

                {/* Verified Badge */}
                {currentReview.verified && !currentReview.betaPartner && (
                  <div className="inline-flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs mt-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>عميل موثق</span>
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
            <h3 className="text-2xl font-bold">انضم لبرنامج Beta</h3>
            <p className="text-gray-300">كن جزءاً من رحلة بناء أفضل منصة إدارة فنادق واحصل على وصول مبكر</p>
            <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl">
              انضم للبرنامج
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
