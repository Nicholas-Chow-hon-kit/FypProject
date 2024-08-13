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
import { Task, TaskFormScreenProps } from "../types";

const generateNumericID = () => {
  return Math.floor(Math.random() * 1_000_000_000); // Generates a random number between 0 and 999,999,999
};

const TaskForm: React.FC<TaskFormScreenProps> = ({
  route,
  navigation,
  session,
}) => {
  const { date } = route.params;
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [task, setTask] = useState<Task>({
    id: generateNumericID(), // Add a random UUID here
    title: "",
    startDate: date || todayString,
    startTime: "09:00",
    endDate: date || todayString,
    endTime: "10:00",
    location: "",
    grouping: "Personal",
    notes: "",
    priority: "",
    notificationDate: null,
    notificationTime: null,
    createdById: 1, // Use session data, swap later
    completedById: undefined,
    assignedToId: 1, // Use session data,swap later
  });

  const [groupTitle, setGroupTitle] = useState("Personal");
  const [groupColor, setGroupColor] = useState("#54c5c9");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [showColorModal, setShowColorModal] = useState(false);

  const [showNotificationPickers, setShowNotificationPickers] = useState(false);

  const [showNotificationDatePicker, setShowNotificationDatePicker] =
    useState(false); // Added
  const [showNotificationTimePicker, setShowNotificationTimePicker] =
    useState(false); // Added

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

  const handleDateChange = (
    key: "startDate" | "endDate" | "notificationDate",
    value: Date | null
  ) => {
    if (value) {
      setTask({ ...task, [key]: value.toISOString().split("T")[0] });
    } else if (key === "notificationDate") {
      setTask({ ...task, [key]: null });
    }
  };

  const handleTimeChange = (
    key: "startTime" | "endTime" | "notificationTime",
    value: Date | null
  ) => {
    if (value) {
      const timeString = value.toTimeString().split(" ")[0].slice(0, 5);
      setTask({ ...task, [key]: timeString });
    } else if (key === "notificationTime") {
      setTask({ ...task, [key]: null });
    }
  };

  const handleRemoveNotification = () => {
    setTask({
      ...task,
      notificationDate: null,
      notificationTime: null,
    });
    setShowNotificationPickers(false);
  };
  const handleSubmit = () => {
    const formattedTask = {
      groupTitle,
      color: groupColor,
      tasks: [
        {
          id: 1, // You may want to generate a unique ID or manage IDs differently
          title: task.title,
          startDate: task.startDate,
          startTime: task.startTime,
          endDate: task.endDate,
          endTime: task.endTime,
          location: task.location,
          grouping: task.grouping,
          notes: task.notes,
          priority: task.priority,
          notificationDate: task.notificationDate,
          notificationTime: task.notificationTime,
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

  const onSelectColor = ({ hex }: { hex: string }) => {
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

        {/* Notification starts here */}

        {!showNotificationPickers ? (
          <TouchableOpacity onPress={() => setShowNotificationPickers(true)}>
            <View style={styles.inputContainer}>
              <Ionicons name="notifications-sharp" size={24} color="black" />
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Set notification"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.notificationDateTimeContainer}>
            <View style={styles.notificationlabelContainer}>
              <Ionicons name="notifications-sharp" size={24} color="black" />
              <Text style={styles.labelText}>Notification date & time:</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveNotification}>
                <Ionicons name="remove-circle-sharp" size={26} color="red" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  onPress={() => setShowNotificationDatePicker(true)}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInput}>
                      {task.notificationDate
                        ? formatDate(task.notificationDate)
                        : formatDate(todayString)}
                    </Text>
                  </View>
                </TouchableOpacity>
                {showNotificationDatePicker && (
                  <DateTimePicker
                    value={
                      task.notificationDate
                        ? new Date(task.notificationDate)
                        : new Date()
                    }
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowNotificationDatePicker(Platform.OS === "ios");
                      if (selectedDate)
                        handleDateChange("notificationDate", selectedDate);
                    }}
                  />
                )}
              </View>

              <View style={styles.timeInputContainer}>
                <TouchableOpacity
                  onPress={() => setShowNotificationTimePicker(true)}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInput}>
                      {task.notificationTime || "Select time"}
                    </Text>
                  </View>
                </TouchableOpacity>
                {showNotificationTimePicker && (
                  <DateTimePicker
                    value={
                      task.notificationTime
                        ? new Date(`1970-01-01T${task.notificationTime}:00`)
                        : new Date(`1970-01-01T09:00:00`)
                    }
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      setShowNotificationTimePicker(Platform.OS === "ios");
                      if (selectedTime)
                        handleTimeChange("notificationTime", selectedTime);
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        )}

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
  notificationlabelContainer: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  notificationDateTimeContainer: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    paddingBottom: 16,
    marginLeft: 10,
  },
  removeButton: {
    marginTop: 5,
    marginLeft: "20%",
  },
});

export default TaskForm;
