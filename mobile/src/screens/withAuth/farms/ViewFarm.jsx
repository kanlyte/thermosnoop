import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import FaIcon from 'react-native-vector-icons/FontAwesome6';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WeatherCard from '../../../components/WeatherCard';
import useFetchFarm from '../../../hooks/fetchData/useFetchFarm';
import {
    useAddWeatherLogMutation,
    useDeleteFarmMutation,
    useGetHistoricalWeatherQuery,
} from '../../../redux/apis/baseApi';
import {
    KEYS,
    convertGraphTime,
    convertTime,
    formatDate,
    getItemAsyncStorage,
} from '../../../utils/basicUtil';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { FARMS, HOME } from '../../screens';
import { LineChart } from 'react-native-chart-kit';

const CARDS = [
    {
        title: 'Air Temperature',
        key: 'temp_value',
        symbol: '°C',
        icon: 'temperature-half',
        icon_color: '#fa8e8e',
    },
    {
        title: 'Relative Humidity',
        key: 'hum_value',
        symbol: '%',
        icon: 'droplet',
        icon_color: '#7e9fe6',
    },
];

const F_CARDS = [
    {
        title: 'Air Temperature',
        key: 'temp',
        symbol: '°C',
        icon: 'temperature-half',
        icon_color: '#fa8e8e',
    },
    {
        title: 'Relative Humidity',
        key: 'hum',
        symbol: '%',
        icon: 'droplet',
        icon_color: '#7e9fe6',
    },
];

const getBgColor = discomfortLevel => {
    switch (discomfortLevel) {
        case 'Emergency':
            return '#99352e';
        case 'Danger':
            return '#ff6054';
        case 'Alert':
            return '#ffe552';
        case 'Discomfort':
            return '#ff8e52';
        case 'Mild discomfort':
            return '#ffac80';
        default:
            return '#346e2f';
    }
};

const TABS = {
    CURRENT: 'current',
    FORECAST: 'forecast',
    HISTORY: 'history',
};

const FORECAST_TABS = {
    NEXT_HR: 'next_hour',
    NEXT_DAY: 'next_day',
    NEXT_WK: 'next_week',
};

