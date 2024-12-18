import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import Farms from '../farms/Farms';
import HomeHeader from '../../../components/HomeHeader';

const Home = () => {

    return (
        <KeyboardAvoidingView style={styles.container}>
            <HomeHeader />
            <Farms />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: 'white',
        // backgroundColor: "#E0F0D9"
        backgroundColor: "white"
    },
});

export default Home;
