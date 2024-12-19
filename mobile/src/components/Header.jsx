import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { PROFILE, SETTINGS } from '../screens/screens';
import { useAuth } from '../hooks/auth/useAuth';

const Header = () => {
    const navigation = useNavigation();

    const [isCardVisible, setCardVisible] = useState();
    const { first_name: loggedInUser } = useSelector(selectCurrentUser);
    const { signOut } = useAuth();

    const toggleCard = () => setCardVisible(!isCardVisible);

    const handleLogOut = () => {
        try {
            signOut();
        } catch (error) {
            console.debug(error);
        }
    };

    const goTo = page => {
        navigation.navigate(page);
    };

    return (
        <View style={styles.headerContainer}>
            {/* <TouchableOpacity onPress={() => navigation.navigate(PROFILE)}>
                <MIcon name="account-circle-outline" style={styles.headerIcon} />
            </TouchableOpacity> */}
            <Text style={styles.welcome_text}>Hey, {loggedInUser}</Text>
            <TouchableOpacity onPress={() => navigation.navigate(PROFILE)}>
                <MIcon
                    name="account-circle-outline"
                    style={styles.headerIcon}
                />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate(SETTINGS)}>
                <IoIcon name="settings-outline" style={styles.headerIcon} />
            </TouchableOpacity> */}
        </View>
    );
};

export const BasicHeader = ({ title = 'Header' }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerBasicContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MIcon name="arrow-left" style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.welcome_basic_text}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 10,
        alignItems: 'center',
    },

    headerBasicContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerIcon: {
        color: '#1C170D',
        fontSize: 28,
        fontWeight: '700',
    },

    welcome_text: {
        flex: 1,
        color: '#1C170D',
        paddingHorizontal: 20,
        fontSize: 25,
        fontWeight: 'bold',
    },

    welcome_basic_text: {
        color: '#1C170D',
        paddingHorizontal: 20,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
});

export default Header;
