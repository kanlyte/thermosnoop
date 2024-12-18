import {
    View,
    Text,
    StyleSheet,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
    isLocationEnabled,
    promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Icon from 'react-native-vector-icons/FontAwesome';

const CENTRAL_LOCATION = {
    // Kampala Default
    latitude: 0.33695153110668835,
    longitude: 32.57991314874516,
};

const LocationPicker = ({ dismissSheet, farm, setFarm, region }) => {
    const [loading, setLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: region?.latitude
            ? region.latitude
            : CENTRAL_LOCATION.latitude,
        longitude: region?.longitude
            ? region.longitude
            : CENTRAL_LOCATION.longitude,
    });

    const [selectedRegion, setSelectedRegion] = useState(null);
    const handleMapSelection = event => {
        if (event?.nativeEvent?.coordinate) {
            const { latitude, longitude } = event?.nativeEvent?.coordinate;
            setCurrentLocation({
                longitude: longitude,
                latitude: latitude,
            });
        }
    };

    const submitLocation = () => {
        setFarm({
            ...farm,
            ['latitude']: currentLocation.latitude,
            ['longtude']: currentLocation.longitude,
        });
        dismissSheet();
    };

    // useEffect(() => {
    //     const getUserLocation = async () => {
    //         Geolocation.getCurrentPosition(
    //             ({ coords: { latitude, longitude } }) => {
    //                 setCurrentLocation({ latitude, longitude });
    //                 setLoading(false);
    //             },
    //             error => {
    //                 Alert.alert(
    //                     'Error',
    //                     'Failed to resolve your current location.',
    //                     [
    //                         {
    //                             text: 'Ok',
    //                             onPress: () => {},
    //                         },
    //                     ],
    //                     {
    //                         cancelable: true,
    //                     },
    //                 );
    //                 setLoading(false);
    //             },
    //         ),
    //             { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
    //     };
    //     getUserLocation();
    // }, []);

    //
    const [zoom, setZoom] = useState(14);
    const mapRef = useRef(null);
    const MAX_ZOOM_LEVEL = 20;
    const MIN_ZOOM_LEVEL = 3;

    const getLatLongDelta = (zoom, latitude) => {
        const LONGITUDE_DELTA = Math.exp(Math.log(360) - zoom * Math.LN2);
        const ONE_LATITUDE_DEGREE_IN_METERS = 111.32 * 1000;
        const accurateRegion =
            LONGITUDE_DELTA *
            (ONE_LATITUDE_DEGREE_IN_METERS *
                Math.cos(latitude * (Math.PI / 180)));
        const LATITUDE_DELTA = accurateRegion / ONE_LATITUDE_DEGREE_IN_METERS;
        return {
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
    };

    const handleZoom = (isZoomIn = false) => {
        let currentZoomLevel = zoom;
        if (!isZoomIn && currentZoomLevel === MAX_ZOOM_LEVEL) {
            currentZoomLevel -= 1;
        } else if (isZoomIn && currentZoomLevel === MIN_ZOOM_LEVEL) {
            currentZoomLevel += 1;
        }
        if (
            currentZoomLevel >= MAX_ZOOM_LEVEL ||
            currentZoomLevel <= MIN_ZOOM_LEVEL
        ) {
            return;
        }

        currentZoomLevel = isZoomIn
            ? currentZoomLevel + 1
            : currentZoomLevel - 1;
        const zoomedInRegion = {
            ...(selectedRegion ? selectedRegion : currentLocation),
            ...getLatLongDelta(
                currentZoomLevel,
                selectedRegion?.latitude
                    ? selectedRegion.latitude
                    : currentLocation?.latitude,
            ),
        };
        setSelectedRegion(zoomedInRegion);
        setZoom(currentZoomLevel);
        mapRef?.current?.animateToRegion(zoomedInRegion, 100);
    };

    return loading ? (
        <ActivityIndicator />
    ) : (
        <View style={styles.container}>
            <Text style={styles.header}>Pick Your Farm's Location</Text>
            <View style={styles.map_container}>
                <MapView
                    ref={mapRef}
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: currentLocation?.latitude,
                        longitude: currentLocation?.longitude,
                        latitudeDelta: region?.latitudeDelta || 0.01,
                        longitudeDelta: region?.longitudeDelta || 0.01,
                    }}
                    onRegionChangeComplete={region => {
                        setSelectedRegion(region);
                    }}
                    onPress={handleMapSelection}
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation?.latitude,
                            longitude: currentLocation?.longitude,
                        }}
                        draggable
                    />
                </MapView>
                <View style={styles.zoom_container}>
                    <TouchableOpacity
                        onPress={() => handleZoom(true)}
                        disabled={zoom === MAX_ZOOM_LEVEL}
                    >
                        <Icon
                            name={'plus'}
                            color={'darkgreen'}
                            size={30}
                            style={{
                                opacity: zoom === MAX_ZOOM_LEVEL ? 0.2 : 1,
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleZoom()}
                        disabled={zoom === MIN_ZOOM_LEVEL}
                    >
                        <Icon
                            name={'minus'}
                            size={30}
                            color={'darkgreen'}
                            style={{
                                opacity: zoom === MIN_ZOOM_LEVEL ? 0.2 : 1,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={submitLocation}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
    },

    header: {
        color: 'gray',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginVertical: 10,
    },

    map_container: {
        height: '80%',
        position: 'relative',
    },

    zoom_container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingHorizontal: 18,
        paddingBottom: 10,
        gap: 10,
    },

    map: {
        flex: 1,
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

    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default LocationPicker;
