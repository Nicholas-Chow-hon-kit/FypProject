import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import SignUpSettings from "../screens/signUpSettings"; // Import SignUpSettings screen
import { RootStackParamList } from "../types";
import { Session } from "@supabase/supabase-js";

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppNavigatorProps = {
  session: Session;
  profileComplete: boolean | null;
};

const AppNavigator = ({ session, profileComplete }: AppNavigatorProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={profileComplete ? "HomeTabs" : "SignUpSettings"}>
        <Stack.Screen name="HomeTabs">
          {(props) => <TabNavigator {...props} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="SignUpSettings">
          {(props) => <SignUpSettings {...props} session={session} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
