import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { _signIn, _signOut } from '../../redux/slices/authSlice';
import { clearPersistedState } from '../../redux/store';

export const useAuth = () => {
    const dispatch = useDispatch();

    const signIn = useCallback(async userCreds => {
        try {
            dispatch(_signIn(userCreds.username)); //TODO: requires change
        } catch (error) {
            throw error;
        }
    }, []);

    const signOut = useCallback(async userCreds => {
        try {
            clearPersistedState()
            dispatch(_signOut());
        } catch (error) {
            throw error;
        }
    }, []);

    return { signIn, signOut };
};

