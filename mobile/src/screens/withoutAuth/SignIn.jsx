import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FORGOT_PASSWD, REGISTER } from '../screens';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/auth/useAuth';

import EIcon from 'react-native-vector-icons/Entypo';
import { Link } from '@react-navigation/native';
import { _signIn } from '../../redux/slices/authSlice';
import {
    KEYS,
    formatToSentenceCase,
    getItemAsyncStorage,
    saveItemAsyncStorage,
} from '../../utils/basicUtil';
import {
    useSendOtp2Mutation,
    useVerifyOtpMutation,
    useVerifyUserMutation,
} from '../../redux/apis/baseApi';
import { OtpInput } from 'react-native-otp-entry';
import { signIn } from '../../services/authService';

const SignIn = ({ route }) => {
    const params = route.params;
    const dispatch = useDispatch();
    const [viewPasswd, setViewPasswd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifyUser, { isLoading: isVerifyingUser }] =
        useVerifyUserMutation();
    const [email, setEmail] = useState(params?.email);
    const [password, setPassword] = useState(params?.password);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isSubmitting, SetisSubmitting] = useState(false);
    const [showEmailNotVerifiedModal, setShowEmailNotVerifiedModal] =
        useState(false);
    const [userId, setUserId] = useState(null);
    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtp2Mutation();
    const [otp, setOtp] = useState({
        otp: null,
    });

    // const handleUserAuthentication = async () => {
    //     if (!loading) {
    //         setLoading(true);
    //         try {
    //             const { data: { user, accessToken } } = await signIn({ email, password })
    //             await saveItemAsyncStorage(KEYS.ACCESS_TOKEN, accessToken)
    //             await saveItemAsyncStorage(KEYS.REFRESH_TOKEN, user?.refreshToken)
    //             dispatch(_signIn(user))
    //         } catch (error) {
    //             console.log(error?.response?.data)
    //             Alert.alert(
    //                 'Error',
    //                 formatToSentenceCase(error?.response?.data?.data) || "Check your credentials or \nplease check your internet connection.",
    //                 [
    //                     {
    //                         text: 'Ok',
    //                         onPress: () => {},
    //                     },
    //                 ],
    //                 {
    //                     cancelable: true,
    //                 },
    //             );
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    // };
    const handleVerifyUser = async () => {
        try {
            const user_id = userId;
            console.log(user_id);
            const numericOtp = parseInt(otp, 10);
            const otpWithUserId = {
                otp: numericOtp,
                user_id: userId,
            };
            const response = await verifyUser(otpWithUserId).unwrap();
            console.log(response);

            if (response?.status) {
                console.log('Verify User Response:', response);

                Alert.alert(
                    'Success',
                    response.reason || 'OTP verified successfully!',

                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                // Automatically log in the user after OTP verification
                                try {
                                    const response = await signIn({ email, password });
                                    const { user, accessToken} = response.data;
                                    await saveItemAsyncStorage(
                                        KEYS.ACCESS_TOKEN,
                                        accessToken,
                                    );
                                    await saveItemAsyncStorage(
                                        KEYS.REFRESH_TOKEN,
                                        user.refreshToken,
                                    );
                                    dispatch(_signIn(user));
                                } catch (loginError) {
                                    console.error(
                                        'Error during automatic login:',
                                        loginError,
                                    );
                                    Alert.alert(
                                        'Error',
                                        'Failed to login. Please try again.',
                                    );
                                }
                            },
                        },
                    ],
                    { cancelable: false },
                );
                setShowOtpModal(false);
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
            // Optional: Add any final cleanup code if needed
        }
    };

    const handleSendOtp = async () => {
        try {
            SetisSubmitting(true);
            const response = await sendOtp(email).unwrap();
            if (response?.status) {
                setUserId(response.result?.user_id);

                Alert.alert(
                    'Success',
                    response.reason || 'OTP sent successfully!',
                );
                setShowEmailNotVerifiedModal(false);
                setShowOtpModal(true);
            } else {
                console.error('API Response Error:', response);
                Alert.alert('Error', response.reason || 'Failed to send OTP.');
            }
        } catch (error) {
            console.error('Error while sending OTP:', error);
            const errorMessage =
                error?.data?.reason ||
                error?.message ||
                'Failed to send OTP. Please check your network connection or try again later.';
        } finally {
            SetisSubmitting(false);
        }
    };
    const handleUserAuthentication = async () => {
        if (!loading) {
            setLoading(true);
            try {
                const response = await signIn({ email, password });
                console.log(response);
                const { user, accessToken, emailNotVerified } = response.data;

                if (emailNotVerified) {
                    try {
                        setShowEmailNotVerifiedModal(true);
                    } catch (otpError) {
                        console.error('Error sending OTP:', otpError);
                        Alert.alert(
                            'Error',
                            'Failed to send OTP. Please try again later.',
                        );
                    }
                } else {
                    await saveItemAsyncStorage(KEYS.ACCESS_TOKEN, accessToken);
                    await saveItemAsyncStorage(
                        KEYS.REFRESH_TOKEN,
                        user.refreshToken,
                    );
                    dispatch(_signIn(user));
                }
            } catch (error) {
                console.log(error);
                Alert.alert(
                    'Error',
                    formatToSentenceCase(error?.response?.data?.data) ||
                        'Check your credentials or \nplease check your internet connection.',
                    [{ text: 'Ok', onPress: () => {} }],
                    { cancelable: true },
                );
            } finally {
                setLoading(false);
            }
        }
    };

    const user_id = useSelector(state => state.auth.id);
    const onClose = () => setShowOtpModal(false);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Welcome &#128075;</Text>
            <Text style={styles.header__sup}>Sign in your account</Text>

            <Text style={styles.input__label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Your email"
                placeholderTextColor={'#c5ccc4'}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={text => setEmail(text)}
                value={email}
            />

            <Text style={styles.input__label}>Password</Text>

            <View style={styles.passwd__wrapper}>
                <TextInput
                    style={styles.input_passwd}
                    placeholder="Password"
                    placeholderTextColor={'#c5ccc4'}
                    secureTextEntry={viewPasswd ? false : true}
                    onChangeText={text => setPassword(text)}
                    value={password}
                />
                <TouchableOpacity onPress={() => setViewPasswd(!viewPasswd)}>
                    <EIcon
                        name={`${viewPasswd ? 'eye-with-line' : 'eye'}`}
                        size={22}
                        color={'gray'}
                    />
                </TouchableOpacity>
            </View>

            <Link to={`/${FORGOT_PASSWD}`} style={styles.link_forgot}>
                Forgot Password?
            </Link>

            <TouchableOpacity
                style={styles.button}
                onPress={handleUserAuthentication}
            >
                {loading ? (
                    <ActivityIndicator color={'white'} size={25} />
                ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.linkText}>
                Don't have an account?{' '}
                <Link to={`/${REGISTER}`} style={styles.link_register}>
                    Sign Up
                </Link>
            </Text>
            {showOtpModal && (
                <Modal
                    visible={true}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowOtpModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.popupContainer}>
                            <Text style={styles.title}>Verify OTP</Text>
                            <Text style={styles.subtitle}>
                                Enter 6 digit OTP
                            </Text>
                            <Text style={styles.subtitle}>
                                sent to your Email
                            </Text>

                            <View style={styles.otpContainer}>
                                <OtpInput
                                    numberOfDigits={6}
                                    onFilled={otp => {
                                        const formattedOtp = Array.isArray(otp)
                                            ? otp.join('')
                                            : otp;
                                        console.log(
                                            'OTP onFilled:',
                                            formattedOtp,
                                        );
                                        setOtp(formattedOtp);
                                    }}
                                    onTextChange={otp => {
                                        const formattedOtp = Array.isArray(otp)
                                            ? otp.join('')
                                            : otp;
                                        console.log(
                                            'OTP onTextChange:',
                                            formattedOtp,
                                        );
                                        setOtp(formattedOtp);
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
                                    isVerifyingUser && styles.disabledButton,
                                ]} // Disable button when loading
                                onPress={handleVerifyUser}
                                disabled={isVerifyingUser}
                            >
                                {isVerifyingUser ? (
                                    <ActivityIndicator
                                        color={'white'}
                                        size={25}
                                    />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Verify OTP
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowOtpModal(false)}
                            >
                                <Text style={styles.closeButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {showEmailNotVerifiedModal && (
                <Modal
                    visible={true}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowEmailNotVerifiedModal(false)}
                >
                    <View style={styles.modalContainer2}>
                        <View style={styles.popupContainer2}>
                            <Text style={styles.title2}>
                                Email Not Verified
                            </Text>
                            <Text style={styles.subtitle2}>
                                Please verify your email to continue.
                            </Text>

                            <TouchableOpacity
                                style={styles.verifyButton2}
                                onPress={handleSendOtp}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator
                                        color={'white'}
                                        size={25}
                                    />
                                ) : (
                                    <Text style={styles.buttonText2}>
                                        Verify Now
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton2}
                                onPress={() =>
                                    setShowEmailNotVerifiedModal(false)
                                }
                            >
                                <Text style={styles.closeButtonText2}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },

    header: {
        fontSize: 24,
        color: 'black',
        // fontSize: 30,
        fontWeight: 'bold',
    },
    header__sup: {
        marginBottom: 30,
        fontSize: 15,
        color: 'gray',
        fontWeight: '700',
    },

    passwd__wrapper: {
        width: '100%',
        padding: 0,
        margin: 0,
        flexDirection: 'row',
        backgroundColor: '#ebf2ed',
        alignItems: 'center',
        paddingRight: 10,
        borderRadius: 5,
        marginBottom: 15,
    },

    input__label: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },

    input_passwd: {
        flex: 1,
        height: 40,
        color: 'black',
        paddingHorizontal: 15,
    },

    input: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#ebf2ed',
        borderRadius: 5,
        color: 'black',
        textDecorationLine: 'none',
    },

    link_forgot: {
        color: '#4c7d4d',
        // color: 'darkgreen',
        fontWeight: '700',
        marginBottom: 15,
    },

    button: {
        backgroundColor: 'darkgreen',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginVertical: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
    },
    linkText: {
        textAlign: 'center',
        color: '#a3abad',
    },

    link_register: {
        color: '#4c7d4d',
        // color: 'darkgreen',
        fontWeight: '700',
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
    verifyButton2: {
        backgroundColor: 'darkgreen',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText2: {
        backgroundColor: 'darkgreen',
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    closeButton2: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText2: {
        color: 'darkgreen',
        fontSize: 16,
    },
    modalContainer2: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer2: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    subtitle2: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default SignIn;
