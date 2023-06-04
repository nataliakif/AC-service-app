import React, { createContext, useState, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Импортируйте AsyncStorage

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import CalculateScreen from "./screens/CalculateScreen";
import ServiceZonesScreen from "./screens/ServiceZonesScreen";
import SavedCalculationsScreen from "./screens/SavedCalculationScreen";
import { auth } from "./config/firebase";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthUserContext = createContext();

const AuthUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // При загрузке приложения получаем информацию о пользователе из AsyncStorage
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(userData);
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (user) => {
    // При успешной авторизации сохраняем информацию о пользователе в AsyncStorage
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    // При выходе из учетной записи удаляем информацию о пользователе из AsyncStorage
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthUserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthUserContext.Provider>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Логин" component={LoginScreen} />
      <Stack.Screen name="Регистрация" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Просчет":
              iconName = focused ? "calculator" : "calculator-outline";
              break;
            case "В работе":
              iconName = focused ? "reorder-four" : "reorder-four-outline";
              break;
            case "Сервис":
              iconName = focused ? "brush" : "brush-outline";
              break;
            case "Архив":
              iconName = focused ? "save" : "save-outline";
              break;
            case "Ещё":
              iconName = focused
                ? "ellipsis-horizontal"
                : "ellipsis-horizontal-outline";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#DB5000",
      })}
    >
      <Tab.Screen name="В работе" component={HomeScreen} />
      <Tab.Screen
        name="Просчет"
        component={CalculateScreen}
        options={{ unmountOnBlur: true, tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen name="Сервис" component={ServiceZonesScreen} />
      <Tab.Screen name="Архив" component={SavedCalculationsScreen} />
      <Tab.Screen name="Ещё" component={DetailsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, handleLogin } = useContext(AuthUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authenticatedUser) => {
      if (authenticatedUser) {
        handleLogin(authenticatedUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthUserProvider>
      <RootNavigator />
    </AuthUserProvider>
  );
}
