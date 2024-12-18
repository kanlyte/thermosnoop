import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAccessToken = async () => {
    return await getItemAsyncStorage(KEYS.ACCESS_TOKEN);
};

export const formatToSentenceCase = _sentence => {
    if (_sentence) {
        const sentence = _sentence.trim();
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    return _sentence
};


export const KEYS = {
    'ACCESS_TOKEN': 'access_token',
    'REFRESH_TOKEN': 'refresh_token'
}

export const saveItemAsyncStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.debug(`Error: saving ${key} - ${value}`)
    }
}

export const getItemAsyncStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value != null) {
            return JSON.parse(value)
        }
        return null
    } catch (error) {
        console.debug(`Error: fetching item ${key}`)
        return null
    }
}

export function convertTime(inputTime) {
    const date = new Date(inputTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = hours % 12 || 12;

    return `${year}-${month}-${day} ${twelveHourFormat}:${minutes} ${period}`;
}

export const convertGraphTime = (time) => {
    const date = new Date(time);
    // const day = date.getDate();
    // const month = date.getMonth() + 1;
    const _hours = date.getHours();
    const hours = _hours > 12 ? _hours - 12 : _hours;
    const period = _hours >= 12 ? 'PM' : 'AM';
    const minutes = date.getMinutes();

    return `${hours}:${minutes} ${period}`;
}