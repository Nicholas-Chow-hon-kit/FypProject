import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Task {
  id: number;
  title: string;
  showDetails: boolean;
  details: string;
}

interface TaskItemProps {
  task: Task;
  onToggleDetails: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleDetails }) => (
  <View style={styles.taskContainer}>
    <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Pressable onPress={onToggleDetails}>
        <FontAwesome name="angle-down" size={24} color="black" />
      </Pressable>
    </View>
    {task.showDetails && (
      <View style={styles.taskDetails}>
        <Text>Details: {task.details}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  taskContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
  },
  taskDetails: {
    marginTop: 8,
  },
});

export default TaskItem;
