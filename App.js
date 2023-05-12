import { createContext, useState, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import CalculateScreen from "./screens/CalculateScreen";
import ServiceZonesScreen from "./screens/ServiceZonesScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const AuthUserContext = createContext();

const AuthUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator defaultScreenOptions={LoginScreen}>
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
      <Tab.Screen name="Просчет" component={CalculateScreen} />
      <Tab.Screen name="Сервис" component={ServiceZonesScreen} />
      <Tab.Screen name="Архив" component={DetailsScreen} />
      <Tab.Screen name="Ещё" component={DetailsScreen} />
    </Tab.Navigator>
  );
}
export default function App() {
  const { user, setUser } = useContext(AuthUserContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthUserProvider>
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthUserProvider>
  );
}
