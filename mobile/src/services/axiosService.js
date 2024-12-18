import axios from 'axios';
import { getAccessToken } from '../utils/basicUtil';
import { API_URL as BASE_URL } from '@env';

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
});

axiosPublic.interceptors.request.use(
    config => {
        const requestId = Math.floor(Math.random * 10000 + 1);
        config.headers['Request-ID'] = `pub-${requestId}`;
        config.headers['ngrok-skip-browser-warning'] = `dev`;
        return config;
    },
    error => Promise.reject(error),
);

axiosPrivate.interceptors.request.use(
    async config => {
        console.debug('REQ: ' + config?.method + ' ' + config?.url + ' ');
        config.headers['Authorization'] = `Bearer ${await getAccessToken()}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

axiosPrivate.interceptors.response.use(
    response => {
        return Promise.resolve(response);
    },
    error => {
        return Promise.reject(error);
    },
);
