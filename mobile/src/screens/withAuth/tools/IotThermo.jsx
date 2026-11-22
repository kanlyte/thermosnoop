import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    useGetDeviceLogsQuery,
    useSendDeviceCommandMutation,
} from '../../../redux/apis/iotApi';

const POLL_MS = 15000;

// Outputs the app can switch on the device. The firmware must handle
// command 'set_output' with payload { output, state }.
const OUTPUTS = [
    { output: 'fan', label: 'Fan' },
    { output: 'sprinkler', label: 'Sprinkler' },
    { output: 'cooler', label: 'Cooler' },
];

const isOn = value => Boolean(value) && value !== 0;

const formatTime = value => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
};

const IotThermo = () => {
    const [deviceId, setDeviceId] = useState('');
    const [activeId, setActiveId] = useState('');

    const {
        data: logs = [],
        isFetching,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetDeviceLogsQuery(
        { deviceId: activeId, limit: 30 },
        { skip: !activeId, pollingInterval: POLL_MS },
    );

    const [sendCommand, { isLoading: isSending }] =
        useSendDeviceCommandMutation();

    const latest = logs[0];

    const handleCommand = async (output, state) => {
        const result = await sendCommand({
            deviceId: activeId,
            command: 'set_output',
            payload: { output, state },
        });
        if (result?.error) {
            Alert.alert('Command failed', String(result.error.data));
        } else {
            Alert.alert('Queued', `${output} ${state} sent to the device.`);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={isFetching && !isLoading}
                    onRefresh={() => activeId && refetch()}
                />
            }
        >
            <Text style={styles.header}>IoT Thermo</Text>
            <Text style={styles.header__sup}>
                Live readings and controls for your thermo device
            </Text>

            <Text style={styles.input__label}>Device ID</Text>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.flex]}
                    placeholder="e.g. FARM-001"
                    placeholderTextColor={'#c5ccc4'}
                    autoCapitalize="characters"
                    value={deviceId}
                    onChangeText={setDeviceId}
                />
                <TouchableOpacity
                    style={styles.connectBtn}
                    onPress={() => setActiveId(deviceId.trim())}
                    disabled={!deviceId.trim()}
                >
                    <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>
            </View>

            {!activeId && (
                <Text style={styles.hint}>
                    Enter the device ID printed on your thermo to see its
                    readings.
                </Text>
            )}

            {activeId && isLoading && (
                <ActivityIndicator color="darkgreen" style={{ marginTop: 20 }} />
            )}

            {activeId && isError && (
                <Text style={styles.error}>
                    {String(error?.data || 'Could not load device data')}
                </Text>
            )}

            {activeId && !isLoading && !isError && !latest && (
                <Text style={styles.hint}>
                    No readings yet for {activeId}.
                </Text>
            )}

            {latest && (
                <>
                    <View style={styles.card}>
                        <Text style={styles.card__title}>Latest reading</Text>
                        <View style={styles.stats}>
                            <Stat label="Temp" value={`${latest.temp ?? '-'}°C`} />
                            <Stat label="Humidity" value={`${latest.humidity ?? '-'}%`} />
                            <Stat label="THI" value={latest.thi ?? '-'} />
                        </View>
                        <Text style={styles.meta}>
                            Status: {latest.thi_status || '-'}
                        </Text>
                        <Text style={styles.meta}>
                            Last seen: {formatTime(latest.createdAt)}
                        </Text>
                        <Text style={styles.meta}>
                            WiFi signal: {latest.wifi_signal ?? '-'} dBm
                        </Text>
                        <View style={styles.outputs}>
                            <OutputBadge label="Cooler" on={isOn(latest.out_cooler)} />
                            <OutputBadge label="Fan" on={isOn(latest.out_fan_speed)} />
                            <OutputBadge label="Heater" on={isOn(latest.out_heater)} />
                            <OutputBadge label="Humidifier" on={isOn(latest.out_humidifier)} />
                            <OutputBadge label="Sprinkler" on={isOn(latest.out_sprinkler)} />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.card__title}>Controls</Text>
                        {OUTPUTS.map(item => (
                            <View key={item.output} style={styles.controlRow}>
                                <Text style={styles.controlLabel}>{item.label}</Text>
                                <TouchableOpacity
                                    style={[styles.smallBtn, { backgroundColor: 'darkgreen' }]}
                                    disabled={isSending}
                                    onPress={() => handleCommand(item.output, 'on')}
                                >
                                    <Text style={styles.buttonText}>On</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.smallBtn, { backgroundColor: '#99352e' }]}
                                    disabled={isSending}
                                    onPress={() => handleCommand(item.output, 'off')}
                                >
                                    <Text style={styles.buttonText}>Off</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.card__title}>Recent readings</Text>
                        {logs.map(log => (
                            <View key={log.id} style={styles.logRow}>
                                <Text style={styles.logTime}>{formatTime(log.createdAt)}</Text>
                                <Text style={styles.logValue}>
                                    {log.temp ?? '-'}°C · {log.humidity ?? '-'}%
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const Stat = ({ label, value }) => (
    <View style={styles.stat}>
        <Text style={styles.stat__value}>{value}</Text>
        <Text style={styles.stat__label}>{label}</Text>
    </View>
);

const OutputBadge = ({ label, on }) => (
    <View style={[styles.badge, { backgroundColor: on ? 'darkgreen' : '#EDEDED' }]}>
        <Text style={[styles.badge__text, { color: on ? 'white' : '#666' }]}>
            {label}: {on ? 'ON' : 'OFF'}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    header__sup: {
        marginBottom: 25,
        fontSize: 16,
        color: 'gray',
        fontWeight: '600',
    },
    input__label: {
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    flex: {
        flex: 1,
    },
    input: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ebf2ed',
        borderRadius: 5,
        color: 'black',
    },
    connectBtn: {
        backgroundColor: 'darkgreen',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
    },
    hint: {
        color: 'gray',
        marginTop: 10,
    },
    error: {
        color: '#99352e',
        marginTop: 10,
    },
    card: {
        borderWidth: 1,
        borderColor: '#dedcdc',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
    },
    card__title: {
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        marginBottom: 12,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    stat__value: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black',
    },
    stat__label: {
        color: '#888',
        fontWeight: '600',
    },
    meta: {
        color: '#444',
        marginBottom: 4,
    },
    outputs: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    badge__text: {
        fontSize: 12,
        fontWeight: '600',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    controlLabel: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },
    smallBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 5,
    },
    logRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    logTime: {
        color: '#666',
        flex: 1,
        marginRight: 8,
    },
    logValue: {
        color: 'black',
        fontWeight: '600',
    },
});

export default IotThermo;
