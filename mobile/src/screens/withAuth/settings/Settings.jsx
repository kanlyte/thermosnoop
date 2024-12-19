import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/slices/authSlice';
import EnIcon from 'react-native-vector-icons/Entypo';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { NOTIFICATIONS, PROFILE, SUPPORT } from '../../screens';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Settings = () => {
    const { signOut } = useAuth();
    const { navigate } = useNavigation();
    const { first_name, last_name, email } = useSelector(selectCurrentUser);

    return (
        <View style={styles.container}>
            <View style={styles.prof}>
                <Image
                    style={styles.prof_img}
                    source={require('../../../assets/download.png')}
                />
                <Text
                    style={styles.prof_name}
                >{`${first_name}  ${last_name}`}</Text>
                <Text style={styles.prof_email}>{`${email}`}</Text>
            </View>
            <View style={styles.settings}>
                <SettingItem
                    Icon={<FIcon name="user-circle" color="black" size={22} />}
                    title={'Account'}
                    onClick={() => navigate(PROFILE)}
                />
                {/* <SettingItem
                    Icon={<FIcon name="bell-o" color="black" size={22} />}
                    title={"Notifications"}
                    onClick={() => navigate(NOTIFICATIONS)}
                /> */}
                <SettingItem
                    Icon={<MIcon name="help" color="black" size={22} />}
                    title={'Help & Support'}
                    onClick={() => navigate(SUPPORT)}
                />
            </View>
            <View style={styles.log_out_container}>
                <TouchableOpacity onPress={() => signOut()}>
                    <View style={styles.log_out}>
                        <EnIcon name={'log-out'} size={25} color={'black'} />
                        <Text style={styles.log_out_txt}>Log Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const SettingItem = ({ Icon, title, onClick, showArrow = true }) => {
    return (
        <TouchableOpacity onPress={() => onClick()}>
            <View style={setting_styles.container}>
                <View style={setting_styles.icon_container}>{Icon}</View>
                <Text style={setting_styles.title}>{title}</Text>
                {showArrow && (
                    <FIcon name={'angle-right'} size={35} color={'black'} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const setting_styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10,
        alignItems: 'center',
        gap: 15,
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
        paddingHorizontal: 15,
        paddingBottom: 30,
    },

    prof: {
        paddingTop: 5,
        paddingBottom: 30,
    },

    prof_img: {
        alignSelf: 'center',
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: 'white',
    },

    prof_name: {
        color: 'black',
        fontWeight: '700',
        fontSize: 18,
        alignSelf: 'center',
    },

    prof_email: {
        color: '#6B6B6B',
        fontWeight: '500',
        fontSize: 15,
        alignSelf: 'center',
    },

    settings: {
        flex: 1,
    },

    log_out_container: {
        padding: 10,
    },

    log_out: {
        backgroundColor: '#EDEDED',
        paddingVertical: 15,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },

    log_out_txt: {
        color: 'black',
        fontSize: 19,
        fontWeight: '500',
    },

    btn: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Settings;
