import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunitiesStackParamList, RootStackParamList } from "../types";
import { supabase } from "../lib/supabase";
import { RouteProp } from "@react-navigation/native";
import { useTasks } from "../contexts/TaskProvider";
import GridCalendar from "../components/GridCalendar";
import TaskCard from "../components/TaskCard"; // Import the TaskCard component
import { Task } from "../contexts/TaskProvider.types";

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
  color: string; // Add color property to represent the grouping's default color
};

const GroupCalendarScreen = ({ routeName }: GroupCalendarScreenProps) => {
  const navigation = useNavigation<GroupCalendarScreenNavigationProp>();
  const route = useRoute<GroupCalendarScreenRouteProp>();
  const { groupId } = route.params;
  const { tasks, groupings } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastPressedDate, setLastPressedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Events>({});
  const [group, setGroup] = useState<{
    id: string;
    name: string;
    default_color: string;
  } | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);

  useEffect(() => {
    fetchGroupDetails();
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    setSelectedDate(todayString);
    setLastPressedDate(todayString);
  }, []);

  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      const color = group ? group.default_color : "#000000"; // Use group's default color
      eventsMap[dateString].events.push({ title: task.title, color });
    });

    setEvents(eventsMap);
  }, [tasks, groupId, group]);

  useEffect(() => {
    if (searchQuery) {
      const results = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          task.grouping_id === groupId
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, tasks, groupId]);

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
        navigation.navigate("GroupDayViewCalendar", {
          date: dateString,
          calendarName: group?.name || "Group Calendar",
          groupId: groupId,
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

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      {searchMode ? (
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={toggleSearchMode}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.groupProfileContainer}
            onPress={() => navigation.navigate("GroupDetails", { groupId })}>
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
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSearchMode}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      {!searchMode && (
        <View style={styles.calendarWrapper}>
          <GridCalendar
            events={events} // Use the transformed events
            selectedDate={selectedDate}
            onDayPress={handleDayPress}
          />
        </View>
      )}
      {searchMode && (
        <View style={styles.searchResultsContainer}>
          {searchResults.map((task) => {
            const grouping = groupings.find((g) => g.id === task.grouping_id);
            const color = grouping ? grouping.default_color : "#000000";
            const groupingName = grouping ? grouping.name : "";
            return (
              <TaskCard
                key={task.id}
                task={task}
                color={color}
                groupingName={groupingName}
              />
            );
          })}
        </View>
      )}
      {!searchMode && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            rootNavigation.navigate("TaskForm", {
              date: selectedDate || new Date().toISOString().split("T")[0],
              groupParams: group?.name || "",
            })
          }>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: "gray",
  },
  groupProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    transform: [{ scale: 0.96 }, { translateY: -18 }],
    marginBottom: 20,
  },
  centeredGroupNameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  searchResultsContainer: {
    flex: 1,
    padding: 10,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default GroupCalendarScreen;
