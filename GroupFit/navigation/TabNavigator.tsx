import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import CalendarStack from "./CalendarStack";
import CommunitiesStack from "./CommunitiesStack";
import SettingsStack from "./SettingsStack";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";

const Tab = createBottomTabNavigator();

type IconName = keyof typeof Ionicons.glyphMap;

const TabNavigator = ({ session }: { session: Session }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: IconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Calendar") {
            iconName = "calendar";
          } else if (route.name === "Communities") {
            iconName = "person";
          } else if (route.name === "Settings") {
            iconName = "settings";
          } else {
            iconName = "close-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Home">
        {(props) => <HomeStack {...props} session={session} />}
      </Tab.Screen>
      <Tab.Screen name="Calendar">
        {(props) => <CalendarStack {...props} session={session} />}
      </Tab.Screen>
      <Tab.Screen name="Communities">
        {(props) => <CommunitiesStack {...props} session={session} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsStack {...props} session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
