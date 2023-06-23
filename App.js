import React, { useState, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import CalculateScreen from "./screens/CalculateScreen";
import ServiceZonesScreen from "./screens/ServiceZonesScreen";
import SavedCalculationsScreen from "./screens/SavedCalculationScreen";
import { auth } from "./config/firebase";
import { AuthUserContext, AuthUserProvider } from "./AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
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
