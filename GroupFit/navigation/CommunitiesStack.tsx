// CommunitiesStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunitiesScreen from "../screens/CommunitiesScreen";
import TaskFormScreen from "../screens/TaskFormScreen";
import { Session } from "@supabase/supabase-js";
import { isCommunitiesStackRoute } from "../typeGuards";
import {
  CalendarStackParamList,
  CommunitiesStackParamList,
  HomeStackParamList,
} from "../types";
import { RouteProp } from "@react-navigation/native";

const Stack = createNativeStackNavigator<CommunitiesStackParamList>();

const CommunitiesStack = ({ session }: { session: Session }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunitiesScreen">
        {(props) => <CommunitiesScreen {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="TaskFormScreen">
        {(props) => {
          const { route, navigation } = props;

          let typedRoute:
            | RouteProp<HomeStackParamList, "TaskFormScreen">
            | RouteProp<CalendarStackParamList, "TaskFormScreen">
            | RouteProp<CommunitiesStackParamList, "TaskFormScreen">;

          if (isCommunitiesStackRoute(route)) {
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

export default CommunitiesStack;
