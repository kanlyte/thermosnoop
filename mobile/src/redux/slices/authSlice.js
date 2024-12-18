import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
    isAuthenticated: false,
    user: null,
    loggedIn: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        _signIn: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },

        _signOut: state => {
            Object.assign(state, INITIAL_STATE);
        },
    },
});

export const selectAuth = state => state.auth.isAuthenticated;
export const selectCurrentUser = state => state.auth.user;

export const { _signIn, _signOut } = authSlice.actions;
export default authSlice.reducer;
