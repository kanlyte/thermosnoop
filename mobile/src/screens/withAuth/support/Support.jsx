import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import FIcon from "react-native-vector-icons/FontAwesome"
import MIcon from "react-native-vector-icons/MaterialCommunityIcons"

const Support = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Contact us</Text>
            <View style={styles.support_container}>
                <SupportItem
                    Icon={<FIcon name={"phone"} size={20} color={"black"} />}
                    title={"Phone Number"}
                    value={"+256-700-795566"}
                />
                <SupportItem
                    Icon={<FIcon name={"whatsapp"} size={20} color={"black"} />}
                    title={"WhatsApp"}
                    value={"+256-773-337677"}
                />
                <SupportItem
                    Icon={<MIcon name={"email-open-outline"} size={20} color={"black"} />}
                    title={"Email"}
                    value={"gadk@lirauni.ac.ug"}
                />
            </View>
            {/* <Text style={styles.heading}>Follow us</Text>
            <View style={styles.support_container}>
                <SupportItem
                    Icon={<FIcon name={"twitter"} size={20} color={"black"} />}
                    title={"X"}
                    value={"@thermosnoop"}
                />
                <SupportItem
                    Icon={<FIcon name={"facebook-f"} size={20} color={"black"} />}
                    title={"Facebook"}
                    value={"#Thermosnoop"}
                />
            </View> */}
        </View>
    )
}


const SupportItem = ({ Icon, title, value }) => {

    return (
        <View style={support_styles.container} >
            <View style={support_styles.icon_container}>
                {Icon}
            </View>
            <Text style={support_styles.title}>
                {title}
            </Text>
            <Text style={support_styles.value} selectable={true}>
                {value}
            </Text>
        </View>
    )
}



const support_styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 7,
        // paddingHorizontal: 10,
        alignItems: "center",
        gap: 15,
    },

    icon_container: {
        padding: 8,
        backgroundColor: "#EDEDED",
        borderRadius: 8
    },

    title: {
        color: "black",
        fontSize: 17,
        fontWeight: "400",
        flex: 1
    },

    value: {
        textAlign: "left", color: "black",
        fontSize: 17,
        fontWeight: "400",
    }

})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 20
    },

    support_container: {
        paddingVertical: 10,
        paddingBottom: 30
    },

    heading: {
        fontWeight: "500",
        fontSize: 22,
        color: "black"
    }
})



export default Support