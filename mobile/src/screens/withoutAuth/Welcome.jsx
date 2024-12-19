import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { REGISTER, SIGN_IN } from '../screens';

const Welcome = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.header_txt}>Thermosnoop</Text>
            <Image
                style={styles.home_img}
                source={require('../../assets/home_farm_2.jpg')}
            />

            <View>
                <Text style={styles.txt__main}>Always at your farm</Text>
                <Text style={styles.txt__sec}>
                    Monitor your cattle's condition from{' '}
                    <Text style={styles.txt__sup}>anywhere</Text> at{' '}
                    <Text style={styles.txt__sup}>anytime</Text>
                </Text>
            </View>

            <View style={{ justifyContent: 'space-around' }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate(REGISTER)}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button__sup}
                    onPress={() => navigation.navigate(SIGN_IN)}
                >
                    <Text style={styles.buttonText__sup}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        justifyContent: 'space-around',
    },

    header_txt: {
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '900',
    },

    home_img: {
        width: 240,
        height: 240,
        borderRadius: 120,
        alignSelf: 'center',
    },

    container_header: {
        flexDirection: 'row',
    },

    button: {
        backgroundColor: 'darkgreen',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },

    button__sup: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#ebf2ed',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
    },

    buttonText__sup: {
        color: 'darkgreen',
        fontSize: 16,
        fontWeight: '900',
    },

    txt__main: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 5,
    },

    txt__sec: {
        color: '#aeb5b4',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
        width: '70%',
        alignSelf: 'center',
        lineHeight: 20,
    },

    txt__sup: {
        color: '#656b6a',
    },
});

export default Welcome;
