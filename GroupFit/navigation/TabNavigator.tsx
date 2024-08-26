// src/navigation/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import CalendarStack from "./CalendarStack";
import CommunitiesStack from "./CommunitiesStack";
import SettingsStack from "./SettingsStack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

type IconName = keyof typeof Ionicons.glyphMap;

const TabNavigator = ({ routeName }: { routeName?: string }) => {
  const hideTabBar =
    routeName === "DayViewCalendar" ||
    routeName === "TaskForm" ||
    routeName === "UpdateForm" ||
    routeName === "FriendRequests" ||
    routeName === "FriendSelection" ||
    routeName === "AddFriends" ||
    routeName === "GroupCalendarScreen";

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
            // Default icon name if route name doesn't match
            iconName = "close-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarStyle: { display: hideTabBar ? "none" : "flex" },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          tabBarLabel: "Calendar",
          headerShown: false,
        }}
        initialParams={{ routeName }}
      />
      <Tab.Screen
        name="Communities"
        component={CommunitiesStack}
        options={{
          tabBarLabel: "Communities",
          headerShown: false,
        }}
        initialParams={{ routeName }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
