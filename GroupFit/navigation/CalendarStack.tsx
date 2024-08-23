// src/navigation/CalendarStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../screens/CalendarScreen";
import DayViewCalendar from "../screens/DayViewCalendar";
import { CalendarStackParamList } from "../types";

const Stack = createNativeStackNavigator<CalendarStackParamList>();

const CalendarStack = ({ routeName }: { routeName?: string }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="DayViewCalendar">
        {(props) => <DayViewCalendar {...props} routeName={routeName} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default CalendarStack;
