import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Header from "../components/Header";
import TaskGroup from "../components/TaskGroup";
import { MaterialIcons } from "@expo/vector-icons";
import { Task, TaskGroupData } from "../types";
import { useTasks } from "../contexts/TaskProvider";

const onDelete = (id: string) => {
  // Implement your delete logic here
};

const onEdit = (task: Task) => {
  // Implement your edit logic here
};

const onShare = (task: Task) => {
  // Implement your share logic here
};

const HomeScreen = () => {
  const { tasks, groupings } = useTasks();
  const [taskGroups, setTaskGroups] = useState<TaskGroupData[]>([]);

  useEffect(() => {
    if (tasks.length > 0 && groupings.length > 0) {
      const groupedTasks: { [key: string]: Task[] } = {};
      tasks.forEach((task) => {
        const startDateTime = new Date(task.start_date_time);
        const endDateTime = new Date(task.end_date_time);

        const transformedTask: Task = {
          id: task.id,
          title: task.title,
          startDate: startDateTime.toDateString(),
          startTime: startDateTime.toTimeString().split(" ")[0].slice(0, 5),
          endDate: endDateTime.toDateString(),
          endTime: endDateTime.toTimeString().split(" ")[0].slice(0, 5),
          location: task.location,
          grouping:
            groupings.find((g) => g.id === task.grouping_id)?.name || "",
          notes: task.notes,
          priority: task.priority,
          notificationDate: task.notification
            ? new Date(task.notification).toDateString()
            : null,
          notificationTime: task.notification
            ? new Date(task.notification)
                .toTimeString()
                .split(" ")[0]
                .slice(0, 5)
            : null,
          createdById: task.created_by,
          completedById: task.completed_by,
          // assignedToId: task.assigned_to,
        };

        if (!groupedTasks[task.grouping_id]) {
          groupedTasks[task.grouping_id] = [];
        }
        groupedTasks[task.grouping_id].push(transformedTask);
      });

      const taskGroupsData: TaskGroupData[] = groupings.map((grouping) => ({
        groupTitle: grouping.name,
        color: grouping.default_color,
        tasks: groupedTasks[grouping.id] || [],
      }));

      setTaskGroups(taskGroupsData);
    }
  }, [tasks, groupings]);

  const renderItem = ({ item }: { item: TaskGroupData }) => (
    <TaskGroup
      groupTitle={item.groupTitle}
      tasks={item.tasks}
      color={item.color}
      onDelete={onDelete}
      onEdit={onEdit}
      onShare={onShare}
    />
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="default" />
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Header />
            <View style={styles.periodSelector}>
              <Text style={styles.periodText}>Tasks for the week</Text>
              <MaterialIcons name="arrow-drop-down" size={24} />
            </View>
          </View>
        }
        data={taskGroups}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupTitle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginTop: 5,
    marginBottom: 10,
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
