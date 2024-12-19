import React, {
    useRef,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';

import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/slices/authSlice';

const Profile = () => {
    const refInput = useRef(null);
    const user = useSelector(selectCurrentUser);

    return (
        <View style={styles.container}>
            <View style={styles.container_upp}></View>
            <View style={styles.container_mid}>
                <Image
                    style={styles.profile_img}
                    source={require('../../../assets/download.png')}
                />
            </View>
            <ScrollView style={styles.container_low}>
                {/* <Link to={''} style={styles.link_change}>
                    Change Photo
                </Link> */}

                <Text style={styles.input__label}>First Name</Text>
                <TextInput
                    ref={refInput}
                    value={user?.first_name}
                    style={[styles.input, styles.input__name]}
                    placeholder="Your first name"
                    editable={false}
                />

                <Text style={styles.input__label}>Last Name</Text>
                <TextInput
                    value={user?.last_name}
                    style={[styles.input, styles.input__name]}
                    placeholder="Your Last name"
                    editable={false}
                />

                <Text style={styles.input__label}>Email</Text>
                <TextInput
                    value={user?.email}
                    style={[styles.input, styles.input__name]}
                    placeholder="Your first name"
                    editable={false}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
    },

    container_upp: {
        height: 130,
        backgroundColor: '#ebf2ed',
    },

    icon_edit: {
        color: 'darkgreen',
        fontSize: 15,
        padding: 3,
    },

    container_mid: {
        position: 'relative',
    },

    profile_img: {
        alignSelf: 'center',
        height: 150,
        width: 150,
        borderRadius: 75,
        position: 'absolute',
        top: -75,
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 10,
    },

    container_low: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 80,
        paddingHorizontal: 20,
    },

    passwd__wrapper: {
        width: '100%',
        padding: 0,
        margin: 0,
        flexDirection: 'row',
        backgroundColor: '#ebf2ed',
        alignItems: 'center',
        paddingRight: 10,
        borderRadius: 5,
        marginBottom: 15,
    },

    link_change: {
        textAlign: 'center',
        color: '#4c7d4d',
        fontWeight: '700',
        marginBottom: 20,
    },

    input__label: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },

    input_passwd: {
        flex: 1,
        height: 40,
        color: 'black',
        paddingHorizontal: 15,
    },

    input: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#ebf2ed',
        borderRadius: 5,
        color: 'black',
        textDecorationLine: 'none',
    },

    header_txt: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },

    btm_style: {
        marginTop: 5,
        borderColor: 'darkgreen',
        borderTopWidth: 2,
        borderStartWidth: 2,
        borderEndWidth: 2,
    },

    btm_cont_style: {
        // zIndex: 100
    },

    btm_cmp: {
        zIndex: 200,
        paddingHorizontal: 25,
    },

    button: {
        backgroundColor: 'darkgreen',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginVertical: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
    },
});

export default Profile;
