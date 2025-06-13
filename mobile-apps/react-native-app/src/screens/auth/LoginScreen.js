import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../config/theme';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = () => {
  const { login, demoLogin, isLoading, authError, clearAuthError } = useAuth();
  
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Clear auth error when component mounts
    return () => clearAuthError();
  }, [clearAuthError]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.trim()
    }));
    // Clear error when user starts typing
    if (authError) {
      clearAuthError();
    }
  };

  const validateForm = () => {
    if (!formData.subdomain) {
      Alert.alert('خطأ', 'يرجى إدخال نطاق الفندق');
      return false;
    }
    if (!formData.email) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return false;
    }
    if (!formData.password) {
      Alert.alert('خطأ', 'يرجى إدخال كلمة المرور');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(formData.subdomain, formData.email, formData.password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'خطأ في تسجيل الدخول',
        error.message || 'فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleDemoLogin = async () => {
    try {
      await demoLogin();
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert(
        'خطأ في الحساب التجريبي',
        error.message || 'فشل في تسجيل الدخول للحساب التجريبي'
      );
    }
  };

  const fillDemoData = () => {
    setFormData({
      subdomain: 'demo',
      email: 'admin@demo.com',
      password: 'demo123'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>S</Text>
              </View>
              <Text style={styles.appName}>Sysora Hotel</Text>
              <Text style={styles.appSubtitle}>نظام إدارة الفنادق الذكي</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>تسجيل الدخول</Text>
              <Text style={styles.formSubtitle}>
                ادخل بيانات حسابك للوصول إلى لوحة التحكم
              </Text>

              {/* Error Message */}
              {authError && (
                <View style={styles.errorContainer}>
                  <Icon name="error" size={20} color={theme.colors.error} />
                  <Text style={styles.errorText}>{authError}</Text>
                </View>
              )}

              {/* Subdomain Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>نطاق الفندق</Text>
                <View style={styles.inputWrapper}>
                  <Icon 
                    name="business" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="اسم-الفندق"
                    placeholderTextColor={theme.colors.textLight}
                    value={formData.subdomain}
                    onChangeText={(value) => handleInputChange('subdomain', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <Text style={styles.domainSuffix}>.sysora.com</Text>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
                <View style={styles.inputWrapper}>
                  <Icon 
                    name="email" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="admin@hotel.com"
                    placeholderTextColor={theme.colors.textLight}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>كلمة المرور</Text>
                <View style={styles.inputWrapper}>
                  <Icon 
                    name="lock" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.textLight}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    disabled={isLoading}
                  >
                    <Icon
                      name={showPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
                <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.loginButtonText}>جاري تسجيل الدخول...</Text>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
                    <Icon name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              {/* Demo Section */}
              <View style={styles.demoContainer}>
                <Text style={styles.demoText}>تريد تجربة النظام؟</Text>
                <View style={styles.demoButtons}>
                  <TouchableOpacity
                    style={styles.demoFillButton}
                    onPress={fillDemoData}
                    disabled={isLoading}
                  >
                    <Text style={styles.demoFillButtonText}>ملء البيانات التجريبية</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.demoLoginButton}
                    onPress={handleDemoLogin}
                    disabled={isLoading}
                  >
                    <Text style={styles.demoLoginButtonText}>دخول مباشر</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                بتسجيل الدخول، أنت توافق على{' '}
                <Text style={styles.footerLink}>شروط الاستخدام</Text>
                {' '}و{' '}
                <Text style={styles.footerLink}>سياسة الخصوصية</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing['2xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['5xl'],
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  appSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing['3xl'],
    marginBottom: theme.spacing['3xl'],
    ...theme.shadows.large,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  formSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorAlpha,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'right',
  },
  domainSuffix: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  passwordToggle: {
    padding: theme.spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing['3xl'],
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  loginButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: theme.spacing.sm,
  },
  demoContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  demoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  demoFillButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryAlpha,
  },
  demoFillButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  demoLoginButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.secondary,
  },
  demoLoginButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
