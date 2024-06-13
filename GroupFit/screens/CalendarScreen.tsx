import React, { useState, useEffect } from 'react';
import { View, Modal, TextInput, Button, StyleSheet, Text, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [events, setEvents] = useState<{ [date: string]: { marked?: boolean, dotColor?: string, events: { title: string }[], isToday?: boolean } }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const theme = {
    weekVerticalMargin: 0,
    calendarBackground: '#FFFFFF',
    textSectionTitleColor: '#000000',
    arrowColor: '#000000',
    monthTextColor: '#000000',
    textDayHeaderFontSize: 16,
    textMonthFontSize: 16,
    textDayFontSize: 16,
    
  };

  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Initialize events with today marked as selected
    const initialEvents = {
      [todayString]: {
        marked: true,
        dotColor: 'blue',
        events: [],
        isToday: true,
      },
    };

    setEvents(initialEvents);
    setSelectedDate(todayString); // Set today as the initially selected date
  }, []);

  const handleAddEvent = () => {
    const date = newEvent.date;
    const title = newEvent.title;

    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };

      if (!updatedEvents[date]) {
        updatedEvents[date] = {
          marked: true,
          dotColor: 'blue',
          events: [],
        };
      }

      updatedEvents[date].events.push({ title });

      return updatedEvents;
    });

    setModalVisible(false);
    setNewEvent({ title: '', date: '' });
    setSelectedDate(date); // Set the selected date to the newly added event date
  };

  const handleDayPress = (dateString: string) => {
    setSelectedDate(dateString);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.addButton}>+</Text>
        </Pressable>
      </View>
      <Calendar
        theme={theme}
        markedDates={events}
        dayComponent={({ date, state }) => {
          if (!date) return null;

          const dayEvents = events[date.dateString]?.events || [];
          const isToday = events[date.dateString]?.isToday;
          const isSelected = selectedDate === date.dateString;
          const isSunday = new Date(date.dateString).getDay() === 0;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.dayContainer,
                state === 'disabled' && styles.disabled,
                pressed && styles.pressedDayContainer,
                isSelected && styles.selectedDayContainer,
              ]}
              onPress={() => handleDayPress(date.dateString)}
            >
              <View style={isToday ? styles.todayMarker : null}>
                <Text style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSunday && styles.sundayText // Apply red color for Sundays
                ]}>
                  {date.day}
                </Text>
              </View>
              {dayEvents.map((event, index) => (
                <Text key={index} style={styles.eventText}>
                  {event.title}
                </Text>
              ))}
            </Pressable>
          );
        }}
        firstDay={1} // Set Monday as the first day of the week
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={newEvent.title}
            onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          />
          <Button title="Add Event" onPress={handleAddEvent} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set background color for the calendar screen
  },
  dayContainer: {
    width: '100%',
    aspectRatio: 0.5, // Adjust aspect ratio to make the container taller
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5, // Add some padding to give space at the top
  },
  pressedDayContainer: {
    backgroundColor: '#DDDDDD',
  },
  selectedDayContainer: {
    borderColor: '#DDDDDD',
    borderWidth: 2,
    borderRadius: 10,
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  sundayText: {
    color: 'red', // Red color for Sundays
  },
  todayMarker: {
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  todayText: {
    color: 'white',
  },
  eventText: {
    fontSize: 10,
    color: 'blue',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    width: '80%',
  },
  addButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  addButton: {
    fontSize: 24,
    color: 'black',
  },
});

export default CalendarScreen;
