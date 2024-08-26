import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  CommunitiesStackParamList,
  RootStackParamList,
  CalendarStackParamList,
} from "../types";
import { supabase } from "../lib/supabase";
import { RouteProp } from "@react-navigation/native";
import { useTasks } from "../contexts/TaskProvider";
import GridCalendar from "../components/GridCalendar";

type GroupCalendarScreenNavigationProp = NativeStackNavigationProp<
  CommunitiesStackParamList,
  "GroupCalendarScreen"
>;

type GroupCalendarScreenRouteProp = RouteProp<
  CommunitiesStackParamList,
  "GroupCalendarScreen"
>;

type GroupCalendarScreenProps = {
  routeName: string;
};

export interface Events {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    events: Event[];
    isToday?: boolean;
  };
}

type Event = {
  title: string;
};

const GroupCalendarScreen = ({ routeName }: GroupCalendarScreenProps) => {
  const navigation = useNavigation<GroupCalendarScreenNavigationProp>();
  const route = useRoute<GroupCalendarScreenRouteProp>();
  const { groupId } = route.params;
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastPressedDate, setLastPressedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Events>({});
  const [group, setGroup] = useState<{
    id: string;
    name: string;
    default_color: string;
  } | null>(null);

  useEffect(() => {
    fetchGroupDetails();
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    setSelectedDate(todayString);
    setLastPressedDate(todayString);
  }, []);

  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const calendarNavigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => task.grouping_id === groupId);

    const eventsMap: Events = {};

    filteredTasks.forEach((task) => {
      const dateString = task.start_date_time.split("T")[0]; // Ensure date is in 'YYYY-MM-DD' format
      if (!eventsMap[dateString]) {
        eventsMap[dateString] = {
          events: [],
        };
      }
      eventsMap[dateString].events.push({ title: task.title });
    });

    setEvents(eventsMap);
  }, [tasks, groupId]);

  const fetchGroupDetails = async () => {
    const { data, error } = await supabase
      .from("groupings")
      .select("id, name, default_color")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error fetching group details:", error);
    } else {
      setGroup(data);
    }
  };

  const handleDayPress = (dateString: string) => {
    if (selectedDate === dateString && lastPressedDate === dateString) {
      const hasTasks = tasks.some(
        (task) => task.start_date_time.split("T")[0] === dateString
      );
      if (hasTasks) {
        calendarNavigation.navigate("DayViewCalendar", {
          date: dateString,
          calendarName: group?.name || "Group Calendar",
        });
      } else {
        rootNavigation.navigate("TaskForm", {
          date: dateString,
          groupParams: group?.name || "",
        });
      }
    } else {
      setSelectedDate(dateString);
      setLastPressedDate(dateString);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {group && (
          <View style={styles.groupProfileCircle}>
            <View
              style={[
                styles.groupProfileCircleInner,
                { backgroundColor: group.default_color },
              ]}>
              <Text style={styles.groupProfileText}>{group.name[0]}</Text>
            </View>
          </View>
        )}
        <Text style={styles.calendarNameText}>{group?.name}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarWrapper}>
        <GridCalendar
          events={events} // Use the transformed events
          selectedDate={selectedDate}
          onDayPress={handleDayPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  groupProfileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  groupProfileCircleInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  groupProfileText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarNameText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  calendarWrapper: {
    flex: 1,
    transform: [{ scale: 0.9 }, { translateY: -25 }],
    marginBottom: 20,
  },
  centeredGroupNameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Add some margin below the text
  },
});

export default GroupCalendarScreen;
