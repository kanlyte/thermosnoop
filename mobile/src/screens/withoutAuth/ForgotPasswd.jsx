import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Modal,
    Alert,
} from 'react-native';
import { OTP_PIN, RESET_PASSWORD } from '../screens';
import { Link } from '@react-navigation/native';
import {
    useResetPasswordMutation,
    useSendOtp2Mutation,
    useVerifyOtp2Mutation,
} from '../../redux/apis/baseApi';
import { OtpInput } from 'react-native-otp-entry';

const ForgotPasswd = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [user_id, setUser_id] = useState(null);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtp2Mutation();
    const [verifyOtp2, { isLoading: isVerifyingOtp }] = useVerifyOtp2Mutation();
    const [resetPassword, { isLoading: isResettingPassword }] =
        useResetPasswordMutation();
    const handleSendOtp = async () => {
        try {
            const response = await sendOtp(email).unwrap();
            // console.log('Response:', response);
            if (response?.status) {
                Alert.alert(
                    'Success',
                    response.reason || 'OTP sent successfully!',
                );
                setOtpModalVisible(true);
                if (response.result?.user_id) {
                    setUser_id(response.result?.user_id);
                    // console.log(response.result?.user_id);
                } else {
                    console.warn('User ID not found in response.');
                }
            } else {
                console.error('API Response Error:', response);
                Alert.alert('Error', response.reason || 'Failed to send OTP.');
            }
        } catch (error) {
            console.error('Error while sending OTP:', error);
            console.log(error);
            const errorMessage =
                error?.data?.reason ||
                error?.message ||
                'Failed to send OTP. Please check your network connection or try again later.';
        }
    };
    // const numericOtp = Number(otp);
    const handleVerifyOtp = async () => {
        try {
            const numericOtp = parseInt(otp, 10);
            console.log('OTP in handleVerifyOtp:', numericOtp);
            const response = await verifyOtp2({
                user_id,
                otp: numericOtp,
            }).unwrap();
            console.log(otp);
            if (response?.status) {
                Alert.alert(
                    'Success',
                    response.reason || 'OTP verified successfully!',
                );
                setOtpModalVisible(false);
                navigation.navigate(`${RESET_PASSWORD}`, { userId: user_id });
            } else {
                console.error('Unexpected API Response:', response);
                Alert.alert('Error', response.reason || 'Failed to verify OTP');
            }
        } catch (error) {
            console.error('Error while verifying OTP:', error);

            const errorMessage =
                error?.data?.reason ||
                error?.message ||
                'Failed to verify OTP. Please try again later.';
            Alert.alert('Error', errorMessage);
        } finally {
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBar}>
                <Text style={styles.title}>Reset Password</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.subtitle}>
                    Enter your email to reset password
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSendOtp}
                    disabled={isSendingOtp}
                >
                    {isSendingOtp ? (
                        <ActivityIndicator color={'white'} size={25} />
                    ) : (
                        <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                </TouchableOpacity>
            </View>
            <Modal
                visible={otpModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.popupContainer}>
                        <Text style={styles.title}>Verify OTP</Text>
                        <Text style={styles.subtitle}>Enter 6 digit OTP</Text>
                        <Text style={styles.subtitle}>sent to your Email</Text>
                        <View style={styles.otpContainer}>
                            <OtpInput
                                numberOfDigits={6}
                                onFilled={otp => {
                                    const formattedOtp = Array.isArray(otp)
                                        ? otp.join('')
                                        : otp;
                                    console.log('OTP onFilled:', formattedOtp); // Log OTP on filled
                                    setOtp(formattedOtp); // Update state
                                }}
                                onTextChange={otp => {
                                    const formattedOtp = Array.isArray(otp)
                                        ? otp.join('')
                                        : otp;
                                    console.log(
                                        'OTP onTextChange:',
                                        formattedOtp,
                                    ); // Log OTP during text change
                                    setOtp(formattedOtp); // Update state
                                }}
                                inputStyle={styles.otpInput}
                                containerStyle={styles.otpInputContainer}
                                theme={{
                                    pinCodeTextStyle: styles.pinText,
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isVerifyingOtp && styles.disabledButton,
                            ]} // Disable button when loading
                            onPress={handleVerifyOtp}
                            disabled={isVerifyingOtp}
                        >
                            {isVerifyingOtp ? (
                                <ActivityIndicator color={'white'} size={25} />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Verify OTP
                                </Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setOtpModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    appBar: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#555555',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 48,
        borderColor: '#B0B0B0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
        color: '#555555',
    },
    button: {
        backgroundColor: 'darkgreen',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
    },
    otpContainer: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center',
    },
    otpInput: {
        width: 48,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    otpInputContainer: {
        justifyContent: 'space-between',
        width: '100%',
    },
    submitButton: {
        marginTop: 30,
        backgroundColor: 'darkgreen',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        color: 'darkgreen',
        fontSize: 16,
    },
    pinText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000', // Ensure text is visible
        textAlign: 'center',
    },
});

export default ForgotPasswd;
