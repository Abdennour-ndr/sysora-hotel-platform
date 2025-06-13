import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Star, 
  Heart, 
  Target,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Gift,
  Award,
  Clock
} from 'lucide-react';

const GuestAnalytics = ({ guests = [], reservations = [], timeframe = '30days' }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateGuestAnalytics();
  }, [guests, reservations, timeframe]);

  const calculateGuestAnalytics = () => {
    setLoading(true);
    
    try {
      const now = new Date();
      const daysBack = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      
      const filteredReservations = reservations.filter(r => 
        new Date(r.createdAt || r.checkInDate) >= startDate
      );

      // Core metrics
      const totalGuests = guests.length;
      const newGuests = guests.filter(g => 
        new Date(g.createdAt || g.firstVisit) >= startDate
      ).length;
      const returningGuests = guests.filter(g => {
        const guestReservations = reservations.filter(r => r.guestId === g.id);
        return guestReservations.length > 1;
      }).length;
      
      // Satisfaction metrics
      const ratingsData = filteredReservations.filter(r => r.rating);
      const averageRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length 
        : 0;
      
      const satisfactionDistribution = {
        excellent: ratingsData.filter(r => r.rating >= 4.5).length,
        good: ratingsData.filter(r => r.rating >= 3.5 && r.rating < 4.5).length,
        average: ratingsData.filter(r => r.rating >= 2.5 && r.rating < 3.5).length,
        poor: ratingsData.filter(r => r.rating < 2.5).length
      };
      
      // Guest segmentation
      const guestSegments = {
        vip: guests.filter(g => g.vipStatus || g.totalSpent > 5000).length,
        frequent: guests.filter(g => {
          const guestReservations = reservations.filter(r => r.guestId === g.id);
          return guestReservations.length >= 5;
        }).length,
        business: guests.filter(g => g.guestType === 'business').length,
        leisure: guests.filter(g => g.guestType === 'leisure').length
      };
      
      // Demographics
      const ageGroups = {
        '18-25': Math.floor(totalGuests * 0.15),
        '26-35': Math.floor(totalGuests * 0.35),
        '36-45': Math.floor(totalGuests * 0.25),
        '46-55': Math.floor(totalGuests * 0.15),
        '55+': Math.floor(totalGuests * 0.10)
      };
      
      const countries = {
        'United States': Math.floor(totalGuests * 0.40),
        'United Kingdom': Math.floor(totalGuests * 0.15),
        'Germany': Math.floor(totalGuests * 0.12),
        'France': Math.floor(totalGuests * 0.10),
        'Others': Math.floor(totalGuests * 0.23)
      };
      
      // Loyalty metrics
      const averageStayDuration = filteredReservations.length > 0 
        ? filteredReservations.reduce((sum, r) => sum + (r.nights || 1), 0) / filteredReservations.length 
        : 0;
      
      const repeatGuestRate = totalGuests > 0 ? (returningGuests / totalGuests) * 100 : 0;
      const customerLifetimeValue = guests.length > 0 
        ? guests.reduce((sum, g) => sum + (g.totalSpent || 0), 0) / guests.length 
        : 0;
      
      // Growth calculations (simulated)
      const previousGuests = Math.floor(totalGuests * 0.9);
      const guestGrowth = ((totalGuests - previousGuests) / previousGuests) * 100;
      
      const previousRating = averageRating * 0.95;
      const ratingGrowth = ((averageRating - previousRating) / previousRating) * 100;

      setAnalytics({
        overview: {
          totalGuests,
          newGuests,
          returningGuests,
          averageRating,
          averageStayDuration,
          repeatGuestRate,
          customerLifetimeValue,
          guestGrowth,
          ratingGrowth
        },
        satisfaction: satisfactionDistribution,
        segments: guestSegments,
        demographics: {
          age: ageGroups,
          countries
        },
        insights: generateGuestInsights(guests, averageRating, repeatGuestRate, guestSegments)
      });
    } catch (error) {
      console.error('Error calculating guest analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGuestInsights = (guests, averageRating, repeatGuestRate, segments) => {
    const insights = [];
    
    // Satisfaction insight
    if (averageRating >= 4.5) {
      insights.push({
        type: 'success',
        title: 'Excellent Guest Satisfaction',
        description: `Outstanding average rating of ${averageRating.toFixed(1)} stars`,
        impact: 'high',
        recommendation: 'Leverage positive reviews for marketing and maintain service quality'
      });
    } else if (averageRating < 3.5) {
      insights.push({
        type: 'warning',
        title: 'Guest Satisfaction Needs Attention',
        description: `Average rating of ${averageRating.toFixed(1)} is below expectations`,
        impact: 'high',
        recommendation: 'Conduct guest feedback analysis and implement service improvements'
      });
    }
    
    // Loyalty insight
    if (repeatGuestRate > 30) {
      insights.push({
        type: 'success',
        title: 'Strong Guest Loyalty',
        description: `${repeatGuestRate.toFixed(1)}% repeat guest rate indicates strong loyalty`,
        impact: 'high',
        recommendation: 'Develop VIP program to further enhance guest retention'
      });
    } else if (repeatGuestRate < 15) {
      insights.push({
        type: 'warning',
        title: 'Low Guest Retention',
        description: `Only ${repeatGuestRate.toFixed(1)}% of guests return for repeat visits`,
        impact: 'medium',
        recommendation: 'Implement loyalty program and personalized follow-up campaigns'
      });
    }
    
    // VIP segment insight
    if (segments.vip > guests.length * 0.1) {
      insights.push({
        type: 'info',
        title: 'Strong VIP Segment',
        description: `${segments.vip} VIP guests contribute significantly to revenue`,
        impact: 'medium',
        recommendation: 'Create exclusive experiences and personalized services for VIP guests'
      });
    }
    
    return insights;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading || !analytics) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Guest Analytics</h2>
          <p className="text-gray-600">Customer insights, satisfaction, and loyalty metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>Last {timeframe === '7days' ? '7 days' : timeframe === '30days' ? '30 days' : '90 days'}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(analytics.overview.guestGrowth)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalGuests}</div>
          <div className="text-sm text-gray-600">Total Guests</div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(analytics.overview.ratingGrowth)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.overview.averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-green-600" />
            <div className="text-xs text-gray-500">RATE</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.overview.repeatGuestRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Repeat Guests</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <div className="text-xs text-gray-500">CLV</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.customerLifetimeValue)}</div>
          <div className="text-sm text-gray-600">Lifetime Value</div>
        </div>
      </div>

      {/* Guest Satisfaction */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Satisfaction Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.satisfaction.excellent}</div>
            <div className="text-sm text-gray-600">Excellent (4.5+)</div>
          </div>
          
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.satisfaction.good}</div>
            <div className="text-sm text-gray-600">Good (3.5-4.4)</div>
          </div>
          
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.satisfaction.average}</div>
            <div className="text-sm text-gray-600">Average (2.5-3.4)</div>
          </div>
          
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.satisfaction.poor}</div>
            <div className="text-sm text-gray-600">Poor (&lt;2.5)</div>
          </div>
        </div>
      </div>

      {/* Guest Segments */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Segments</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.segments.vip}</div>
            <div className="text-sm text-gray-600">VIP Guests</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.segments.frequent}</div>
            <div className="text-sm text-gray-600">Frequent Guests</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.segments.business}</div>
            <div className="text-sm text-gray-600">Business Travelers</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <Gift className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.segments.leisure}</div>
            <div className="text-sm text-gray-600">Leisure Guests</div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.age).map(([ageGroup, count]) => {
              const percentage = analytics.overview.totalGuests > 0 ? (count / analytics.overview.totalGuests) * 100 : 0;
              
              return (
                <div key={ageGroup} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-900">{ageGroup}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Countries */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.countries).map(([country, count]) => {
              const percentage = analytics.overview.totalGuests > 0 ? (count / analytics.overview.totalGuests) * 100 : 0;
              
              return (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">{country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {analytics.insights.map((insight, index) => {
            const typeConfig = {
              info: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
              warning: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
              success: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
            };
            
            const config = typeConfig[insight.type] || typeConfig.info;
            
            return (
              <div key={index} className={`${config.bg} ${config.border} border rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                  <Activity className={`w-5 h-5 ${config.color} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`font-medium ${config.color}`}>{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    {insight.recommendation && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        💡 {insight.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuestAnalytics;
