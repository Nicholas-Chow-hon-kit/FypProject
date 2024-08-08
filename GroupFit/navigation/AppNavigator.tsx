import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import TaskFormScreen from "../screens/TaskFormScreen";
import { RootStackParamList } from "../types";
import { Session } from "@supabase/supabase-js";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = ({ session }: { session: Session }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs">
          {(props) => <TabNavigator {...props} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="TaskForm" component={TaskFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
