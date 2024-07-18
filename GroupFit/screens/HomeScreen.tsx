import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTask, addTaskGroup, toggleTaskDetails } from '../store/tasksSlice';
import Header from '../components/Header';
import TaskGroup from '../components/TaskGroup';
import { initDB, addTaskGroupToDB, addTaskToDB } from '../utilities/database';

const TaskManagerScreen: React.FC = () => {
  const dispatch = useDispatch();
  const taskGroups = useSelector((state: RootState) => state.tasks.taskGroups);

  useEffect(() => {
    initDB();
    // Load initial data from the database if needed
  }, []);

  const handleAddTask = (groupId: number) => {
    const newTask = {
      id: Math.random(), // Replace with proper ID generation
      title: 'New Task',
      showDetails: false,
      details: 'Task details here...',
    };
    addTaskToDB(groupId, newTask.title, (insertId) => {
      dispatch(addTask({ groupId, task: { ...newTask, id: insertId } }));
    });
  };

  const handleAddTaskGroup = () => {
    const newGroup = {
      id: Math.random(), // Replace with proper ID generation
      title: 'New Group',
      tasks: [],
    };
    addTaskGroupToDB(newGroup.title, (insertId) => {
      dispatch(addTaskGroup({ ...newGroup, id: insertId }));
    });
  };

  const handleToggleTaskDetails = (groupId: number, taskId: number) => {
    dispatch(toggleTaskDetails({ groupId, taskId }));
  };

  return (
    <View style={styles.container}>
      <Header
        onFilterPress={() => console.log('Filter Pressed')}
        onSettingsPress={() => console.log('Settings Pressed')}
        onViewChange={() => console.log('View Change Pressed')}
      />
      <FlatList
        data={taskGroups}
        renderItem={({ item }) => (
          <TaskGroup
            group={item}
            onAddTask={handleAddTask}
            onToggleTaskDetails={handleToggleTaskDetails}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <Pressable style={styles.addButton} onPress={handleAddTaskGroup}>
        <FontAwesome name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskManagerScreen;
