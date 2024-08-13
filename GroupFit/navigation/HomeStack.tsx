// HomeStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TaskFormScreen from "../screens/TaskFormScreen";
import { Session } from "@supabase/supabase-js";
import { isHomeStackRoute } from "../typeGuards"; // Adjust the import path as necessary
import {
  HomeStackParamList,
  CalendarStackParamList,
  CommunitiesStackParamList,
} from "../types";
import { RouteProp } from "@react-navigation/native";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = ({ session }: { session: Session }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen">
        {(props) => <HomeScreen {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="TaskFormScreen">
        {(props) => {
          const { route, navigation } = props;

          let typedRoute:
            | RouteProp<HomeStackParamList, "TaskFormScreen">
            | RouteProp<CalendarStackParamList, "TaskFormScreen">
            | RouteProp<CommunitiesStackParamList, "TaskFormScreen">;

          if (isHomeStackRoute(route)) {
            typedRoute = route;
          } else {
            throw new Error("Invalid route type");
          }

          return (
            <TaskFormScreen
              {...props}
              session={session}
              route={typedRoute}
              navigation={navigation}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeStack;
