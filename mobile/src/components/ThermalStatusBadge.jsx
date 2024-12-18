import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';

const ThermalStatusBadge = ({ value }) => {
    return (
        <View
            style={[
                styles.container,
                value > 30
                    ? styles.cont__high
                    : value > 20
                        ? styles.cont__moderate
                        : value ? styles.cont__low : "",
            ]}
        >
            {value < 30 ? (
                <EIcon name="thumbs-up" color="white" />
            ) : (
                <FaIcon name="exclamation-triangle" color="white" />
            )}
            <Text style={styles.text}>
                {value > 30 ? 'High' : value > 20 ? 'Moderate' : value ? "Low" : "Unknown"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 1.5,
        borderColor: '#ccd1d9',
        borderWidth: 0.5,
        borderRadius: 4,
        alignItems: 'center',
        backgroundColor: "gray"
    },

    cont__high: {
        backgroundColor: 'red',
    },

    cont__low: {
        backgroundColor: '#b3760e',
    },

    cont__moderate: {
        backgroundColor: 'green',
    },

    text: {
        textTransform: 'uppercase',
        fontWeight: '900',
        fontSize: 11,
        color: 'white',
        marginLeft: 5,
    },
});

export default ThermalStatusBadge;
