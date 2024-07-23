import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TaskItem from "../components/TaskItem";
import { MaterialIcons } from "@expo/vector-icons";
import { TaskGroupProps } from "../types";

const TaskGroup: React.FC<TaskGroupProps> = ({
  groupTitle,
  tasks,
  color,
  onDelete,
  onEdit,
  onShare,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{groupTitle}</Text>
          <Text style={styles.taskCount}>{tasks.length}</Text>
        </View>
        <MaterialIcons name="add" size={24} style={styles.addIcon} />
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={onDelete}
            onEdit={onEdit}
            onShare={onShare}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskCount: {
    fontSize: 14,
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  addIcon: {
    marginLeft: 10,
  },
});

export default TaskGroup;
