import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TaskItemProps } from "../types";
import { supabase } from "../lib/supabase";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const period = parseInt(hours) >= 12 ? "PM" : "AM";
  const formattedHours = parseInt(hours) % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onEdit,
  onShare,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchCreatorName = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", task.createdById)
        .single();

      if (data) {
        setCreatorName(data.full_name);
      }
    };

    fetchCreatorName();
  }, [task.createdById]);

  const titleFontSize = expanded ? 16 * 1.5 : 16;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        onLongPress={() => setModalVisible(true)}>
        <View style={[styles.header, expanded && styles.headerExpanded]}>
          <Text style={[styles.title, { fontSize: titleFontSize }]}>
            {task.title}
          </Text>
          {!expanded && (
            <MaterialIcons
              name={expanded ? "expand-less" : "expand-more"}
              size={24}
            />
          )}
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.details, expanded && styles.detailsExpanded]}>
          <View style={styles.labelContainer}>
            <Ionicons name="time-outline" size={24} color="black" />
            <Text style={styles.labelText}>Task date & time:</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>
              Start Date: {formatDate(task.startDate)}
            </Text>
            <Text style={styles.dateTimeText}>
              Start Time: {formatTime(task.startTime)}
            </Text>
            <Text style={styles.dateTimeText}>
              End Date: {formatDate(task.endDate)}
            </Text>
            <Text style={styles.dateTimeText}>
              End Time: {formatTime(task.endTime)}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location" size={24} color="black" />
            <Text style={styles.inputText}>Location: {task.location}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="people" size={24} color="black" />
            <Text style={styles.inputText}>Grouping: {task.grouping}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="notifications-sharp" size={24} color="black" />
            <Text style={styles.inputText}>
              Notification Date:{" "}
              {task.notificationDate
                ? formatDate(task.notificationDate)
                : "None"}
            </Text>
            <Text style={styles.inputText}>
              Notification Time:{" "}
              {task.notificationTime
                ? formatTime(task.notificationTime)
                : "None"}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="pencil" size={24} color="black" />
            <Text style={styles.inputText}>Notes: {task.notes}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="alert-sharp" size={24} color="black" />
            <Text style={styles.inputText}>Priority: {task.priority}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={24} color="black" />
            <Text style={styles.inputText}>Created By: {creatorName}</Text>
          </View>

          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View style={styles.collapseIconContainer}>
              <MaterialIcons name="expand-less" size={24} />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    onEdit(task);
                  }}>
                  <Text style={styles.modalText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    onDelete(task.id);
                  }}>
                  <Text style={[styles.modalText, styles.deleteText]}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    onShare(task);
                  }}>
                  <Text style={styles.modalText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalOption, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
  details: {
    borderRadius: 5,
    padding: 10,
  },
  detailsExpanded: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  labelText: {
    fontSize: 18,
    marginLeft: 8,
  },
  dateTimeContainer: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    paddingBottom: 16,
    marginLeft: 7,
  },
  dateTimeText: {
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
  inputText: {
    flex: 1,
    padding: 8,
    marginLeft: 8,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    paddingBottom: 10,
  },
  modalOption: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalText: {
    fontSize: 18,
    color: "#007AFF",
  },
  deleteText: {
    color: "#FF3B30",
  },
  cancelButton: {
    borderTopColor: "#ccc",
    borderBottomWidth: 0,
  },
  collapseIconContainer: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default TaskItem;
