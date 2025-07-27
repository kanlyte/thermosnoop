import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Define your base URL
    timeout: 9000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default axiosInstance;