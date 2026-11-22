import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosIot } from '../../services/axiosService';

const LOGS_TAG = 'iot_logs';

// Talks to the IoT thermo server (separate from the farm API in baseApi.js)
export const iotApi = createApi({
    reducerPath: 'iotApi',
    baseQuery: async config => {
        try {
            const response = await axiosIot(config);
            return { data: response.data };
        } catch (error) {
            const body = error?.response?.data;
            return {
                error: {
                    status: error?.response?.status,
                    data:
                        body?.data ??
                        body?.message ??
                        'Could not reach the IoT server',
                    isNetworkError: !error?.response,
                },
            };
        }
    },
    tagTypes: [LOGS_TAG],
    endpoints: build => ({
        // newest readings first
        getDeviceLogs: build.query({
            query: ({ deviceId, limit = 30 }) => ({
                url: `/iot/logs/${encodeURIComponent(deviceId)}`,
                method: 'GET',
                params: { limit },
            }),
            transformResponse: response => response?.result ?? [],
            providesTags: (_, __, args) => [{ type: LOGS_TAG, id: args.deviceId }],
        }),

        // queue a command, e.g. { command: 'set_output', payload: { output: 'fan', state: 'on' } }
        sendDeviceCommand: build.mutation({
            query: ({ deviceId, command, payload }) => ({
                url: '/iot/command',
                method: 'POST',
                data: { device_id: deviceId, command, payload },
            }),
            transformResponse: response => response?.result,
        }),
    }),
});

export const { useGetDeviceLogsQuery, useSendDeviceCommandMutation } = iotApi;
