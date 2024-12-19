import { View, Text, StyleSheet, TouchableOpacity, Touchable, ActivityIndicator, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { VIEW_FARM } from '../../screens';
import useFetchFarm from '../../../hooks/fetchData/useFetchFarm';
import EIcon from 'react-native-vector-icons/Entypo'
import { formatToSentenceCase } from '../../../utils/basicUtil';

const IMG_0 = require(`../../../assets/farm_img/0.png`);
const IMG_1 = require(`../../../assets/farm_img/1.png`);
const IMG_2 = require(`../../../assets/farm_img/2.png`);
const IMG_3 = require(`../../../assets/farm_img/3.png`);
const IMG_4 = require(`../../../assets/farm_img/4.png`);


const getBgColor = (discomfortLevel) => {
    switch (discomfortLevel) {
        case "Emergency":
            return "#99352e";
        case "Danger":
            return "#ff6054";
        case "Alert":
            return "#ffe552";
        case "Discomfort":
            return "#ff8e52";
        case "Mild discomfort":
            return "#ffac80";
        default:
            return "#346e2f";
    }
}

const getRandomImage = () => {
    var random_img;
    const random_num = Math.floor(Math.random() * 5)
    switch (random_num) {
        case 0:
            random_img = IMG_0;
            break;
        case 1:
            random_img = IMG_1;
            break;
        case 2:
            random_img = IMG_2;
            break;
        case 3:
            random_img = IMG_3;
            break;
        case 4:
            random_img = IMG_4;
            break;
        default:
            random_img = IMG_0;
            break;
    }
    return <Image style={styles.farm_img} source={random_img} />
}


const FarmCard = ({ farmId }) => {
    const { navigate } = useNavigation();

    const { data: farm, loading } = useFetchFarm(farmId);

    if (loading) {
        return <View style={styles.loading_container}>
            <ActivityIndicator size={20} />
        </View>
    }

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => navigate(VIEW_FARM, { id: farmId })}>
            <View style={styles.container}>
                <View style={styles.card_container}>
                    <View style={styles.cont__left}>
                        <View style={styles.farm_info}>
                            <View style={styles.farm_desc}>
                                <Text style={styles.name} ellipsizeMode='tail' numberOfLines={1}>{formatToSentenceCase(farm?.name)}</Text>
                                <Text style={styles.location}>
                                    <EIcon style={styles.location__pin} name="location-pin" size={12} />
                                    {
                                        farm?.district
                                    }
                                </Text>
                            </View>
                            <View style={styles.farm_status}>
                                {
                                    farm?.currentWeather?.thermoStress &&
                                    <Text style={styles._status}>{Math.floor(farm?.currentWeather?.thermoStress)}</Text>
                                }
                            </View>
                        </View>

                        <View style={styles.more_data}>
                            {
                                farm?.currentWeather?.discomfortLevel ?
                                    <Text style={[styles.more_data_act, { backgroundColor: getBgColor(farm?.currentWeather?.discomfortLevel) }]}>{farm?.currentWeather?.discomfortLevel}</Text>
                                    : <Text style={styles.more_data_act}>{"Get current state"}</Text>
                            }
                        </View>
                    </View>

                    <View style={styles.cont__right}>
                        {getRandomImage()}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    loading_container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 140
    },

    container: {
        padding: 16,
        paddingVertical: 8,
    },

    card_container: {
        backgroundColor: "white",
        borderColor: "#F5F0E5",
        borderWidth: 1,
        borderRadius: 20,
        padding: 12,
        flexDirection: "row",
        gap: 12
    },

    farm_img: {
        height: 120,
        width: 120,
        borderRadius: 10
    },

    cont__left: {
        flex: 1
    },

    farm_info: {
        flex: 1,
        flexDirection: "row",
        gap: 5
    },

    farm_desc: {
        flex: 1,
    },

    farm_status: {
    },

    name: {
        color: "black",
        fontSize: 20,
        fontWeight: "700",
        width: "90%",
    },

    location: {
        color: "#A1824A",
        fontWeight: "500"
    },

    location__pin: {
        fontWeight: "700"
    },

    _status: {
        color: "#A1824A",
        color: "darkgreen",
        // fontWeight: "bold",
        fontSize: 40
    },

    more_data: {
        paddingVertical: 5
    },

    more_data_act: {
        alignSelf: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: "#F5F0E5",
        borderRadius: 10,
        color: "white",
        fontSize: 15,
        fontWeight: "500"
    },

    th_value: {
    },

    cont__right: {
    }
});

export default FarmCard;
