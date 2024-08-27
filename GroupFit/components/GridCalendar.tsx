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
  color: string; // Add color property to represent the grouping's default color
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
              <View key={index} style={styles.eventContainer}>
                <View
                  style={[
                    styles.eventBar,
                    {
                      backgroundColor: event.color, // Ensure color is passed
                      height: event.title.length > 9 ? 24 : 16, // Adjust height based on content length
                    },
                  ]}
                />
                <Text
                  style={styles.eventTitle}
                  numberOfLines={2} // Limit text to 2 lines
                  ellipsizeMode="tail">
                  {event.title}
                </Text>
              </View>
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
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  eventBar: {
    width: 4,
    marginRight: 4,
  },
  eventTitle: {
    fontSize: 10,
    color: "black",
    flex: 1,
    paddingRight: 3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default GridCalendar;
