import React from 'react';
import { 
  Users, 
  Zap, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Star,
  Rocket
} from 'lucide-react';

const BetaTrustSection = () => {
  const betaStats = [
    {
      icon: Users,
      title: "شراكات أولية",
      description: "نعمل مع مجموعة مختارة من الفنادق لتطوير المنصة",
      highlight: "Beta Partners",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Zap,
      title: "اختبارات مكثفة",
      description: "نجري اختبارات يومية لضمان الجودة والموثوقية",
      highlight: "Daily Testing",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Shield,
      title: "99.5% استقرار",
      description: "معدل استقرار ممتاز خلال فترة التجربة",
      highlight: "Stable Platform",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "تطوير مستمر",
      description: "نضيف ميزات جديدة بناءً على ملاحظات الشركاء",
      highlight: "Growing Fast",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  const milestones = [
    {
      icon: CheckCircle,
      title: "إطلاق النسخة التجريبية",
      description: "بدأنا رحلة تطوير منصة إدارة الفنادق الذكية",
      status: "completed"
    },
    {
      icon: Users,
      title: "انضمام الشركاء الأوائل",
      description: "فنادق رائدة انضمت لبرنامج التجربة",
      status: "completed"
    },
    {
      icon: Rocket,
      title: "التوسع التدريجي",
      description: "نستعد لاستقبال المزيد من الفنادق قريباً",
      status: "in-progress"
    },
    {
      icon: Star,
      title: "الإطلاق الرسمي",
      description: "الإطلاق الكامل للجمهور مع جميع الميزات",
      status: "upcoming"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-sysora-mint/10 rounded-full text-sysora-midnight font-medium mb-4">
            <Clock className="w-4 h-4 mr-2" />
            مرحلة Beta - نبني المستقبل معاً
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            رحلة بناء الثقة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نحن في مرحلة مثيرة من التطوير، نعمل مع شركاء مختارين لبناء أفضل منصة إدارة فنادق. 
            انضم إلينا في هذه الرحلة وكن جزءاً من المستقبل.
          </p>
        </div>

        {/* Beta Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {betaStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.title}</h3>
                <p className="text-gray-600 mb-4">{stat.description}</p>
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {stat.highlight}
                </div>
              </div>
            );
          })}
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">خارطة الطريق</h3>
            <p className="text-lg text-gray-600">
              شاهد كيف نتطور ونكبر خطوة بخطوة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const getStatusColor = () => {
                switch (milestone.status) {
                  case 'completed':
                    return 'bg-green-100 text-green-600 border-green-200';
                  case 'in-progress':
                    return 'bg-blue-100 text-blue-600 border-blue-200';
                  case 'upcoming':
                    return 'bg-gray-100 text-gray-600 border-gray-200';
                  default:
                    return 'bg-gray-100 text-gray-600 border-gray-200';
                }
              };

              const getStatusIcon = () => {
                switch (milestone.status) {
                  case 'completed':
                    return <CheckCircle className="w-4 h-4" />;
                  case 'in-progress':
                    return <Clock className="w-4 h-4" />;
                  case 'upcoming':
                    return <Star className="w-4 h-4" />;
                  default:
                    return <Clock className="w-4 h-4" />;
                }
              };

              return (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < milestones.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-200 z-0"></div>
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full border-2 ${getStatusColor()} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
                      {getStatusIcon()}
                      <span className="mr-1">
                        {milestone.status === 'completed' && 'مكتمل'}
                        {milestone.status === 'in-progress' && 'جاري العمل'}
                        {milestone.status === 'upcoming' && 'قريباً'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-sysora-midnight to-blue-800 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">كن جزءاً من القصة</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى برنامج Beta واحصل على وصول مبكر للمنصة. 
              ساعدنا في بناء أفضل نظام إدارة فنادق واستفد من أسعار خاصة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-sysora-mint text-sysora-midnight rounded-xl font-bold hover:bg-sysora-mint/90 transition-colors">
                انضم لبرنامج Beta
              </button>
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                تعرف على المزيد
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BetaTrustSection;
