import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import TaskItem from '../components/TaskItem';

interface Task {
  id: number;
  title: string;
  showDetails: boolean;
  details: string;
}

interface TaskGroupProps {
  group: {
    id: number;
    title: string;
    tasks: Task[];
  };
  onAddTask: (groupId: number) => void;
  onToggleTaskDetails: (groupId: number, taskId: number) => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({ group, onAddTask, onToggleTaskDetails }) => (
  <View style={styles.groupContainer}>
    <View style={styles.groupHeader}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <View style={styles.groupActions}>
        <Text style={styles.taskCount}>{group.tasks.length}</Text>
        <Pressable onPress={() => onAddTask(group.id)}>
          <FontAwesome name="plus" size={24} color="black" />
        </Pressable>
      </View>
    </View>
    <FlatList
      data={group.tasks}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggleDetails={() => onToggleTaskDetails(group.id, item.id)}
        />
      )}
      keyExtractor={item => item.id.toString()}
    />
  </View>
);

const styles = StyleSheet.create({
  groupContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCount: {
    fontSize: 16,
    marginRight: 8,
  },
});

export default TaskGroup;
