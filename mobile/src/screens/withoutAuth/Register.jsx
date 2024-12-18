import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Link } from '@react-navigation/native';
import { SIGN_IN } from '../screens';
import { createAccount } from '../../services/authService';
import { formatProdErrorMessage } from '@reduxjs/toolkit';
import { formatToSentenceCase } from '../../utils/basicUtil';

const Register = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        district: '',
        contact: '',
    });

    const handleFormChange = (fieldName, fieldValue) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: fieldValue,
        }));
    };

    const handleUserRegistration = async () => {
        if (!isLoading) {
            setIsLoading(true);
            try {
                const { data: user } = await createAccount(formData);
                Alert.alert('Confirm', 'User account created', [
                    {
                        text: 'Ok',
                        onPress: () =>
                            navigation.navigate(SIGN_IN, {
                                email: formData.email,
                                password: formData.password,
                            }),
                    },
                ]);
            } catch (error) {
                Alert.alert(
                    'Error',
                    formatToSentenceCase(error?.response?.data?.data),
                    [
                        {
                            text: 'Ok',
                            onPress: () => {},
                        },
                    ],
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            <Text style={styles.header__sup}>
                Create account and monitor your farm.
            </Text>

            {/* {RenderFormFields(formData)} */}
            <RenderFormFields data={formData} handleChange={handleFormChange} />

            <TouchableOpacity
                style={styles.button}
                onPress={handleUserRegistration}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={'white'} size={25} />
                ) : (
                    <Text style={styles.buttonText}>Register</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.linkText}>
                Already have an account?{' '}
                <Link to={`/${SIGN_IN}`} style={styles.link_register}>
                    Sign In
                </Link>
            </Text>
        </ScrollView>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    header: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
    },
    header__sup: {
        marginBottom: 30,
        fontSize: 12,
        color: 'gray',
        fontWeight: '700',
    },

    input__label: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    input: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#ebf2ed',
        borderRadius: 5,
        color: 'black',
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
        fontWeight: '700',
    },
});

const RenderFormFields = ({ data, handleChange }) => {
    const fields = [
        { name: 'first_name', label: 'First Name' },
        { name: 'last_name', label: 'Last Name' },
        { name: 'email', label: 'Email' },
        { name: 'contact', label: 'Phone Number' },
        { name: 'district', label: 'Current District' },
        { name: 'password', label: 'Password' },
        { name: 'confirmPassword', label: 'Confirm Password' },
    ];

    return fields.map(field => (
        <TextInput
            key={field.name}
            style={[
                styles.input,
                field.label === 'Current District' && styles.input__name,
            ]}
            placeholder={`Your ${field.label.toLowerCase()}`}
            placeholderTextColor={'#c5ccc4'}
            keyboardType={
                field.label === 'Phone Number'
                    ? 'phone-pad'
                    : field.label === 'Email'
                    ? 'email-address'
                    : field.label === 'password'
                    ? 'visible-password'
                    : 'default'
            }
            autoCapitalize={
                field.label === 'First Name' || field.label === 'Last Name'
                    ? 'none'
                    : 'sentences'
            }
            secureTextEntry={
                field.label === 'Password' || field.label === 'Confirm Password'
            }
            value={data[field.name]}
            onChangeText={value => handleChange(field.name, value)}
        />
    ));
};
