import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import GridCalendar from '../components/GridCalendar';
import EventModal from '../components/EventModal';

interface Events {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    events: { title: string }[];
    isToday?: boolean;
  };
}

const CalendarScreen = () => {
  const [events, setEvents] = useState<Events>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    const date = newEvent.date || selectedDate;
    const title = newEvent.title;

    if (!date) return;

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
  };

  const handleDayPress = (dateString: string) => {
    if (selectedDate === dateString) {
      setModalVisible(true);
    } else {
      setSelectedDate(dateString);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <View style={styles.addButtonContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.addButton}>+</Text>
          </Pressable>
        </View>
        <GridCalendar events={events} selectedDate={selectedDate} onDayPress={handleDayPress} />
      </View>
      <EventModal
        visible={modalVisible}
        newEvent={newEvent}
        onClose={() => setModalVisible(false)}
        onChangeTitle={(text) => setNewEvent({ ...newEvent, title: text })}
        onAddEvent={handleAddEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  calendarContainer: {
    flex: 1,
    transform: [{ scale: 0.95 }],
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
