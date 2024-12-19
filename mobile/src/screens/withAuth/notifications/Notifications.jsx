import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Notifications = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.btn}>Currently, there are no notifications.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 30,
        justifyContent: "center"
    },

    btn: {
        alignSelf: "center",
        textAlign: "center",
        width: "70%",
        color: "black",
        fontSize: 20,
        fontWeight: "bold"
    }
})

export default Notifications