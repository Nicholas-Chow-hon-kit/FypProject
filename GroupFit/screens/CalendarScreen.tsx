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
import EventModal from "../components/EventModal";
import { Events } from "../types";

interface Event {
  title: string;
}

const CalendarScreen = () => {
  const [events, setEvents] = useState<Events>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
  }, []);

  const handleAddEvent = () => {
    const date = newEvent.date || selectedDate;
    const title = newEvent.title;

    if (!date) return;

    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };

      if (!updatedEvents[date]) {
        updatedEvents[date] = {
          marked: true,
          dotColor: "blue",
          events: [],
        };
      }

      updatedEvents[date].events.push({ title });

      return updatedEvents;
    });

    setModalVisible(false);
    setNewEvent({ title: "", date: "" });
  };

  const handleDayPress = (dateString: string) => {
    if (selectedDate === dateString) {
      setModalVisible(true);
    } else {
      setSelectedDate(dateString);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <View style={styles.container}>
        <View style={styles.calendarWrapper}>
          <View style={styles.addButtonContainer}>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text style={styles.addButton}>+</Text>
            </Pressable>
          </View>
          <GridCalendar
            events={events}
            selectedDate={selectedDate}
            onDayPress={handleDayPress}
          />
          <EventModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onAddEvent={handleAddEvent}
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
    transform: [{ scale: 0.9 }], // Scale the calendar (adjust as needed)
    marginTop: 10, // Adjust top margin as needed
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
