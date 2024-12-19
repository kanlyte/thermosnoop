import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCheckThermalStressMutation } from '../../../redux/apis/baseApi';

const getBgColor = discomfortLevel => {
    switch (discomfortLevel) {
        case 'Emergency':
            return '#99352e';
        case 'Danger':
            return '#ff6054';
        case 'Alert':
            return '#ffe552';
        case 'Discomfort':
            return '#ff8e52';
        case 'Mild discomfort':
            return '#ffac80';
        default:
            return '#346e2f';
    }
};

const ThermalStressCalculator = () => {
    const [checkThermalStress, { isLoading }] = useCheckThermalStressMutation();
    const [data, setData] = useState({});
    const [currentWeather, setCurrentWeather] = useState(null);
    const handleCheck = async () => {
        try {
            const response = await checkThermalStress(data);
            setCurrentWeather(response?.data);
        } catch (error) {
            Alert.alert('Error', error?.data);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Thermal stress</Text>
            <Text style={styles.header__sup}>
                Calculate the thermal stress of your farm at any time
            </Text>

            <Text style={styles.input__label}>Humidity (%)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the humidity in %"
                placeholderTextColor={'#c5ccc4'}
                keyboardType="numeric"
                value={data?.hum || ''}
                onChangeText={text => {
                    setCurrentWeather(null);
                    setData({ ...data, hum: text });
                }}
            />

            <Text style={styles.input__label}>Temperature (°C)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the temperature in °C"
                placeholderTextColor={'#c5ccc4'}
                keyboardType="number-pad"
                value={data?.temp || ''}
                onChangeText={text => {
                    setCurrentWeather(null);
                    setData({ ...data, temp: text });
                }}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => handleCheck()}
            >
                {isLoading ? (
                    <ActivityIndicator color={'white'} size={25} />
                ) : (
                    <Text style={styles.buttonText}>Calculate</Text>
                )}
            </TouchableOpacity>

            {currentWeather && (
                <View style={[styles.stress_card]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingVertical: 10,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={[
                                    styles.icon_ctr,
                                    {
                                        backgroundColor: 'darkgreen',
                                    },
                                ]}
                            >
                                <Icon
                                    name={'cloud-sun'}
                                    size={22}
                                    color={'white'}
                                />
                            </View>
                            <View style={styles.data_ctr}>
                                <Text style={styles.data_value}>
                                    {Math.floor(
                                        currentWeather?.thermostress_value,
                                    )}
                                </Text>
                            </View>
                            <Text style={styles.data_title}>{'THI Value'}</Text>
                        </View>

                        {currentWeather?.discomfort_level && (
                            <View style={{ gap: 10 }}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontWeight: '400',
                                    }}
                                >
                                    Thermal Stress Level
                                </Text>
                                <Text
                                    style={[
                                        styles.alert,
                                        {
                                            backgroundColor: getBgColor(
                                                currentWeather?.discomfort_level,
                                            ),
                                        },
                                    ]}
                                >
                                    {currentWeather?.discomfort_level}
                                </Text>
                            </View>
                        )}
                    </View>

                    {currentWeather?.recommendation && (
                        <>
                            <View
                                style={{
                                    borderColor: '#595958',
                                    borderWidth: 0.2,
                                }}
                            ></View>

                            <View style={styles.txt_recommend}>
                                <Text
                                    style={{
                                        color: '#1C170D',
                                        fontWeight: '700',
                                    }}
                                >
                                    <MIcon
                                        name={'lightbulb-on-outline'}
                                        size={25}
                                        color={'yellow'}
                                    />
                                    Recommendation
                                </Text>
                                <Text style={styles.recommend}>
                                    {currentWeather?.recommendation}
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

export default ThermalStressCalculator;

const styles = StyleSheet.create({
    data_ctr: {
        flexDirection: 'row',
    },

    alert: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#F5F0E5',
        borderRadius: 5,
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },

    recommend: {
        fontSize: 15,
        fontWeight: '500',
        backgroundColor: '#fff9e6',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10,
        color: '#2b2921',
    },

    txt_recommend: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },

    stress_card: {
        shadowColor: '',
        shadowOffset: 1,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#dedcdc',
        borderRadius: 10,
        marginBottom: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        width: '100%',
        alignSelf: 'center',
    },

    data_value: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
    },

    data_title: {
        color: '#c2c2c2',
        fontWeight: '800',
        fontSize: 15,
    },

    data_symbol: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500',
        alignSelf: 'center',
        color: '#c2c2c2',
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        fontSize: 20,
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    header__sup: {
        marginBottom: 30,
        fontSize: 20,
        color: 'gray',
        fontWeight: '700',
    },

    input: {
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#ebf2ed',
        borderRadius: 5,
        color: 'black',
        textDecorationLine: 'none',
    },

    input__label: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },

    button: {
        backgroundColor: 'darkgreen',
        padding: 12,
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

    icon_ctr: {
        borderRadius: 45,
        width: 45,
        height: 45,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
