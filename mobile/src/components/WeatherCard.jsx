import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome6"

const WeatherCard = ({ data, children, ...rest }) => {
    return (
        <View style={[styles.card, rest?.style]}>
            <View style={[styles.icon_ctr, { backgroundColor: data?.icon_color }]}>
                <Icon name={data?.icon} size={22} color={"white"} />
            </View>
            <View style={styles.data_ctr}>
                <Text style={styles.data_value}>{data?.value}
                    <Text style={styles.data_symbol}>{data?.symbol}</Text>
                </Text>
            </View>
            <Text style={styles.data_title}>{data?.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        shadowColor: "",
        shadowOffset: 1,
        shadowRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#dedcdc",
        borderRadius: 10,
        marginBottom: 20,
        paddingVertical: 20
    },

    icon_ctr: {
        borderRadius: 45,
        width: 45,
        height: 45,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center"
    },

    data_ctr: {
        flexDirection: "row"
    },

    data_value: {
        fontSize: 50,
        fontWeight: "bold",
        color: "black",
    },

    data_symbol: {
        fontSize: 18,
        color: "black",
        fontWeight: "500",
        alignSelf: "center",
        color: "#c2c2c2",
    },

    data_title: {
        color: "#c2c2c2",
        fontWeight: "800",
        fontSize: 15
    }

})


export default WeatherCard
