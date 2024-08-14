import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen"; // Adjust the path as necessary
import Account from "../screens/Account";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Account: undefined;
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
