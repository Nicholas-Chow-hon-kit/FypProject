import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunitiesScreen from "../screens/CommunitiesScreen";
import FriendRequestsScreen from "../screens/FriendRequestsScreen";
import FriendSelectionScreen from "../screens/FriendSelectionScreen";
import AddFriendsScreen from "../screens/AddFriendsScreen";
import GroupCalendarScreen from "../screens/GroupCalendarScreen";
import GroupDayViewCalendar from "../screens/GroupDayViewCalendar";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import GroupNameChangeScreen from "../screens/GroupNameChangeScreen";
import AddMembersScreen from "../screens/AddMembers"; // Import the AddMembersScreen
import { CommunitiesStackParamList } from "../types";

const Stack = createNativeStackNavigator<CommunitiesStackParamList>();

const CommunitiesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunitiesScreen" component={CommunitiesScreen} />
      <Stack.Screen name="FriendRequests">
        {(props) => (
          <FriendRequestsScreen {...props} routeName="Friend Requests" />
        )}
      </Stack.Screen>
      <Stack.Screen name="FriendSelection">
        {(props) => (
          <FriendSelectionScreen {...props} routeName="FriendSelection" />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddFriends">
        {(props) => <AddFriendsScreen {...props} routeName="Add Friends" />}
      </Stack.Screen>
      <Stack.Screen name="GroupCalendarScreen">
        {(props) => (
          <GroupCalendarScreen {...props} routeName="GroupCalendarScreen" />
        )}
      </Stack.Screen>
      <Stack.Screen name="GroupDayViewCalendar">
        {(props) => (
          <GroupDayViewCalendar {...props} routeName="GroupDayViewCalendar" />
        )}
      </Stack.Screen>
      <Stack.Screen name="GroupDetails">
        {(props) => <GroupDetailsScreen {...props} routeName="GroupDetails" />}
      </Stack.Screen>
      <Stack.Screen name="GroupNameChange">
        {(props) => (
          <GroupNameChangeScreen {...props} routeName="GroupNameChange" />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddMembers">
        {(props) => <AddMembersScreen {...props} routeName="AddMembers" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default CommunitiesStack;
