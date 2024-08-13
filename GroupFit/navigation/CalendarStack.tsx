// CalendarStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../screens/CalendarScreen";
import TaskFormScreen from "../screens/TaskFormScreen";
import { Session } from "@supabase/supabase-js";
import { isCalendarStackRoute } from "../typeGuards"; // Adjust the import path as necessary
import {
  CalendarStackParamList,
  RootStackParamList,
  HomeStackParamList,
  CommunitiesStackParamList,
} from "../types";
import { RouteProp } from "@react-navigation/native";

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarStack = ({ session }: { session: Session }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarScreen">
        {(props) => <CalendarScreen {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="TaskFormScreen">
        {(props) => {
          const { route, navigation } = props;

          let typedRoute:
            | RouteProp<HomeStackParamList, "TaskFormScreen">
            | RouteProp<CalendarStackParamList, "TaskFormScreen">
            | RouteProp<CommunitiesStackParamList, "TaskFormScreen">;

          if (isCalendarStackRoute(route)) {
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

export default CalendarStack;
