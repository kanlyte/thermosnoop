import { clearPersistedState } from '../redux/store';
import { axiosPublic } from './axiosService';

export const createAccount = data => {
    return axiosPublic({
        url: '/account',
        method: 'post',
        data,
    });
};

/**
 *
 * @param {*} data
 *
 * @returns {Promise}
 */
export const signIn = data => {
    return axiosPublic({
        url: '/login',
        method: 'post',
        data,
    });
};

export const signOut = () => {
    clearPersistedState()
};
