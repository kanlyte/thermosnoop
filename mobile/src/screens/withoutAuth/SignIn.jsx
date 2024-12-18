import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FORGOT_PASSWD, REGISTER } from '../screens';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/auth/useAuth';

import EIcon from 'react-native-vector-icons/Entypo';
import { Link } from '@react-navigation/native';
import { signIn } from '../../services/authService';
import { _signIn } from '../../redux/slices/authSlice';
import { KEYS, formatToSentenceCase, saveItemAsyncStorage } from '../../utils/basicUtil';

const SignIn = ({ route }) => {
    const params = route.params;

    const dispatch = useDispatch();

    const [viewPasswd, setViewPasswd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState(params?.email);
    const [password, setPassword] = useState(params?.password);


    const handleUserAuthentication = async () => {
        if (!loading) {
            setLoading(true);
            try {
                const { data: { user, accessToken } } = await signIn({ email, password })
                await saveItemAsyncStorage(KEYS.ACCESS_TOKEN, accessToken)
                await saveItemAsyncStorage(KEYS.REFRESH_TOKEN, user?.refreshToken)
                dispatch(_signIn(user))
            } catch (error) {
                console.log(error?.response?.data)
                Alert.alert(
                    'Error',
                    formatToSentenceCase(error?.response?.data?.data) || "Check your credentials or \nplease check your internet connection.",
                    [
                        {
                            text: 'Ok',
                            onPress: () => {},
                        },
                    ],
                    {
                        cancelable: true,
                    },
                );
            } finally {
                setLoading(false)
            }
        }
    };

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

            {/* <Link to={FORGOT_PASSWD} style={styles.link_forgot}>
                Forgot Password?
            </Link> */}

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
        fontSize: 30,
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
});

export default SignIn;
