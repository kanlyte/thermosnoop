import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ADD_FARM } from '../screens/screens';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import {useAuth} from '../hooks/auth/useAuth';

/**
 * Renders the header component for the home page.
 *
 * @return {JSX.Element} The rendered header component.
 */
const HomeHeader = () => {
    const navigation = useNavigation();
    const { firstName } = useSelector(selectCurrentUser);
    const { signOut } = useAuth();

    const handleLogOut = () => signOut();

    const goToAddFarm = () => navigation.navigate(ADD_FARM);

    return (
        <View style={styles.container}>
            <Text style={styles.capture_att__txt}>
                Know the thermal stress level of your cattle to increase
                productive and reproductive efficiency
            </Text>
            <View style={styles.capture_att__txt_act_container}>
                <TouchableOpacity onPress={goToAddFarm}>
                    <Text style={styles.capture_att__txt_act}>Add Farm</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleLogOut}>
                <Text style={styles.capture_att__txt_act}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingBottom: 0
    },

    capture_att__txt: {
        paddingBottom: 30,
        color: "black",
        fontWeight: "300",
        fontSize: 20,
        width: "90%",
        alignSelf: "center",
        // textAlign: "center"
    },

    capture_att__txt_act_container: {
        paddingHorizontal: 24,
        paddingVertical: 15,
        backgroundColor: "darkgreen",
        borderRadius: 20,
        alignSelf: "center"
    },

    capture_att__txt_act: {
        color: "white",
        fontWeight: "bold",
        fontSize: 17
    },
})

export default HomeHeader

