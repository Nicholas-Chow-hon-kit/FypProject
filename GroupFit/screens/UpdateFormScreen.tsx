import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ColorPickerModal from "../components/ColorPickerModal";
import DatePickerComponent from "../components/DatePickerComponent";
import TimePickerComponent from "../components/TimePickerComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Task } from "../types";
import { Picker } from "@react-native-picker/picker";
import { useTasks } from "../contexts/TaskProvider";
import { TaskData } from "../contexts/TaskProvider.types";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";

type UpdateFormProps = NativeStackScreenProps<
  RootStackParamList,
  "UpdateForm"
> & {
  routeName?: string;
};

type ColorObject = {
  hex: string;
};

const UpdateForm: React.FC<UpdateFormProps> = ({
  route,
  navigation,
  routeName,
}) => {
  const { task } = route.params;
  const { user } = useAuth();
  const { groupings, updateTask } = useTasks();

  const [editedTask, setEditedTask] = useState<Task>(task);
  const [groupColor, setGroupColor] = useState("#54c5c9");
  const [showColorModal, setShowColorModal] = useState(false);
  const [showNotificationPickers, setShowNotificationPickers] = useState(false);

  useEffect(() => {
    const selectedGrouping = groupings.find(
      (grouping) => grouping.id === editedTask.grouping
    );
    if (selectedGrouping) {
      setGroupColor(selectedGrouping.default_color);
    }
  }, [editedTask.grouping, groupings]);

  const handleChange = (
    key: keyof typeof editedTask,
    value: string | number | string[]
  ) => {
    setEditedTask({ ...editedTask, [key]: value });
  };

  const handleDateChange = (key: keyof Task, value: Date | null) => {
    if (value) {
      setEditedTask({
        ...editedTask,
        [key]: value.toISOString().split("T")[0],
      });
    } else if (key === "notificationDate") {
      setEditedTask({ ...editedTask, [key]: null });
    }
  };

  const handleTimeChange = (key: keyof Task, value: Date | null) => {
    if (value) {
      const timeString = value.toTimeString().split(" ")[0].slice(0, 5);
      setEditedTask({ ...editedTask, [key]: timeString });
    } else if (key === "notificationTime") {
      setEditedTask({ ...editedTask, [key]: null });
    }
  };

  const handleRemoveNotification = () => {
    setEditedTask({
      ...editedTask,
      notificationDate: null,
      notificationTime: null,
    });
    setShowNotificationPickers(false);
  };

  const handleSubmit = async () => {
    const formattedTask: Omit<TaskData, "notification"> & {
      notification?: string;
    } = {
      title: editedTask.title,
      start_date_time: `${editedTask.startDate}T${editedTask.startTime}:00`,
      end_date_time: `${editedTask.endDate}T${editedTask.endTime}:00`,
      location: editedTask.location,
      grouping_id: editedTask.grouping,
      notes: editedTask.notes,
      priority: editedTask.priority,
      created_by: String(user),
    };

    if (editedTask.notificationDate && editedTask.notificationTime) {
      formattedTask.notification = `${editedTask.notificationDate}T${editedTask.notificationTime}:00`;
    }

    const finalTask: TaskData = {
      ...formattedTask,
      ...(formattedTask.notification && {
        notification: formattedTask.notification,
      }),
    };

    // Update the grouping color in the database
    await supabase
      .from("groupings")
      .update({ default_color: groupColor })
      .eq("id", editedTask.grouping);

    updateTask(editedTask.id, finalTask);
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
            value={editedTask.title}
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
              date={editedTask.startDate}
              onDateChange={(selectedDate) =>
                handleDateChange("startDate", selectedDate)
              }
              label="Start Date"
            />
            <DatePickerComponent
              date={editedTask.endDate}
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
              time={editedTask.startTime}
              onTimeChange={(selectedTime) =>
                handleTimeChange("startTime", selectedTime)
              }
              label="Start Time"
            />
            <TimePickerComponent
              time={editedTask.endTime}
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
            value={editedTask.location}
            onChangeText={(text) => handleChange("location", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="people" size={24} color="black" />
          <Picker
            selectedValue={editedTask.grouping}
            onValueChange={(itemValue) => {
              handleChange("grouping", itemValue);
            }}
            style={styles.picker}>
            {groupings.map((grouping) => (
              <Picker.Item
                key={grouping.id}
                label={grouping.name}
                value={grouping.id}
              />
            ))}
          </Picker>
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
                date={editedTask.notificationDate || editedTask.startDate}
                onDateChange={(selectedDate) =>
                  handleDateChange("notificationDate", selectedDate)
                }
                label="Notification Date"
              />
              <TimePickerComponent
                time={editedTask.notificationTime || editedTask.startTime}
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
            value={editedTask.notes}
            onChangeText={(text) => handleChange("notes", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="alert-sharp" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Priority"
            value={editedTask.priority}
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
  picker: {
    flex: 1,
    marginLeft: 8,
  },
});

export default UpdateForm;
