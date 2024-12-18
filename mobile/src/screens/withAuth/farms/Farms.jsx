import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import FarmCard from './FarmCard';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/slices/authSlice';
import { useGetFarmsQuery } from '../../../redux/apis/baseApi';
import SearchBar from '../../../components/SearchBar';

const Farms = () => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const { id } = useSelector(selectCurrentUser);

    const {
        data: farms,
        isFetching,
    } = useGetFarmsQuery(id);

    const filteredFarms = useMemo(() => {
        return farms
            ?.filter(farm =>
                farm?.name?.toLowerCase().includes(searchPhrase?.toLowerCase()),
            )
            .sort((a, b) => b?.id - a?.id);
    }, [searchPhrase, farms]);

    return (
        <View style={styles.container}>
            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
            />
            {isFetching ? (
                <View style={styles.container_ctr}>
                    <ActivityIndicator />
                </View>
            ) : filteredFarms?.length > 0 ? (
                <FlatList
                    data={filteredFarms}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={({ item: farm }) => (
                        <FarmCard farmId={farm.id} />
                    )}
                />
            ) : (
                <View style={styles.container_ctr}>
                    <Text style={styles.par__desc}>
                        Ooops, currently no farms
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    container_ctr: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    par__desc: {
        fontSize: 30,
        fontWeight: '500',
        color: 'black',
        width: '70%',
        textAlign: 'center',
    },
});

export default Farms;
