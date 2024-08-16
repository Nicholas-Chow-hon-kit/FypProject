import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type TimePickerProps = {
  time: string;
  onTimeChange: (selectedTime: Date) => void;
  label: string;
};

const TimePickerComponent: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
  label,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={new Date(`1970-01-01T${time}:00`)}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            setShowPicker(Platform.OS === "ios");
            if (selectedTime) onTimeChange(selectedTime);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timeText: {
    fontSize: 20, // Adjust the font size as needed
  },
});

export default TimePickerComponent;
