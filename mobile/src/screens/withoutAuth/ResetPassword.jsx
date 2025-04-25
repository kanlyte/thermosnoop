import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Platform,
  ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { SIGN_IN } from '../screens';
import EIcon from 'react-native-vector-icons/Entypo';
import { useResetPasswordMutation } from '../../redux/apis/baseApi';

const ResetPassword = ({ navigation, route }) => {
    const { userId } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [resetPassword] =
        useResetPasswordMutation();

        const handleResetPassword = async () => {
          if (!newPassword || !confirmPassword) {
              Alert.alert('Error', 'Both password fields are required.');
              return;
          }
          if (newPassword !== confirmPassword) {
              Alert.alert('Error', 'Passwords do not match.');
              return;
          }
          if (newPassword.length < 8) {
              Alert.alert(
                  'Error',
                  'Password must be at least 8 characters long.',
              );
              return;
          }
  
          setIsResettingPassword(true);
  
          try {
              const response = await resetPassword({
                  user_id: userId,
                  password: newPassword,
              }).unwrap();
  
              if (response.status) {
                  Alert.alert(
                      'Success',
                      'Password has been reset successfully!',
                      [
                          {
                              text: 'OK',
                              onPress: () => navigation.navigate(SIGN_IN),
                          },
                      ],
                  );
              } else {
                  Alert.alert('Error', response.reason || 'Failed to reset password.');
              }
          } catch (error) {
              console.error('Error resetting password:', error);
  
              const errorMessage =
                  error.status === 400
                      ? 'Invalid input: Password is required or too weak.'
                      : error.status === 404
                      ? 'User not found. Please check the user ID.'
                      : 'An unexpected error occurred. Please try again later.';
  
              Alert.alert('Error', errorMessage);
          } finally {
              setIsResettingPassword(false);
          }
      };
    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.appBar}>
            <Text style={styles.title}>Reset Password</Text>
          </View>
          <View style={styles.contentContainer}>
            {/* New Password Input */}
            <View style={styles.passwd__wrapper}>
              <TextInput
                style={styles.input_passwd}
                placeholder="Enter New Password"
                placeholderTextColor="#c5ccc4"
                secureTextEntry={!isNewPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                <EIcon
                  name={isNewPasswordVisible ? 'eye-with-line' : 'eye'}
                  size={22}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.passwd__wrapper}>
              <TextInput
                style={styles.input_passwd}
                placeholder="Confirm New Password"
                placeholderTextColor="#c5ccc4"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <EIcon
                  name={isConfirmPasswordVisible ? 'eye-with-line' : 'eye'}
                  size={22}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}
            disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <ActivityIndicator color="white" size={25} />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  appBar: {
    padding: 16,
    alignItems: 'center',
    
  },
  title: {
    fontSize: 20,
    color: '#000000',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  passwd__wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  input_passwd: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
  },
  button: {
    height: 50,
    backgroundColor: 'darkgreen',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPassword;
