import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegistrationScreen from "./screens/RegistrationScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import CalculateScreen from "./screens/CalculateScreen";
import ServiceZonesScreen from "./screens/ServiceZonesScreen";

import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export default function App() {
  const isLogin = Math.random() < 0.5;
  return (
    <NavigationContainer>
     
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
    </NavigationContainer>
  );
}
