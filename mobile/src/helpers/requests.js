import { axiosPrivate } from "../services/axiosService";
import { KEYS, getItemAsyncStorage } from "../utils/basicUtil"

export const getCurrentWeather = async (id, lat, lon) => {
    const refreshToken = await getItemAsyncStorage(KEYS.REFRESH_TOKEN);
    try {
        const response = await axiosPrivate({
            url: "weather/check",
            method: "POST",
            data: {
                lat,
                lon,
                farm_id: id,
                refreshToken
            }
        })

        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
}