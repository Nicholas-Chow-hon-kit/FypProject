import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TaskItemProps } from "../types";

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onEdit,
  onShare,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        onLongPress={() => setModalVisible(true)}>
        <View style={[styles.header, expanded && styles.headerExpanded]}>
          <Text style={styles.title}>{task.title}</Text>
          <MaterialIcons
            name={expanded ? "expand-less" : "expand-more"}
            size={24}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.details, expanded && styles.detailsExpanded]}>
          <Text>Start Date: {task.startDate}</Text>
          <Text>Start Time: {task.startTime}</Text>
          <Text>End Date: {task.endDate}</Text>
          <Text>End Time: {task.endTime}</Text>
          <Text>Location: {task.location}</Text>
          <Text>Grouping: {task.grouping}</Text>
          <Text>Notes: {task.notes}</Text>
          <Text>Priority: {task.priority}</Text>
          <Text>Notification: {task.notification}</Text>
          <Text>Created By ID: {task.createdById}</Text>
          <Text>Completed By ID: {task.completedById}</Text>
          <Text>Assigned To ID: {task.assignedToId}</Text>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  headerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontSize: 16,
  },
  details: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  detailsExpanded: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
});

export default TaskItem;
