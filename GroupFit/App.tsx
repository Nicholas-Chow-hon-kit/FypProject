import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./contexts/AuthProvider";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./screens/Auth";
import TabNavigator from "./navigation/TabNavigator";
import TaskFormScreen from "./screens/TaskFormScreen";
import ProfileSetup from "./screens/ProfileSetup";
import { RootStackParamList } from "./types";
import { TaskProvider } from "./contexts/TaskProvider";
import UpdateFormScreen from "./screens/UpdateFormScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const ref = createNavigationContainerRef();

export default function App() {
  const [routeName, setRouteName] = useState<string | undefined>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={ref}
        onReady={() => {
          setRouteName(ref.getCurrentRoute()?.name);
        }}
        onStateChange={async () => {
          const currentRouteName = ref.getCurrentRoute()?.name;
          setRouteName(currentRouteName);
        }}>
        <AuthProvider>
          <TaskProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={Auth} />
              <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
              <Stack.Screen name="HomeTabs">
                {(props) => <TabNavigator {...props} routeName={routeName} />}
              </Stack.Screen>
              <Stack.Screen name="TaskForm">
                {(props) => <TaskFormScreen {...props} routeName={routeName} />}
              </Stack.Screen>
              <Stack.Screen name="UpdateForm">
                {(props) => (
                  <UpdateFormScreen {...props} routeName={routeName} />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </TaskProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
