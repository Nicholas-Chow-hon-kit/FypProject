import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type DatePickerProps = {
  date: string;
  onDateChange: (selectedDate: Date) => void;
  label: string;
};

const DatePickerComponent: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  label,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === "ios");
            if (selectedDate) onDateChange(selectedDate);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 20, // Adjust the font size as needed
  },
});

export default DatePickerComponent;