const ViewFarm = ({ navigation, route }) => {
    const [selectedTab, setSelectedTab] = useState(TABS.CURRENT);
    const [selectedForecastTab, setSelectedForecastTab] = useState(
        FORECAST_TABS.NEXT_HR,
    );
    const { id } = route?.params;
    const { data, loading, isFetching, isFetchingLogs } = useFetchFarm(id);
    const [addWeatherLog, { isLoading }] = useAddWeatherLogMutation();

    const [deleteFarm, { isLoading: isDeletingFarm }] = useDeleteFarmMutation();

    const graphData = useMemo(() => {
        return {
            labels: data?.weatherLogs?.map(log => log?.createdAt),
            datasets: [
                {
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    data: data?.weatherLogs?.map(log => log.thermoStress),
                },
            ],
        };
    }, []);

    const graphConfig = useMemo(() => {
        return {
            width: Dimensions.get('window').width - 30,
            height: 400,
            chartConfig: {
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            },
        };
    }, []);

    const handlePress = async () => {
        try {
            const log_data = {
                lat: data?.latitude,
                lon: data?.longtude,
                farm_id: data?.id,
                refreshToken: await getItemAsyncStorage(KEYS.REFRESH_TOKEN),
                time: Date.now(),
            };
            addWeatherLog(log_data);
        } catch (error) {
            console.debug(error);
        }
    };

    const handleDeleteFarm = () => {
        Alert.alert(
            'Confirm',
            `Are you sure you want to delete farm ${data?.name} ?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    isPreferred: true,
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await deleteFarm(data?.id);
                            navigation.navigate(`_${FARMS}`);
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ],
            {
                cancelable: true,
            },
        );
    };

    const forecastData = useMemo(() => {
        const weather_data = data?.currentWeather;
        var forecasted_data = {};
        switch (selectedForecastTab) {
            case FORECAST_TABS.NEXT_HR:
                forecasted_data = {
                    temp: weather_data?.hr_temp,
                    hum: weather_data?.hr_hum,
                    thermoStress: weather_data?.hr_thermoStress,
                    level: weather_data?.hr_discomfortLevel,
                };
                break;
            case FORECAST_TABS.NEXT_DAY:
                forecasted_data = {
                    temp: weather_data?.daily_temp,
                    hum: weather_data?.daily_hum,
                    thermoStress: weather_data?.daily_thermoStress,
                    level: weather_data?.daily_discomfortLevel,
                };
                break;
            case FORECAST_TABS.NEXT_WK:
                forecasted_data = {
                    temp: weather_data?.weekly_temp,
                    hum: weather_data?.weekly_hum,
                    thermoStress: weather_data?.weekly_thermoStress,
                    level: weather_data?.weekly_discomfortLevel,
                };
                break;
        }
        return forecasted_data;
    }, [selectedForecastTab, data]);

    if (loading) {
        return (
            <View style={styles.loading_ctr}>
                <ActivityIndicator />
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    Fetching farm ...
                </Text>
            </View>
        );
    }

    if (isDeletingFarm) {
        return (
            <View style={styles.loading_ctr}>
                <ActivityIndicator />
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    Deleting farm ...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.container__upper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FaIcon name={'arrow-left'} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteFarm}>
                        <MIcon name={'delete-forever'} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.overview}>
                    <View style={styles.farm_info}>
                        <View>
                            <Text style={styles.farm_name}>{data?.name}</Text>
                            <Text style={styles.farm_loc}>
                                {data?.district}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.farm_stress}>
                        {data?.currentWeather?.createdAt && (
                            <View>
                                <Text style={{ color: '#6a8070' }}>
                                    Last updated
                                </Text>
                                <Text style={{ color: 'white' }}>
                                    {convertTime(
                                        data?.currentWeather?.createdAt,
                                    )}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={handlePress}>
                            <View style={styles.get_curr_btn}>
                                {isLoading ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text style={styles.get_data_btn}>
                                        Get Current
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {isFetching ? (
                <View style={styles.loading_ctr}>
                    <ActivityIndicator />
                </View>
            ) : (
                <View style={styles.container__lower}>
                    <View style={styles.tabs}>
                        <Text
                            style={[
                                styles.tab_name,
                                selectedTab == TABS.CURRENT
                                    ? styles.tab_selected
                                    : {},
                            ]}
                            onPress={() => setSelectedTab(TABS.CURRENT)}
                        >
                            Current
                        </Text>
                        <Text
                            style={[
                                styles.tab_name,
                                selectedTab == TABS.FORECAST
                                    ? styles.tab_selected
                                    : {},
                            ]}
                            onPress={() => setSelectedTab(TABS.FORECAST)}
                        >
                            Forecast
                        </Text>
                        <Text
                            style={[
                                styles.tab_name,
                                selectedTab == TABS.HISTORY
                                    ? styles.tab_selected
                                    : {},
                            ]}
                            onPress={() => setSelectedTab(TABS.HISTORY)}
                        >
                            Past
                        </Text>
                    </View>

                    {selectedTab == TABS.CURRENT && (
                        <>
                            <View style={[styles.stress_card]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        paddingVertical: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.icon_ctr,
                                                {
                                                    backgroundColor:
                                                        'darkgreen',
                                                },
                                            ]}
                                        >
                                            <Icon
                                                name={'cloud-sun'}
                                                size={22}
                                                color={'white'}
                                            />
                                        </View>
                                        <View style={styles.data_ctr}>
                                            <Text style={styles.data_value}>
                                                {Math.floor(
                                                    data?.currentWeather
                                                        ?.thermoStress,
                                                )}
                                            </Text>
                                        </View>
                                        <Text style={styles.data_title}>
                                            {'THI Value'}
                                        </Text>
                                    </View>

                                    {data?.currentWeather?.discomfortLevel && (
                                        <View style={{ gap: 10 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontWeight: '400',
                                                }}
                                            >
                                                Thermal Stress Level
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.alert,
                                                    {
                                                        backgroundColor:
                                                            getBgColor(
                                                                data
                                                                    ?.currentWeather
                                                                    ?.discomfortLevel,
                                                            ),
                                                    },
                                                ]}
                                            >
                                                {
                                                    data?.currentWeather
                                                        ?.discomfortLevel
                                                }
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {data?.currentWeather?.recommendation && (
                                    <>
                                        <View
                                            style={{
                                                borderColor: '#595958',
                                                borderWidth: 0.2,
                                            }}
                                        ></View>

                                        <View style={styles.txt_recommend}>
                                            <Text
                                                style={{
                                                    color: '#1C170D',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                <MIcon
                                                    name={
                                                        'lightbulb-on-outline'
                                                    }
                                                    size={25}
                                                    color={'yellow'}
                                                />
                                                Recommendation
                                            </Text>
                                            <Text style={styles.recommend}>
                                                {
                                                    data?.currentWeather
                                                        ?.recommendation
                                                }
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>
                            <View style={styles.tab__ctr}>
                                {CARDS.map((card, index) => (
                                    <WeatherCard
                                        key={index}
                                        data={{
                                            ...card,
                                            ['value']: Math.floor(
                                                data?.currentWeather?.[
                                                    card.key
                                                ],
                                            ),
                                        }}
                                        style={styles?.card}
                                    />
                                ))}
                            </View>
                        </>
                    )}

                    {selectedTab == TABS.FORECAST && (
                        <View style={styles.tab__ctr}>
                            <View style={styles.f_tabs}>
                                <Text
                                    style={[
                                        styles.f_tab_name,
                                        selectedForecastTab ==
                                        FORECAST_TABS.NEXT_HR
                                            ? styles.f_tab_selected
                                            : {},
                                    ]}
                                    onPress={() =>
                                        setSelectedForecastTab(
                                            FORECAST_TABS.NEXT_HR,
                                        )
                                    }
                                >
                                    Next Hour
                                </Text>
                                <Text
                                    style={[
                                        styles.f_tab_name,
                                        selectedForecastTab ==
                                        FORECAST_TABS.NEXT_DAY
                                            ? styles.f_tab_selected
                                            : {},
                                    ]}
                                    onPress={() =>
                                        setSelectedForecastTab(
                                            FORECAST_TABS.NEXT_DAY,
                                        )
                                    }
                                >
                                    Tomorrow
                                </Text>
                                <Text
                                    style={[
                                        styles.f_tab_name,
                                        selectedForecastTab ==
                                        FORECAST_TABS.NEXT_WK
                                            ? styles.f_tab_selected
                                            : {},
                                    ]}
                                    onPress={() =>
                                        setSelectedForecastTab(
                                            FORECAST_TABS.NEXT_WK,
                                        )
                                    }
                                >
                                    Next week
                                </Text>
                            </View>
                            <View style={[styles.stress_card]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        paddingVertical: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.icon_ctr,
                                                {
                                                    backgroundColor:
                                                        'darkgreen',
                                                },
                                            ]}
                                        >
                                            <Icon
                                                name={'cloud-sun'}
                                                size={22}
                                                color={'white'}
                                            />
                                        </View>
                                        <View style={styles.data_ctr}>
                                            <Text style={styles.data_value}>
                                                {Math.floor(
                                                    forecastData?.thermoStress,
                                                )}
                                            </Text>
                                        </View>
                                        <Text style={styles.data_title}>
                                            {'THI Value'}
                                        </Text>
                                    </View>

                                    {forecastData?.level && (
                                        <View style={{ gap: 10 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontWeight: '400',
                                                }}
                                            >
                                                Thermal Stress Level
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.alert,
                                                    {
                                                        backgroundColor:
                                                            getBgColor(
                                                                forecastData?.level,
                                                            ),
                                                    },
                                                ]}
                                            >
                                                {forecastData?.level}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            {F_CARDS.map((card, index) => (
                                <WeatherCard
                                    key={index}
                                    data={{
                                        ...card,
                                        ['value']: Math.floor(
                                            forecastData?.[card.key],
                                        ),
                                    }}
                                    style={styles?.card}
                                />
                            ))}
                        </View>
                    )}

                    {selectedTab == TABS.HISTORY && (
                        <View
                            style={{
                                ...styles.tab__ctr,
                                ...styles.tab__ctr__history,
                            }}
                        >
                            {graphData?.labels?.length > 0 ? (
                                <>
                                    <View style={styles.history_overview}>
                                        <Text
                                            style={styles.history_overview__txt}
                                        >
                                            Historical Thermal Stress data
                                        </Text>
                                    </View>
                                    <LineChart
                                        data={graphData}
                                        width={graphConfig.width}
                                        height={graphConfig.height}
                                        chartConfig={graphConfig.chartConfig}
                                        style={styles.graph_style}
                                        segments={4}
                                        yAxisInterval={1}
                                        bezier
                                        verticalLabelRotation={22}
                                        getDotProps={() => ({
                                            r: 2,
                                            strokeWidth: 1,
                                            stroke: 'darkgreen',
                                        })}
                                        formatYLabel={value => `${value} THI`}
                                        yLabelsOffset={10}
                                        formatXLabel={value => {
                                            const index =
                                                graphData.labels.indexOf(value);
                                            return index % 2 === 0
                                                ? formatDate(value)
                                                : '';
                                        }}
                                    />
                                    <Text style={styles.graph_label}>Time</Text>
                                </>
                            ) : (
                                <View
                                    style={{
                                        height: 200,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: 17,
                                            marginVertical: 5,
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        No historical records
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {isFetchingLogs && (
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 17,
                                marginVertical: 5,
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            {' '}
                            <ActivityIndicator /> Fetching Current Weather data
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    farm_stress: {
        justifyContent: 'space-between',
    },

    graph_label: {
        color: 'darkgreen',
        fontWeight: 'bold',
        fontSize: 15,
        // marginTop: 10,
        // marginBottom: 10,
        // marginLeft: 10
        alignSelf: 'center',

        // borderColor: 'darkgreen',
        // borderWidth: 0.5,
        // overflow: 'scroll',
        // borderRadius: 10,
    },

    history_overview__txt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'darkgray',
        textAlign: 'center',
        marginVertical: 10,
    },

    graph_style: {
        marginVertical: 20,
        marginHorizontal: 10,
        marginBottom: 30,
        flex: 1,
        overflow: 'scroll',

        // borderColor: 'darkgreen',
        // borderWidth: 0.5,
        // overflow: 'scroll',
        // borderRadius: 10,
        // height: 800,
    },

    history_overview: {
        // flex: 1,
        // marginVertical: 10,
        // marginHorizontal: 10,
    },

    tab__ctr__history: {
        flex: 1,
        // marginVertical: 10,
        marginBottom: 20,
        marginHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        // borderColor: 'darkgreen',
        // borderWidth: 0.5,
        // overflow: "scroll"
        // borderRadius: 10,
    },

    tabs: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 15,
        backgroundColor: '#F5F0E5',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 4,
    },

    f_tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        marginBottom: 5,
        paddingHorizontal: 5,
    },

    tab_name: {
        fontSize: 15,
        color: '#A1824A',
        paddingHorizontal: 30,
        borderRadius: 18,
        paddingVertical: 4,
        fontWeight: '500',
    },

    f_tab_name: {
        fontSize: 15,
        color: '#A1824A',
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 4,
        fontWeight: '500',
        borderRadius: 18,
    },

    tab_selected: {
        color: '#1C170D',
        backgroundColor: 'white',
        fontWeight: '900',
    },

    f_tab_selected: {
        color: '#1C170D',
        fontWeight: '700',
        backgroundColor: '#F5F0E5',
    },

    container: {
        flex: 1,
        backgroundColor: '#11360a',
        overflow: 'scroll',
    },

    loading_ctr: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tab__ctr: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },

    text_dur: {
        color: 'black',
        fontWeight: '700',
    },

    card: {
        width: '45%',
    },

    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    overview: {
        paddingHorizontal: 30,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },

    get_curr_btn: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 7,
    },

    get_data_btn: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
    },

    farm_info: {
        height: '100%',
        width: '65%',
        justifyContent: 'space-between',
    },

    farm_name: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
    },

    farm_loc: {
        color: '#6a8070',
        fontWeight: '700',
        fontSize: 20,
    },

    container__upper: {
        height: '27%',
        paddingVertical: 15,
    },

    container__lower: {
        flex: 1,
        overflow: 'scroll',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    stress_card: {
        width: '100%',
    },

    txt_alert: {
        color: 'black',
    },

    alert: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#F5F0E5',
        borderRadius: 5,
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },

    txt_recommend: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },

    recommend: {
        fontSize: 15,
        fontWeight: '500',
        backgroundColor: '#fff9e6',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10,
        color: '#2b2921',
    },

    stress_card: {
        shadowColor: '',
        shadowOffset: 1,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#dedcdc',
        borderRadius: 10,
        marginBottom: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        width: '90%',
        alignSelf: 'center',
    },

    icon_ctr: {
        borderRadius: 45,
        width: 45,
        height: 45,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },

    data_ctr: {
        flexDirection: 'row',
    },

    data_value: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
    },

    data_symbol: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500',
        alignSelf: 'center',
        color: '#c2c2c2',
    },

    data_title: {
        color: '#c2c2c2',
        fontWeight: '800',
        fontSize: 15,
    },
});

export default ViewFarm;
