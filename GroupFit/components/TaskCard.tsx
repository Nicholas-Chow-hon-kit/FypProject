import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Task as TaskProviderType } from "../contexts/TaskProvider.types";
import { transformTaskData } from "../utils/transformTaskData";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

interface TaskCardProps {
  task: TaskProviderType;
  color: string;
  groupingName: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, color, groupingName }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const transformedTask = transformTaskData(task, groupingName, color);

  const handlePress = () => {
    navigation.navigate("UpdateForm", { task: transformedTask });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <View style={styles.taskDetails}>
        <Text style={styles.title}>{transformedTask.title}</Text>
        <Text style={styles.timeLocation}>
          {transformedTask.startTime} - {transformedTask.endTime}{" "}
          {transformedTask.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
    borderWidth: 0.8,
    borderColor: "grey",
  },
  colorIndicator: {
    width: 20,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  taskDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeLocation: {
    fontSize: 14,
    color: "#666",
  },
});

export default TaskCard;
