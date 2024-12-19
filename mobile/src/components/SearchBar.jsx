import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import FIcon from 'react-native-vector-icons/Feather'
import { TouchableOpacity } from '@gorhom/bottom-sheet'

const SearchBar = ({ searchPhrase, setSearchPhrase }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.searchIcon_container}>
                <FIcon style={styles.searchIcon} name={"search"} size={25} color={"#A1824A"} />
            </TouchableOpacity>
            <TextInput style={styles.input}
                placeholder="Search..."
                placeholderTextColor={'#A1824A'}
                autoCapitalize="none"
                value={searchPhrase}
                onChangeText={text => setSearchPhrase(text)}
            />
            {
                searchPhrase != "" &&
                <TouchableOpacity
                    style={styles.searchIcon_container}
                    onPress={() => setSearchPhrase("")}
                >
                    <FIcon style={styles.searchIcon} name={"x"} size={25} color={"#A1824A"} />
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 3,
        backgroundColor: "#F5F0E5",
        flexDirection: 'row',
        alignSelf: "flex-end",
        borderColor: "white",
        borderWidth: 0.5,
        marginVertical: 10,
        borderRadius: 25,
        marginHorizontal: 12
    },

    input: {
        fontSize: 17,
        paddingHorizontal: 15,
        color: 'black',
        textDecorationLine: 'none',
        flex: 1,
    },

    searchIcon_container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center"
    },
})

export default SearchBar