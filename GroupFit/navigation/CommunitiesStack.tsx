import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunitiesScreen from "../screens/CommunitiesScreen";
import FriendRequestsScreen from "../screens/FriendRequestsScreen";
import FriendSelectionScreen from "../screens/FriendSelectionScreen";
import AddFriendsScreen from "../screens/AddFriendsScreen";
import { CommunitiesStackParamList } from "../types";

const Stack = createNativeStackNavigator<CommunitiesStackParamList>();

const CommunitiesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunitiesScreen" component={CommunitiesScreen} />
      <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
      <Stack.Screen name="FriendSelection" component={FriendSelectionScreen} />
      <Stack.Screen name="AddFriends" component={AddFriendsScreen} />
    </Stack.Navigator>
  );
};

export default CommunitiesStack;
