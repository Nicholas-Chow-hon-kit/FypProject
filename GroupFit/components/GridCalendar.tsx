import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

export interface DateObject {
  day: number;
  month: number;
  year: number;
  timestamp: number;
  dateString: string;
}

export interface Event {
  title: string;
}

export interface Events {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    events: Event[];
    isToday?: boolean;
  };
}

export interface GridCalendarProps {
  events: Events;
  selectedDate: string | null;
  onDayPress: (dateString: string) => void;
}

const currentDate = new Date(); // Define currentDate here

const GridCalendar: React.FC<GridCalendarProps> = ({
  events,
  selectedDate,
  onDayPress,
}) => {
  const theme = {
    weekVerticalMargin: 0,
    calendarBackground: "#FFFFFF",
    textSectionTitleColor: "#000000",
    arrowColor: "#000000",
    monthTextColor: "#000000",
    textDayHeaderFontSize: 16,
    textMonthFontSize: 16,
    textDayFontSize: 16,
  };

  return (
    <Calendar
      theme={theme}
      markedDates={events}
      dayComponent={({ date, state }: { date: DateObject; state: string }) => {
        if (!date) return null;

        const dayEvents = events[date.dateString]?.events || [];
        const isToday =
          date.year === currentDate.getFullYear() &&
          date.month === currentDate.getMonth() + 1 &&
          date.day === currentDate.getDate();
        const isSelected = selectedDate === date.dateString;
        const isSunday = new Date(date.dateString).getDay() === 0;

        return (
          <Pressable
            style={({ pressed }) => [
              styles.dayContainer,
              state === "disabled" && styles.disabled,
              pressed && styles.pressedDayContainer,
              isSelected && styles.selectedDayContainer,
            ]}
            onPress={() => onDayPress(date.dateString)}>
            <View style={isToday ? styles.todayMarker : null}>
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSunday && styles.sundayText,
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
      firstDay={1}
    />
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    width: "100%",
    aspectRatio: 0.5,
    justifyContent: "flex-start",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
  },
  pressedDayContainer: {
    backgroundColor: "#DDDDDD",
  },
  selectedDayContainer: {
    borderColor: "#DDDDDD",
    borderWidth: 2,
    borderRadius: 10,
  },
  dayText: {
    fontSize: 16,
    textAlign: "center",
  },
  sundayText: {
    color: "red",
  },
  todayMarker: {
    backgroundColor: "black",
    borderRadius: 5,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  todayText: {
    color: "white",
  },
  eventText: {
    fontSize: 10,
    color: "blue",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default GridCalendar;
