import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import GridCalendar from "../components/GridCalendar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, CalendarStackParamList } from "../types";
import { useTasks } from "../contexts/TaskProvider";
import { Events, Event } from "../components/GridCalendar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import FilterModal from "../components/FilterModal"; // Import the custom filter modal component

const CalendarScreen: React.FC = () => {
  const { user } = useAuth();
  const { tasks, groupings } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastPressedDate, setLastPressedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Events>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const calendarName = "General Calendar";

  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const calendarNavigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();

  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    setSelectedDate(todayString);
    setLastPressedDate(todayString);
    fetchSelectedFilters();
  }, []);

  useEffect(() => {
    const filteredTasks = tasks.filter((task) =>
      selectedFilters.includes(task.grouping_id)
    );

    const eventsMap: Events = {};

    filteredTasks.forEach((task) => {
      const dateString = task.start_date_time.split("T")[0]; // Ensure date is in 'YYYY-MM-DD' format
      if (!eventsMap[dateString]) {
        eventsMap[dateString] = {
          events: [],
        };
      }
      const grouping = groupings.find((g) => g.id === task.grouping_id);
      const color = grouping ? grouping.default_color : "#000000"; // Default to black if no color found
      eventsMap[dateString].events.push({ title: task.title, color });
    });

    setEvents(eventsMap);
  }, [tasks, selectedFilters, groupings]);

  const fetchSelectedFilters = async () => {
    const { data, error } = await supabase
      .from("user_filters")
      .select("filters")
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error fetching selected filters:", error);
    } else {
      if (data.length > 0) {
        setSelectedFilters(data[0].filters);
      } else {
        setSelectedFilters(groupings.map((g) => g.id));
      }
    }
  };

  const saveSelectedFilters = async (filters: string[]) => {
    const { data, error } = await supabase
      .from("user_filters")
      .upsert([{ user_id: user?.id, filters }], {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error saving selected filters:", error);
    }
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleFilterSelect = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((filter) => filter !== value)
      : [...selectedFilters, value];

    setSelectedFilters(newFilters);
    saveSelectedFilters(newFilters);
  };

  const handleDayPress = (dateString: string) => {
    if (selectedDate === dateString && lastPressedDate === dateString) {
      const hasTasks = tasks.some(
        (task) => task.start_date_time.split("T")[0] === dateString
      );
      if (hasTasks) {
        calendarNavigation.navigate("DayViewCalendar", {
          date: dateString,
          calendarName,
        });
      } else {
        rootNavigation.navigate("TaskForm", { date: dateString });
      }
    } else {
      setSelectedDate(dateString);
      setLastPressedDate(dateString);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.addButton}
            onPress={() =>
              rootNavigation.navigate("TaskForm", { date: selectedDate })
            }>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
          <Text style={styles.title}>{calendarName}</Text>
          <View style={styles.icons}>
            <Pressable onPress={handleFilterPress}>
              <Ionicons name="options" size={24} style={styles.icon} />
            </Pressable>
          </View>
        </View>
        <View style={styles.calendarWrapper}>
          <GridCalendar
            events={events} // Use the transformed events
            selectedDate={selectedDate}
            onDayPress={handleDayPress}
          />
        </View>
      </View>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={groupings.map((g) => ({ label: g.name, value: g.id }))}
        selected={selectedFilters}
        onSelect={handleFilterSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  icons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 30,
    color: "black",
  },
  calendarWrapper: {
    flex: 1,
    transform: [{ scale: 0.96 }, { translateY: -35 }],
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CalendarScreen;
