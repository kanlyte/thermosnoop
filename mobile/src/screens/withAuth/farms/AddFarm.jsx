import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    PermissionsAndroid,
    Alert,
    Keyboard,
} from 'react-native';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LocationPicker from '../../../components/LocationPicker';
import { FARMS } from '../../screens';
import {
    isLocationEnabled,
    promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import { useAddFarmMutation } from '../../../redux/apis/baseApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/slices/authSlice';
import {
    KEYS,
    formatToSentenceCase,
    getItemAsyncStorage,
} from '../../../utils/basicUtil';
import { GOOGLE_MAPS_API_KEY } from '@env';

const AddFarm = ({ navigation }) => {
    const [farm, setFarm] = useState({
        name: null,
        district: null,
        latitude: null,
        longtude: null,
    });
    const [region, setRegion] = useState(null);

    const { id } = useSelector(selectCurrentUser);

    useEffect(() => {
        const checkLocationPermission = async () => {
            try {
                const permissionStatus = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (!permissionStatus) {
                    const requestPermission = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    if (
                        requestPermission === PermissionsAndroid.RESULTS.DENIED
                    ) {
                        Alert.alert(
                            'Information',
                            'Please grant the app location permission to enable the desired feature.',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => checkLocationPermission(),
                                    isPreferred: true,
                                },

                                {
                                    text: 'Cancel',
                                    onPress: () =>
                                        navigation.navigate(`_${FARMS}`),
                                },
                            ],
                            { cancelable: false },
                        );
                    } else if (
                        requestPermission ===
                        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                    ) {
                        Alert.alert(
                            'Information',
                            'Please enable location permission in the app settings to use this feature.',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => {
                                        navigation.navigate(`_${FARMS}`);
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                    }
                }
            } catch (error) {
                Alert.alert(
                    'Error',
                    'Encountered problem requesting location permission. \
                    Please enable location permission in the app settings.',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                navigation.navigate(`_${FARMS}`);
                            },
                        },
                    ],
                    {
                        cancelable: true,
                        onDismiss: () => {
                            navigation.navigate(`_${FARMS}`);
                        },
                    },
                );
            }
        };

        checkLocationPermission();
    }, []);

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['90%'], []);

    const showLocationSheet = async () => {
        Keyboard.dismiss();
        const checkLocationEnabled = await isLocationEnabled();
        if (checkLocationEnabled) {
            bottomSheetRef?.current?.present();
        } else {
            promptForEnableLocationIfNeeded()
                .then(response => {
                    bottomSheetRef?.current?.present();
                })
                .catch(error => {
                    console.debug(error);
                });
        }
    };

    const dismissLocationSheet = () => {
        bottomSheetRef?.current?.dismiss();
    };

    const handleMapPress = event => {
        const { coordinate } = event.nativeEvent;
        setLocation(coordinate);
    };

    const [addFarm, { isLoading }] = useAddFarmMutation();
    const handleSubmit = async () => {
        try {
            const farmWithUserId = {
                ...farm,
                user_id: id,
                refreshToken: await getItemAsyncStorage(KEYS.REFRESH_TOKEN),
            };
            await addFarm(farmWithUserId).unwrap();
            Alert.alert('Success', 'New farm added successfully.', [
                {
                    text: 'Ok',
                    onPress: () => navigation.navigate(`_${FARMS}`),
                },
            ]);
        } catch (error) {
            Alert.alert(
                'Error',
                formatToSentenceCase(error?.data) || 'Error adding a farm',
                [
                    {
                        text: 'Back',
                        onPress: () => navigation.navigate(`_${FARMS}`),
                    },
                    {
                        text: 'Try again',
                        onPress: () => {},
                        isPreferred: true,
                    },
                ],
            );
        }
    };

    const setFarmValue = (key, value) => {
        setFarm({ ...farm, [key]: value });
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter farm name"
                placeholderTextColor={'gray'}
                value={farm.name}
                onChangeText={text => setFarmValue('name', text)}
            />

            <Text style={styles.label}>Farm location</Text>
            <View style={{ width: '100%', flex: 1 }}>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails={true}
                    onPress={(_, details = null) => {
                        if (details) {
                            const { lat, lng } = details.geometry?.location;
                            setFarm({
                                ...farm,
                                district: details?.formatted_address,
                                latitude: null,
                                longtude: null,
                            });
                            setRegion({
                                latitude: lat,
                                longitude: lng,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            });
                        }
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                        components: 'country:ug',
                        types: '(regions)',
                    }}
                    listViewDisplayed={'auto'}
                    onFail={error => console.error(error)}
                    onNotFound={() => console.log('No results found')}
                    onLoading={() => console.log('Loading...')}
                    listLoaderComponent={
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 150,
                            }}
                        >
                            <Text style={{ color: 'black' }}>
                                Searching for places ...
                            </Text>
                        </View>
                    }
                    styles={{
                        textInputContainer: {
                            width: '100%',
                        },
                        textInput: {
                            ...styles.input,
                            color: '#5d5d5d',
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb',
                        },
                        listView: {
                            borderColor: '#5d5d5d',
                            borderWidth: 1,
                            borderRadius: 2,
                        },
                        row: {
                            borderBottomColor: '#5d5d5d',
                        },
                        description: {
                            // color: 'white',
                            color: 'black',
                        },
                    }}
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        placeholder: 'Enter location',
                    }}
                    listEmptyComponent={
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 150,
                            }}
                        >
                            <Text style={{ color: 'black' }}>
                                No areas found
                            </Text>
                        </View>
                    }
                />
            </View>
            {!farm.latitude ? (
                <>
                    {region && (
                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={showLocationSheet}
                        >
                            <Text style={styles.buttonText}>
                                Pick Farm Location
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    {isLoading ? (
                        <ActivityIndicator color={'white'} size={25} />
                    ) : (
                        <Text style={styles.buttonText}>Add Farm</Text>
                    )}
                </TouchableOpacity>
            )}

            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                containerStyle={styles.btm_cont_style}
                backgroundStyle={styles.btm_style}
                enablePanDownToClose={true}
            >
                <LocationPicker
                    dismissSheet={dismissLocationSheet}
                    farm={farm}
                    setFarm={setFarm}
                    region={region}
                />
            </BottomSheetModal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    map_container: {
        flex: 1,
    },
    google_bar: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: 'red',
        borderRadius: 5,
        color: 'black',
        textDecorationLine: 'none',
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    label: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        fontSize: 17,
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
    map: {
        height: 200,
        marginBottom: 15,
    },

    button: {
        backgroundColor: 'darkgreen',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginVertical: 15,
    },
    disabledButton: {
        backgroundColor: '#acbdac',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
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
});

export default AddFarm;
