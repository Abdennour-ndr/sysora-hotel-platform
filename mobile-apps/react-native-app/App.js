import React, { useEffect } from 'react';
import { 
  StatusBar, 
  Platform, 
  PermissionsAndroid, 
  LogBox,
  AppState 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/config/theme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Remote debugger',
  'Setting a timer',
]);

const App = () => {
  useEffect(() => {
    // Initialize app
    initializeApp();
    
    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      // Handle app state changes (background, active, etc.)
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const initializeApp = async () => {
    console.log('🚀 Initializing Sysora Hotel Mobile App...');
    
    try {
      // Configure push notifications
      await configurePushNotifications();
      
      // Request permissions for Android
      if (Platform.OS === 'android') {
        await requestAndroidPermissions();
      }
      
      console.log('✅ App initialization completed');
    } catch (error) {
      console.error('❌ App initialization error:', error);
    }
  };

  const configurePushNotifications = async () => {
    console.log('🔔 Configuring push notifications...');
    
    PushNotification.configure({
      // Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('📱 Push notification token:', token);
        // TODO: Send token to your server
      },

      // Called when a remote notification is received or opened
      onNotification: function (notification) {
        console.log('🔔 Notification received:', notification);
        
        // Handle notification tap
        if (notification.userInteraction) {
          handleNotificationTap(notification);
        }
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      // Permissions
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      requestPermissions: Platform.OS === 'ios',
    });

    // Create default notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'sysora-hotel-default',
          channelName: 'Sysora Hotel Notifications',
          channelDescription: 'Default notification channel for Sysora Hotel app',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => {
          console.log(`📱 Notification channel created: ${created}`);
        }
      );

      // Create high priority channel for urgent notifications
      PushNotification.createChannel(
        {
          channelId: 'sysora-hotel-urgent',
          channelName: 'Urgent Notifications',
          channelDescription: 'Urgent notifications for Sysora Hotel app',
          playSound: true,
          soundName: 'default',
          importance: 5,
          vibrate: true,
        },
        (created) => {
          console.log(`🚨 Urgent notification channel created: ${created}`);
        }
      );
    }
  };

  const handleNotificationTap = (notification) => {
    console.log('👆 Notification tapped:', notification.data);
    
    // Handle different notification types
    switch (notification.data?.type) {
      case 'new_booking':
        // Navigate to bookings screen
        console.log('📅 Navigating to new booking');
        break;
      case 'room_service':
        // Navigate to rooms screen
        console.log('🏨 Navigating to room service');
        break;
      case 'payment_received':
        // Navigate to payments screen
        console.log('💰 Navigating to payment');
        break;
      case 'maintenance_request':
        // Navigate to maintenance screen
        console.log('🔧 Navigating to maintenance');
        break;
      case 'guest_checkin':
        // Navigate to guest details
        console.log('👤 Navigating to guest check-in');
        break;
      default:
        // Navigate to dashboard
        console.log('🏠 Navigating to dashboard');
        break;
    }
  };

  const requestAndroidPermissions = async () => {
    console.log('📋 Requesting Android permissions...');
    
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      Object.keys(granted).forEach(permission => {
        const status = granted[permission];
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(`✅ ${permission} permission granted`);
        } else if (status === PermissionsAndroid.RESULTS.DENIED) {
          console.log(`❌ ${permission} permission denied`);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log(`🚫 ${permission} permission never ask again`);
        }
      });
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
    }
  };

  // Send local notification (for testing)
  const sendTestNotification = () => {
    PushNotification.localNotification({
      channelId: 'sysora-hotel-default',
      title: 'Sysora Hotel',
      message: 'تطبيق إدارة الفنادق جاهز للاستخدام!',
      playSound: true,
      soundName: 'default',
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.surface}
        translucent={false}
      />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
