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
  Modal,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ColorPickerModal from "../components/ColorPickerModal";
import DatePickerComponent from "../components/DatePickerComponent";
import TimePickerComponent from "../components/TimePickerComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Events, Task } from "../types";
import { Picker } from "@react-native-picker/picker";
import { useTasks } from "../hooks/useTasks";
import { TaskData } from "../contexts/AuthProvider.types";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";

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

  const { user, session } = useAuth();

  const { createTask, groupings, members, setSelectedGrouping } = useTasks();

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
    createdById: String(user),
    completedById: undefined,
    // assignedToId: [String(user)], // Store an array of IDs
  });

  const [groupTitle, setGroupTitle] = useState("Personal");
  const [groupColor, setGroupColor] = useState("#54c5c9");
  const [showColorModal, setShowColorModal] = useState(false);
  const [showNotificationPickers, setShowNotificationPickers] = useState(false);
  const [suggestedGroupings, setSuggestedGroupings] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    if (task.grouping === "") {
      // Fetch groupings that the user is part of
      supabase
        .from("grouping_members")
        .select("grouping_id")
        .eq("user_id", user)
        .then(({ data: userGroups, error }) => {
          if (userGroups) {
            console.log(userGroups);
            const groupingIds = userGroups.map((item) => item.grouping_id);
            supabase
              .from("groupings")
              .select("id, name")
              .in("id", groupingIds)
              .then(({ data: groupingData, error }) => {
                if (groupingData) {
                  setSuggestedGroupings(groupingData);
                }
              });
          }
        });
    } else {
      setSuggestedGroupings([]);
    }
  }, [task.grouping]);

  const handleChange = (
    key: keyof typeof task,
    value: string | number | string[]
  ) => {
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
    const formattedTask: Omit<TaskData, "notification"> & {
      notification?: string;
    } = {
      title: task.title,
      start_date_time: `${task.startDate}T${task.startTime}:00`,
      end_date_time: `${task.endDate}T${task.endTime}:00`,
      location: task.location,
      grouping_id: task.grouping,
      notes: task.notes,
      priority: task.priority,
      // assigned_to: task.assignedToId,
      created_by: String(user),
    };

    if (task.notificationDate && task.notificationTime) {
      formattedTask.notification = `${task.notificationDate}T${task.notificationTime}:00`;
    }

    const finalTask: TaskData = {
      ...formattedTask,
      ...(formattedTask.notification && {
        notification: formattedTask.notification,
      }),
    };

    createTask(finalTask);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const onSelectColor = ({ hex }: ColorObject) => {
    setGroupColor(hex);
  };

  // const handleAddMember = () => {
  //   if (selectedMember && !task.assignedToId.includes(selectedMember)) {
  //     setTask({
  //       ...task,
  //       assignedToId: [...task.assignedToId, selectedMember],
  //     });
  //     setSelectedMember(null);
  //   }
  // };

  // const handleRemoveMember = (memberId: string) => {
  //   setTask({
  //     ...task,
  //     assignedToId: task.assignedToId.filter((id) => id !== memberId),
  //   });
  // };

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
          <Picker
            selectedValue={task.grouping}
            onValueChange={(itemValue) => {
              handleChange("grouping", itemValue);
              setSelectedGrouping(itemValue);
              console.log(itemValue);
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

        {suggestedGroupings.length > 0 && (
          <View style={styles.suggestedGroupingsContainer}>
            {suggestedGroupings.map((grouping) => (
              <TouchableOpacity
                key={grouping.id}
                onPress={() => {
                  handleChange("grouping", grouping.id);
                  setSelectedGrouping(grouping.id);
                }}>
                <Text style={styles.suggestedGroupingText}>
                  {grouping.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* // TODO: Display the task assignent when there is time */}
        {/* <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color="black" />
          <Picker
            selectedValue={selectedMember}
            onValueChange={(itemValue) => setSelectedMember(itemValue)}
            style={styles.picker}>
            {members.map((member) => (
              <Picker.Item
                key={member.id}
                label={member.name}
                value={member.id}
              />
            ))}
          </Picker>
          <TouchableOpacity onPress={handleAddMember} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View> */}

        {/* {task.assignedToId.length > 0 && (
          <View style={styles.assignedMembersContainer}>
            {task.assignedToId.map((memberId) => {
              const member = members.find((m) => m.id === memberId);
              return (
                <View key={memberId} style={styles.assignedMember}>
                  <Text>{member ? member.name : memberId}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(memberId)}>
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )} */}

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
  picker: {
    flex: 1,
    marginLeft: 8,
  },
  suggestedGroupingsContainer: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    paddingBottom: 16,
  },
  suggestedGroupingText: {
    fontSize: 18,
    padding: 8,
  },
  addButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: "#DCDCDC",
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 16,
  },
  assignedMembersContainer: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    paddingBottom: 16,
  },
  assignedMember: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
});

export default TaskForm;
