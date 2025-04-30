import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';

type FormData = {
  username: string;
  password: string;
  email: string;
  fullName: string;
};

type FormErrors = {
  username?: string;
  password?: string;
  email?: string;
  fullName?: string;
};

const AuthScreen: React.FC = () => {
  const theme = useTheme();
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await login({
          username: formData.username,
          password: formData.password,
        });
        showToast({
          message: 'Login successful!',
          type: 'success',
        });
      } else {
        await register({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
        });
        showToast({
          message: 'Registration successful!',
          type: 'success',
        });
      }
    } catch (error) {
      showToast({
        message: isLogin
          ? 'Login failed. Please check your credentials.'
          : 'Registration failed. Please try again.',
        type: 'error',
      });
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            {/* Replace with your actual logo */}
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.logoText, { color: theme.colors.onPrimary }]}>K&M</Text>
            </View>
            <Text style={[styles.appName, { color: theme.colors.onBackground }]}>
              Kurtis & More
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
              Ethnic Fashion Redefined
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: theme.colors.onBackground }]}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Text>

            <TextInput
              label="Username"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              style={styles.textInput}
              error={!!errors.username}
              disabled={isLoading}
              left={<TextInput.Icon icon="account" />}
            />
            {errors.username && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.username}
              </Text>
            )}

            {!isLogin && (
              <>
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  style={styles.textInput}
                  error={!!errors.email}
                  disabled={isLoading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                />
                {errors.email && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.email}
                  </Text>
                )}

                <TextInput
                  label="Full Name"
                  value={formData.fullName}
                  onChangeText={(value) => handleChange('fullName', value)}
                  style={styles.textInput}
                  error={!!errors.fullName}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="card-account-details" />}
                />
                {errors.fullName && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.fullName}
                  </Text>
                )}
              </>
            )}

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
              style={styles.textInput}
              error={!!errors.password}
              disabled={isLoading}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {errors.password && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.password}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.submitButtonContent}
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>

            <View style={styles.formSwitchContainer}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={toggleForm}>
                <Text style={[styles.formSwitchText, { color: theme.colors.primary }]}>
                  {isLogin ? 'Register' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            <Divider style={styles.divider} />

            <Text style={[styles.socialLoginText, { color: theme.colors.onSurfaceVariant }]}>
              Or continue with
            </Text>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: theme.colors.surfaceVariant }]}
              >
                <Ionicons name="logo-google" size={20} color={theme.colors.onSurfaceVariant} />
                <Text style={[styles.socialButtonText, { color: theme.colors.onSurfaceVariant }]}>
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: theme.colors.surfaceVariant }]}
              >
                <Ionicons name="logo-facebook" size={20} color={theme.colors.onSurfaceVariant} />
                <Text style={[styles.socialButtonText, { color: theme.colors.onSurfaceVariant }]}>
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
  },
  formContainer: {
    paddingTop: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  textInput: {
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  formSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  formSwitchText: {
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 24,
  },
  socialLoginText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  socialButtonText: {
    fontWeight: '500',
  },
});

export default AuthScreen;