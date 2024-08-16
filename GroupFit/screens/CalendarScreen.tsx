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
import { RootStackParamList, Events } from "../types";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CalendarScreen: React.FC = () => {
  const [events, setEvents] = useState<Events>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lastPressedDate, setLastPressedDate] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const initialEvents = {
      [todayString]: {
        marked: true,
        dotColor: "blue",
        events: [],
        isToday: true,
      },
    };

    setEvents(initialEvents);
    setSelectedDate(todayString);
    setLastPressedDate(todayString);
  }, []);

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
            events={events}
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
