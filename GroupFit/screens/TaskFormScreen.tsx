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
import { Ionicons } from "@expo/vector-icons";
import ColorPickerModal from "../components/ColorPickerModal";
import DatePickerComponent from "../components/DatePickerComponent";
import TimePickerComponent from "../components/TimePickerComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Events, Task } from "../types";

const generateNumericID = () => {
  return Math.floor(Math.random() * 1_000_000_000);
};

type TaskFormProps = NativeStackScreenProps<RootStackParamList, "TaskForm">;

type ColorObject = {
  hex: string;
};

const TaskForm: React.FC<TaskFormProps> = ({ route, navigation }) => {
  const { date, grouping = "Personal" } = route.params;
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [task, setTask] = useState<Task>({
    id: generateNumericID(),
    title: "",
    startDate: date || todayString,
    startTime: "09:00",
    endDate: date || todayString,
    endTime: "10:00",
    location: "",
    grouping: grouping,
    notes: "",
    priority: "",
    notificationDate: null,
    notificationTime: null,
    createdById: 1,
    completedById: undefined,
    assignedToId: 1,
  });

  const [groupTitle, setGroupTitle] = useState("Personal");
  const [groupColor, setGroupColor] = useState("#54c5c9");
  const [showColorModal, setShowColorModal] = useState(false);
  const [showNotificationPickers, setShowNotificationPickers] = useState(false);

  const handleChange = (key: keyof typeof task, value: string) => {
    setTask({ ...task, [key]: value });
  };

  const handleDateChange = (key: keyof Task, value: Date | null) => {
    if (value) {
      setTask({ ...task, [key]: value.toISOString().split("T")[0] });
    } else if (key === "notificationDate") {
      setTask({ ...task, [key]: null });
    }
  };

  const handleTimeChange = (key: keyof Task, value: Date | null) => {
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
          id: 1,
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
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const onSelectColor = ({ hex }: ColorObject) => {
    setGroupColor(hex);
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
            <DatePickerComponent
              date={task.startDate}
              onDateChange={(selectedDate) =>
                handleDateChange("startDate", selectedDate)
              }
              label="Start Date"
            />
            <DatePickerComponent
              date={task.endDate}
              onDateChange={(selectedDate) =>
                handleDateChange("endDate", selectedDate)
              }
              label="End Date"
            />
          </View>

          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={24} color="black" />
          </View>

          <View style={styles.timeContainer}>
            <TimePickerComponent
              time={task.startTime}
              onTimeChange={(selectedTime) =>
                handleTimeChange("startTime", selectedTime)
              }
              label="Start Time"
            />
            <TimePickerComponent
              time={task.endTime}
              onTimeChange={(selectedTime) =>
                handleTimeChange("endTime", selectedTime)
              }
              label="End Time"
            />
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
              onPress={() => setShowColorModal(true)}
            />
            <ColorPickerModal
              visible={showColorModal}
              onClose={() => setShowColorModal(false)}
              onSelectColor={onSelectColor}
              currentColor={groupColor}
            />
          </View>
        </View>

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
              <DatePickerComponent
                date={task.notificationDate || todayString}
                onDateChange={(selectedDate) =>
                  handleDateChange("notificationDate", selectedDate)
                }
                label="Notification Date"
              />
              <TimePickerComponent
                time={task.notificationTime || "09:00"}
                onTimeChange={(selectedTime) =>
                  handleTimeChange("notificationTime", selectedTime)
                }
                label="Notification Time"
              />
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
    marginTop: 8,
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
    backgroundColor: "#54c5c9",
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
