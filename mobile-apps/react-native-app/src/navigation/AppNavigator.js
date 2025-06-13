import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../config/theme';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import LoadingScreen from '../screens/auth/LoadingScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import RoomsScreen from '../screens/rooms/RoomsScreen';
import BookingsScreen from '../screens/bookings/BookingsScreen';
import GuestsScreen from '../screens/guests/GuestsScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Detail Screens
import RoomDetailsScreen from '../screens/rooms/RoomDetailsScreen';
import BookingDetailsScreen from '../screens/bookings/BookingDetailsScreen';
import CreateBookingScreen from '../screens/bookings/CreateBookingScreen';
import EditRoomScreen from '../screens/rooms/EditRoomScreen';
import AddRoomScreen from '../screens/rooms/AddRoomScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: theme.colors.background }
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Dashboard Stack Navigator
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// Rooms Stack Navigator
const RoomsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Rooms" component={RoomsScreen} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
    <Stack.Screen name="EditRoom" component={EditRoomScreen} />
    <Stack.Screen name="AddRoom" component={AddRoomScreen} />
  </Stack.Navigator>
);

// Bookings Stack Navigator
const BookingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Bookings" component={BookingsScreen} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
  </Stack.Navigator>
);

// Guests Stack Navigator
const GuestsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Guests" component={GuestsScreen} />
  </Stack.Navigator>
);

// Reports Stack Navigator
const ReportsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Reports" component={ReportsScreen} />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'DashboardTab':
            iconName = 'dashboard';
            break;
          case 'RoomsTab':
            iconName = 'hotel';
            break;
          case 'BookingsTab':
            iconName = 'event';
            break;
          case 'GuestsTab':
            iconName = 'people';
            break;
          case 'ReportsTab':
            iconName = 'assessment';
            break;
          case 'ProfileTab':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
        height: 70,
        ...theme.shadows.medium,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
      },
      tabBarItemStyle: {
        paddingVertical: 4,
      },
    })}
  >
    <Tab.Screen
      name="DashboardTab"
      component={DashboardStack}
      options={{
        tabBarLabel: 'الرئيسية',
      }}
    />
    <Tab.Screen
      name="RoomsTab"
      component={RoomsStack}
      options={{
        tabBarLabel: 'الغرف',
      }}
    />
    <Tab.Screen
      name="BookingsTab"
      component={BookingsStack}
      options={{
        tabBarLabel: 'الحجوزات',
      }}
    />
    <Tab.Screen
      name="GuestsTab"
      component={GuestsStack}
      options={{
        tabBarLabel: 'النزلاء',
      }}
    />
    <Tab.Screen
      name="ReportsTab"
      component={ReportsStack}
      options={{
        tabBarLabel: 'التقارير',
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStack}
      options={{
        tabBarLabel: 'الملف الشخصي',
      }}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
