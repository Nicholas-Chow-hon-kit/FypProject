// src/screens/DayViewCalendar.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, CalendarStackParamList } from "../types";
import { useTasks } from "../contexts/TaskProvider";
import { Task } from "../contexts/TaskProvider.types";
import TaskCard from "../components/TaskCard";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const DayViewCalendar: React.FC<{ routeName?: string }> = ({ routeName }) => {
  const { tasks, groupings } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [calendarName, setCalendarName] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  const navigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();
  const route =
    useRoute<RouteProp<CalendarStackParamList, "DayViewCalendar">>();

  useEffect(() => {
    if (route.params) {
      setSelectedDate(route.params.date);
      setCalendarName(route.params.calendarName);
    }
  }, [route.params]);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const taskDate = task.start_date_time.split("T")[0];
      return taskDate === selectedDate;
    });
    setFilteredTasks(filtered);
  }, [selectedDate, tasks]);

  useEffect(() => {
    const markedDatesMap: { [key: string]: any } = {};
    tasks.forEach((task) => {
      const taskDate = task.start_date_time.split("T")[0];
      if (!markedDatesMap[taskDate]) {
        markedDatesMap[taskDate] = { marked: true, dotColor: "blue" };
      }
    });
    setMarkedDates(markedDatesMap);
  }, [tasks]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const renderTaskCard = ({ item }: { item: Task }) => {
    const grouping = groupings.find((g) => g.id === item.grouping_id);
    const color = grouping ? grouping.default_color : "#000000";
    const groupingName = grouping ? grouping.name : "";
    return <TaskCard task={item} color={color} groupingName={groupingName} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{calendarName}</Text>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => console.log("Search pressed")}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: "blue" },
          }}
        />
        <View style={styles.separator} />
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskCard}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
        />
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
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskList: {
    marginTop: 20,
  },
  separator: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginTop: 20,
  },
});

export default DayViewCalendar;
