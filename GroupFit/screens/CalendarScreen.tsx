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
        <View style={styles.calendarWrapper}>
          <View style={styles.addButtonContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate("TaskForm", { date: selectedDate })
              }>
              <Text style={styles.addButton}>+</Text>
            </Pressable>
          </View>
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
  },
  calendarWrapper: {
    flex: 1,
    transform: [{ scale: 0.9 }],
    marginTop: 10,
  },
  addButtonContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  addButton: {
    fontSize: 24,
    color: "black",
  },
});

export default CalendarScreen;
