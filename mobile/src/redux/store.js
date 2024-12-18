import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { PERSIST, REGISTER, persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseAPI } from './apis/baseApi';

const rootReducer = combineReducers({
    auth: authReducer,
    [baseAPI.reducerPath]: baseAPI.reducer
});

const persistedReducer = persistReducer(
    { key: 'root', storage: AsyncStorage },
    rootReducer,
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }).concat(baseAPI.middleware)
});

export const persistor = persistStore(store);


export const clearPersistedState = () => {
    persistor.purge()
}