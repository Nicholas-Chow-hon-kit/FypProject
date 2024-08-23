import React, { useState, useEffect } from "react";
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
import { RootStackParamList } from "../types";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTasks } from "../contexts/TaskProvider";
import { Events, Event } from "../components/GridCalendar";

const CalendarScreen: React.FC = () => {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastPressedDate, setLastPressedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Events>({});

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    setSelectedDate(todayString);
    setLastPressedDate(todayString);
  }, []);

  useEffect(() => {
    const eventsMap: Events = {};

    tasks.forEach((task) => {
      const dateString = task.start_date_time.split("T")[0]; // Ensure date is in 'YYYY-MM-DD' format
      if (!eventsMap[dateString]) {
        eventsMap[dateString] = {
          events: [],
        };
      }
      eventsMap[dateString].events.push({ title: task.title });
    });

    console.log("Transformed Events:", eventsMap); // Log the transformed events
    setEvents(eventsMap);
  }, [tasks]);

  const handleDayPress = (dateString: string) => {
    if (selectedDate === dateString && lastPressedDate === dateString) {
      navigation.navigate("TaskForm", { date: dateString });
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
              navigation.navigate("TaskForm", { date: selectedDate })
            }>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
          <Text style={styles.title}>General Calendar</Text>
          <View style={styles.icons}>
            <MaterialIcons name="filter-list" size={24} style={styles.icon} />
            <MaterialIcons name="more-vert" size={24} style={styles.icon} />
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
    fontSize: 25,
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
    transform: [{ scale: 1 }],
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CalendarScreen;
