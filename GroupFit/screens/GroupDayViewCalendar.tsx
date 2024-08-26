// src/screens/GroupDayViewCalendar.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { useTasks } from "../contexts/TaskProvider";
import { Task } from "../contexts/TaskProvider.types";
import TaskCard from "../components/TaskCard";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type GroupDayViewCalendarNavigationProp = NativeStackNavigationProp<
  CommunitiesStackParamList,
  "GroupDayViewCalendar"
>;

type GroupDayViewCalendarRouteProp = RouteProp<
  CommunitiesStackParamList,
  "GroupDayViewCalendar"
>;

const GroupDayViewCalendar: React.FC = () => {
  const { tasks, groupings } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [calendarName, setCalendarName] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);

  const navigation = useNavigation<GroupDayViewCalendarNavigationProp>();
  const route = useRoute<GroupDayViewCalendarRouteProp>();

  useEffect(() => {
    if (route.params) {
      const date = new Date(route.params.date).toISOString().split("T")[0];
      setSelectedDate(date);
      setCalendarName(route.params.calendarName);
      setGroupId(route.params.groupId);
    }
  }, [route.params]);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const taskDate = task.start_date_time.split("T")[0];
      return taskDate === selectedDate && task.grouping_id === groupId;
    });
    setFilteredTasks(filtered);
  }, [selectedDate, tasks, groupId]);

  useEffect(() => {
    const markedDatesMap: { [key: string]: any } = {};
    tasks.forEach((task) => {
      const taskDate = task.start_date_time.split("T")[0];
      if (!markedDatesMap[taskDate] && task.grouping_id === groupId) {
        markedDatesMap[taskDate] = { marked: true, dotColor: "blue" };
      }
    });
    setMarkedDates(markedDatesMap);
  }, [tasks, groupId]);

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

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const renderTaskCard = ({ item }: { item: Task }) => {
    const grouping = groupings.find((g) => g.id === item.grouping_id);
    const color = grouping ? grouping.default_color : "#000000";
    const groupingName = grouping ? grouping.name : "";
    return <TaskCard task={item} color={color} groupingName={groupingName} />;
  };

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
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
            <Text style={styles.title}>{calendarName}</Text>
            <TouchableOpacity onPress={toggleSearchMode}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        {!searchMode && (
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: "black" },
            }}
            firstDay={1} // Set the first day of the week to Monday
            theme={{
              selectedDayBackgroundColor: "black", // Customize the selected date circle color
            }}
          />
        )}
        <View style={styles.separator} />
        <FlatList
          data={searchMode ? searchResults : filteredTasks}
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
  searchHeader: {
    flexDirection: "row",
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
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
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

export default GroupDayViewCalendar;
