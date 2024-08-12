import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen"; // Adjust the path as necessary
import Account from "../screens/Account";
import { Session } from "@supabase/supabase-js";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Account: { session: Session };
};

const SettingsStack = ({ session }: { session: Session }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain">
        {(props) => <SettingsScreen {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="Account">
        {(props) => <Account {...props} session={session} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default SettingsStack;
