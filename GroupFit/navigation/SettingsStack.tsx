import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen"; // Adjust the path as necessary
import { Session } from "@supabase/supabase-js";

const Stack = createNativeStackNavigator();

const SettingsStack = ({ session }: { session: Session }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain">
        {(props) => <SettingsScreen {...props} session={session} />}
      </Stack.Screen>
      {/* Add other screens here if needed */}
    </Stack.Navigator>
  );
};

export default SettingsStack;
