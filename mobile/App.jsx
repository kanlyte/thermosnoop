/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    ADD_FARM,
    EDIT_FARM,
    FARMS,
    FORGOT_PASSWD,
    HOME,
    NOTIFICATIONS,
    PROFILE,
    REGISTER,
    SETTINGS,
    SIGN_IN,
    SIGN_OUT,
    SUPPORT,
    THERMAL_STRESS_CALCULATOR,
    TOOLS,
    VIEW_FARM,
    WELCOME,
} from './src/screens/screens';
import SignIn from './src/screens/withoutAuth/SignIn';
import Register from './src/screens/withoutAuth/Register';
import ForgotPasswd from './src/screens/withoutAuth/ForgotPasswd';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './src/screens/withAuth/profile/Profile';
import Settings from './src/screens/withAuth/settings/Settings';
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { selectAuth } from './src/redux/slices/authSlice';
import { PersistGate } from 'redux-persist/integration/react';
import Header, { BasicHeader } from './src/components/Header';

import IoIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddFarm from './src/screens/withAuth/farms/AddFarm';
import EditFarm from './src/screens/withAuth/farms/EditFarm';
import ViewFarm from './src/screens/withAuth/farms/ViewFarm';
import SplashScreen from 'react-native-splash-screen';
import Home from './src/screens/withAuth/home/Home';
import Welcome from './src/screens/withoutAuth/Welcome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Support from './src/screens/withAuth/support/Support';
import Tools from './src/screens/withAuth/tools/Tools';
import ThermalStressCalculator from './src/screens/withAuth/tools/ThermalStressCalculator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = () => {
    return (
        <Tab.Navigator
            initialRouteName={`_${FARMS}`}
            screenOptions={{
                tabBarHideOnKeyboard: true,
                headerShadowVisible: false,
                header: () => <Header />,
                tabBarActiveTintColor: 'darkgreen',
                tabBarInactiveTintColor: '#A1824A',
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 10,
                },
            }}
        >
            <Tab.Screen
                name={`_${FARMS}`}
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <IoIcon name="home" size={25} color={'darkgreen'} />
                        ) : (
                            <IoIcon
                                name="home-outline"
                                size={25}
                                color={'#A1824A'}
                            />
                        );
                    },
                }}
            />

            <Tab.Screen
                name={TOOLS}
                component={Tools}
                options={{
                    tabBarLabel: 'Tools',
                    header: () => <BasicHeader title="Tools" />,
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <MIcon name="tools" size={25} color={'darkgreen'} />
                        ) : (
                            <MIcon name="tools" size={25} color={'#A1824A'} />
                        );
                    },
                }}
            />

            <Tab.Screen
                name={SETTINGS}
                component={Settings}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <IoIcon
                                name="settings-sharp"
                                size={25}
                                color={'darkgreen'}
                            />
                        ) : (
                            <IoIcon
                                name="settings-outline"
                                size={25}
                                color={'#A1824A'}
                            />
                        );
                    },
                }}
            />

            {/* <Tab.Screen
                name={NOTIFICATIONS}
                component={Notifications}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <IoIcon
                                name="notifications-sharp"
                                size={25}
                                color={'darkgreen'}
                            />
                        ) : (
                            <IoIcon
                                name="notifications-outline"
                                size={25}
                                color={'#A1824A'}
                            />
                        );
                    },
                }}
            /> */}
        </Tab.Navigator>
    );
};

const WithAuthStack = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);
    return (
        <Stack.Navigator
            initialRouteName={`_${HOME}`}
            screenOptions={{ headerShadowVisible: false }}
        >
            <Stack.Screen
                name={`_${HOME}`}
                component={HomeTab}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={PROFILE}
                component={Profile}
                options={{
                    title: 'My Account',
                    headerTransparent: true,
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen name={SETTINGS} component={Settings} />
            <Stack.Screen
                name={SUPPORT}
                component={Support}
                options={{
                    headerTitleAlign: 'center',
                }}
            />

            {/* TOOLS */}
            <Stack.Screen
                name={THERMAL_STRESS_CALCULATOR}
                component={ThermalStressCalculator}
                options={{
                    headerTitle: '',
                }}
            />

            {/* TODO: Failed to get correct navigation strategy hence screens here */}

            <Stack.Screen name={ADD_FARM} component={AddFarm} />
            <Stack.Screen name={EDIT_FARM} component={EditFarm} />
            <Stack.Screen
                name={VIEW_FARM}
                component={ViewFarm}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

const withoutAuthStack = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);
    return (
        <Stack.Navigator
            initialRouteName={WELCOME}
            screenOptions={{ headerTitle: '', headerShadowVisible: false }}
        >
            <Stack.Screen
                name={WELCOME}
                component={Welcome}
                options={{ headerShown: false }}
            />
            <Stack.Screen name={SIGN_IN} component={SignIn} />
            <Stack.Screen name={REGISTER} component={Register} />
            <Stack.Screen name={FORGOT_PASSWD} component={ForgotPasswd} />
        </Stack.Navigator>
    );
};

const LandingStack = () => {
    const isAuth = useSelector(selectAuth);
    return isAuth ? WithAuthStack() : withoutAuthStack();
};

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <Provider store={store}>
                    <PersistGate persistor={persistor} loading={null}>
                        <NavigationContainer>
                            <LandingStack />
                        </NavigationContainer>
                    </PersistGate>
                </Provider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

export default App;
