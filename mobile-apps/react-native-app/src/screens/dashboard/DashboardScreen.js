import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../config/theme';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user, hotel } = useAuth();
  const [stats, setStats] = useState({});
  const [todayActivity, setTodayActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDashboardData();
    
    // Animate screen entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      console.log('📊 Loading dashboard data...');
      
      const [statsData, activityData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTodayActivity()
      ]);
      
      setStats(statsData);
      setTodayActivity(activityData);
      
      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      Alert.alert('خطأ', 'فشل في تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const StatCard = ({ title, value, icon, color, onPress, trend }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statCardLeft}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>{value}</Text>
          {trend && (
            <View style={styles.trendContainer}>
              <Icon 
                name={trend > 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={trend > 0 ? theme.colors.success : theme.colors.error} 
              />
              <Text style={[
                styles.trendText,
                { color: trend > 0 ? theme.colors.success : theme.colors.error }
              ]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, color, onPress }) => (
    <TouchableOpacity 
      style={styles.quickAction} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <View style={[
        styles.activityIcon, 
        { backgroundColor: getActivityColor(activity.type) + '20' }
      ]}>
        <Icon 
          name={getActivityIcon(activity.type)} 
          size={20} 
          color={getActivityColor(activity.type)} 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin': return 'login';
      case 'checkout': return 'logout';
      case 'booking': return 'event';
      case 'payment': return 'payment';
      case 'service': return 'room-service';
      case 'maintenance': return 'build';
      default: return 'info';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'checkin': return theme.colors.success;
      case 'checkout': return theme.colors.warning;
      case 'booking': return theme.colors.primary;
      case 'payment': return theme.colors.success;
      case 'service': return theme.colors.secondary;
      case 'maintenance': return theme.colors.error;
      default: return theme.colors.text;
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-empty" size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingText}>
                {getCurrentGreeting()}، {user?.fullName}
              </Text>
              <Text style={styles.hotelName}>{hotel?.name}</Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('ar-SA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="notifications" size={24} color={theme.colors.text} />
              {stats.unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {stats.unreadNotifications > 99 ? '99+' : stats.unreadNotifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <StatCard
              title="إجمالي الغرف"
              value={stats.totalRooms || 0}
              icon="hotel"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('RoomsTab')}
              trend={stats.roomsTrend}
            />
            <StatCard
              title="الغرف المتاحة"
              value={stats.availableRooms || 0}
              icon="check-circle"
              color={theme.colors.success}
              onPress={() => navigation.navigate('RoomsTab', { filter: 'available' })}
            />
            <StatCard
              title="حجوزات اليوم"
              value={stats.todayBookings || 0}
              icon="event"
              color={theme.colors.warning}
              onPress={() => navigation.navigate('BookingsTab', { filter: 'today' })}
              trend={stats.bookingsTrend}
            />
            <StatCard
              title="إيرادات اليوم"
              value={`${(stats.todayRevenue || 0).toLocaleString()} دج`}
              icon="attach-money"
              color={theme.colors.success}
              onPress={() => navigation.navigate('ReportsTab')}
              trend={stats.revenueTrend}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
            <View style={styles.quickActionsContainer}>
              <QuickAction
                title="حجز جديد"
                icon="add"
                color={theme.colors.primary}
                onPress={() => navigation.navigate('CreateBooking')}
              />
              <QuickAction
                title="إدارة الغرف"
                icon="hotel"
                color={theme.colors.secondary}
                onPress={() => navigation.navigate('RoomsTab')}
              />
              <QuickAction
                title="النزلاء"
                icon="people"
                color={theme.colors.warning}
                onPress={() => navigation.navigate('GuestsTab')}
              />
              <QuickAction
                title="التقارير"
                icon="assessment"
                color={theme.colors.success}
                onPress={() => navigation.navigate('ReportsTab')}
              />
            </View>
          </View>

          {/* Today's Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>نشاط اليوم</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ActivityLog')}>
                <Text style={styles.seeAllText}>عرض الكل</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContainer}>
              {todayActivity.length > 0 ? (
                todayActivity.slice(0, 5).map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))
              ) : (
                <View style={styles.emptyActivity}>
                  <Icon name="event-note" size={48} color={theme.colors.textLight} />
                  <Text style={styles.emptyText}>لا توجد أنشطة اليوم</Text>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  hotelName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 4,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    ...theme.shadows.medium,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCardLeft: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: theme.spacing['3xl'],
  },
});

export default DashboardScreen;
