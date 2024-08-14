import React from "react";
import { AuthProvider } from "./contexts/AuthProvider"; // Adjust the path
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./screens/Auth";
import TabNavigator from "./navigation/TabNavigator";
import TaskFormScreen from "./screens/TaskFormScreen";
import { RootStackParamList } from "./types"; // Adjust the path

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="HomeTabs" component={TabNavigator} />
          <Stack.Screen name="TaskForm" component={TaskFormScreen} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
