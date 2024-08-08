import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";
import ColorPickerModal from "../components/ColorPickerModal";

type TaskFormProps = NativeStackScreenProps<RootStackParamList, "TaskForm">;

type ColorObject = {
  hex: string;
};

const TaskForm: React.FC<TaskFormProps> = ({ route, navigation }) => {
  const { date } = route.params;
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [task, setTask] = useState({
    title: "",
    startDate: date || todayString,
    startTime: "09:00",
    endDate: date || todayString,
    endTime: "10:00",
    location: "",
    grouping: "Personal",
    notes: "",
    priority: "",
    notification: "",
    createdById: 1,
    completedById: undefined,
    assignedToId: 1,
  });

  const [groupTitle, setGroupTitle] = useState("Personal");
  const [groupColor, setGroupColor] = useState("#54c5c9");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [showColorModal, setShowColorModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const handleChange = (key: keyof typeof task, value: string) => {
    setTask({ ...task, [key]: value });
  };

  const handleDateChange = (key: "startDate" | "endDate", value: Date) => {
    setTask({ ...task, [key]: value.toISOString().split("T")[0] });
  };

  const handleTimeChange = (key: "startTime" | "endTime", value: Date) => {
    const timeString = value.toTimeString().split(" ")[0].slice(0, 5);
    setTask({ ...task, [key]: timeString });
  };

  const handleSubmit = () => {
    // Convert start and end date/time into JSON date format
    const startDateTimeJSON = new Date(
      `${task.startDate}T${task.startTime}`
    ).toISOString();
    const endDateTimeJSON = new Date(
      `${task.endDate}T${task.endTime}`
    ).toISOString();

    const formattedTask = {
      groupTitle,
      color: groupColor,
      tasks: [
        {
          id: 1, // You may want to generate a unique ID or manage IDs differently
          title: task.title,
          // JSON date format
          startDateTime: startDateTimeJSON,
          endDateTime: endDateTimeJSON,
          location: task.location,
          grouping: task.grouping,
          notes: task.notes,
          priority: task.priority,
          notification: task.notification,
          createdById: task.createdById,
          completedById: task.completedById,
          assignedToId: task.assignedToId,
        },
      ],
    };

    console.log(formattedTask);
    // Handle form submission, such as saving to a database
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const onSelectColor = ({ hex }: ColorObject) => {
    setGroupColor(hex);
    console.log(hex);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={task.title}
            onChangeText={(text) => handleChange("title", text)}
          />
        </View>

        <View style={styles.labelContainer}>
          <Ionicons name="time-outline" size={28} color="black" />
          <Text style={styles.labelText}>Task date & time:</Text>
        </View>

        <View style={styles.dateSelectionContainer}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>
                    {formatDate(task.startDate)}
                  </Text>
                </View>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={new Date(task.startDate)}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(Platform.OS === "ios");
                    if (selectedDate)
                      handleDateChange("startDate", selectedDate);
                  }}
                />
              )}
            </View>

            <View style={styles.dateContainer}>
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>
                    {formatDate(task.endDate)}
                  </Text>
                </View>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date(task.endDate)}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(Platform.OS === "ios");
                    if (selectedDate) handleDateChange("endDate", selectedDate);
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={24} color="black" />
          </View>

          <View style={styles.timeContainer}>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>{task.startTime}</Text>
                </View>
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  value={new Date(`1970-01-01T${task.startTime}:00`)}
                  mode="time"
                  display="spinner"
                  onChange={(event, selectedTime) => {
                    setShowStartTimePicker(Platform.OS === "ios");
                    if (selectedTime)
                      handleTimeChange("startTime", selectedTime);
                  }}
                />
              )}
            </View>

            <View style={styles.timeInputContainer}>
              <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>{task.endTime}</Text>
                </View>
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  value={new Date(`1970-01-01T${task.endTime}:00`)}
                  mode="time"
                  display="spinner"
                  onChange={(event, selectedTime) => {
                    setShowEndTimePicker(Platform.OS === "ios");
                    if (selectedTime) handleTimeChange("endTime", selectedTime);
                  }}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={task.location}
            onChangeText={(text) => handleChange("location", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="people" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Grouping"
            value={task.grouping}
            onChangeText={(text) => handleChange("grouping", text)}
          />
          <View style={styles.colorContainer}>
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: groupColor }]}
              onPress={() => setShowColorModal(true)}>
              {/* Circle is filled with the selected color */}
            </TouchableOpacity>
            <ColorPickerModal
              visible={showColorModal}
              onClose={() => setShowColorModal(false)}
              onSelectColor={onSelectColor}
              currentColor={groupColor}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="pencil" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={task.notes}
            onChangeText={(text) => handleChange("notes", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="alert-sharp" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Priority"
            value={task.priority}
            onChangeText={(text) => handleChange("priority", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="notifications" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Notification"
            value={task.notification}
            onChangeText={(text) => handleChange("notification", text)}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCancel} style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    padding: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  labelText: {
    fontSize: 20,
    marginLeft: 8,
  },
  dateSelectionContainer: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
  },
  timeInputContainer: {
    flex: 1,
    alignItems: "center",
  },
  arrowContainer: {
    alignItems: "center",
    padding: 10,
  },
  dateInput: {
    fontSize: 20,
    padding: 8,
    textAlign: "center",
  },
  colorContainer: {},
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: "#54c5c9", // Default color
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  input: {
    flex: 1,
    padding: 8,
    marginLeft: 8,
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    backgroundColor: "#F5F5F5",
    borderColor: "#CCCCCC",
  },
  button: {
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default TaskForm;
