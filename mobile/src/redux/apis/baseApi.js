import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosPrivate } from '../../services/axiosService';

const TAGS = 'farms';
const WEATHER_TAG = 'weather_tag';
const HISTORICAL_WEATHER_TAG = 'historical_weather_tag';

export const baseAPI = createApi({
    baseQuery: async config => {
        try {
            const response = await axiosPrivate(config);
            return { data: response };
        } catch (error) {
            return {
                error: {
                    status: error?.response?.status,
                    data: error?.response?.data?.data,
                },
            };
        }
    },
    tagTypes: [TAGS, WEATHER_TAG, HISTORICAL_WEATHER_TAG],
    endpoints: build => ({
        getFarms: build.query({
            query: userId => ({
                url: `/myfarms/${userId}`,
                method: 'get',
                params: {},
            }),
            transformResponse: response => {
                return response?.data?.result;
            },
            providesTags: [TAGS],
        }),

        getFarm: build.query({
            query: farmId => ({
                url: `farm/${farmId}`,
                method: 'get',
                params: {},
            }),
            transformResponse: response => {
                return response?.data?.result;
            },
        }),

        getFarmLogs: build.query({
            query: farmId => ({
                url: `/farmlogs/${farmId}`,
                method: 'GET',
                params: {},
            }),
            transformResponse: response => {
                return response?.data?.result;
            },
            providesTags: (_, __, args) => {
                return [{ type: WEATHER_TAG, id: args }];
            },
        }),

        addFarm: build.mutation({
            query: farmData => ({
                url: '/farm',
                method: 'POST',
                data: farmData,
            }),
            transformResponse: response => {
                return response?.data?.farm;
            },
            invalidatesTags: [TAGS],
        }),

        addWeatherLog: build.mutation({
            query: data => ({
                url: 'weather/check',
                method: 'POST',
                data,
            }),
            transformResponse: response => {
                return response?.data?.result;
            },
            invalidatesTags: (_, __, args) => {
                return [
                    { type: WEATHER_TAG, id: args?.farm_id },
                ];
            },
        }),

        updateFarm: build.mutation({
            query: (farmId, data) => ({
                url: `/update/farm/${farmId}`,
                method: 'POST',
                data,
            }),
            invalidatesTags: [TAGS],
        }),

        deleteFarm: build.mutation({
            query: farmId => ({
                url: `delete/farm/${farmId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [TAGS],
        }),

        checkThermalStress: build.mutation({
            query: data => ({
                url: 'weather/check/guest',
                method: 'POST',
                data,
            }),
            transformResponse: response => {
                return response?.data?.result;
            },
        }),

        getHistoricalWeather: build.query({
            query: farmId => ({
                url: `farmlogs/last7days/${farmId}`,
                method: 'GET',
            }),
            providesTags: (_, __, args) => {
                return [{ type: HISTORICAL_WEATHER_TAG, id: args }];
            },
            transformResponse: response => {
                return response?.data?.result;
            },
            transformErrorResponse: response => {
                return response?.data?.result;
            },
        }),
    }),
});

export const {
    useGetFarmsQuery,
    useGetFarmQuery,
    useGetFarmLogsQuery,
    useAddFarmMutation,
    useAddWeatherLogMutation,
    useDeleteFarmMutation,
    useCheckThermalStressMutation,
    useGetHistoricalWeatherQuery,
} = baseAPI;
