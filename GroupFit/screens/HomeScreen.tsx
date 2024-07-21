import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import Header from "../components/Header";
import TaskGroup from "../components/TaskGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { Task } from "../types";

const taskGroups = [
  {
    title: "Gym Class",
    color: "#dec4ff",
    tasks: [
      { id: 1, title: "Warm-up", details: "10 minutes of stretching" },
      { id: 2, title: "Cardio", details: "30 minutes on treadmill" },
    ],
  },
  {
    title: "Agile Group Project",
    color: "#c4dfff",
    tasks: [
      {
        id: 1,
        title: "Sprint Planning",
        details: "Plan tasks for the next sprint",
      },
      { id: 2, title: "Code Review", details: "Review code with team" },
    ],
  },
];

const onDelete = (id: number) => {
  // Implement your delete logic here
};

const onEdit = (task: Task) => {
  // Implement your delete logic here
};

const onShare = (task: Task) => {
  // Implement your delete logic here
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.periodSelector}>
        <Text style={styles.periodText}>Task for the week</Text>
        <MaterialIcons name="arrow-drop-down" size={24} />
      </View>
      {taskGroups.map((group, index) => (
        <TaskGroup
          key={index}
          title={group.title}
          tasks={group.tasks}
          color={group.color}
          onDelete={onDelete}
          onEdit={onEdit}
          onShare={onShare}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 25,
    backgroundColor: "#fff",
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  periodText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
