import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome6';
import { THERMAL_STRESS_CALCULATOR } from '../../screens';

const Tools = () => {
    const { navigate } = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.backgd_img}
                    source={require('../../../assets/farm_img/0.png')}
                />
                <Text style={styles.header__sup}>
                    Tools to assist in your daily farm management
                </Text>
            </View>
            <View style={{ marginTop: 30 }}>
                <Text style={styles.intro}>Select tool to use</Text>
                <ToolItem
                    Icon={
                        <FIcon name="temperature-full" color="red" size={22} />
                    }
                    title={'Thermal stress calculator'}
                    onClick={() => navigate(THERMAL_STRESS_CALCULATOR)}
                    showArrow={false}
                />
                {/* <ToolItem
                    Icon={
                        <FIcon
                            name="temperature-high"
                            color="yellow"
                            size={22}
                        />
                    }
                    title={'Temperature converter'}
                    onClick={() => {}}
                    showArrow={false}
                /> */}
            </View>
        </View>
    );
};

const ToolItem = ({ Icon, title, onClick }) => {
    return (
        <TouchableOpacity onPress={() => onClick()}>
            <View style={tool_styles.container}>
                <View style={tool_styles.icon_container}>{Icon}</View>
                <Text style={tool_styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const tool_styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10,
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
        // marginHorizontal: 5,
        // border
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 8,
    },

    icon_container: {
        padding: 8,
        backgroundColor: '#EDEDED',
        borderRadius: 8,
    },

    title: {
        color: 'black',
        fontSize: 19,
        fontWeight: '400',
        flex: 1,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    header: {
        position: 'relative',
    },

    intro: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    header__sup: {
        marginBottom: 30,
        fontSize: 22,
        color: 'gray',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        fontWeight: '700',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    backgd_img: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
});

export default Tools;
