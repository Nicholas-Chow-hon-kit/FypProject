import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import TaskGroup from "../components/TaskGroup";
import { Task, TaskGroupData } from "../types";
import { useTasks } from "../contexts/TaskProvider";
import Dropdown from "../components/Dropdown"; // Import the custom dropdown component
import FilterModal from "../components/FilterModal"; // Import the custom filter modal component
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import { saveSelectedPeriod, getSelectedPeriod } from "../utils/asyncStorage"; // Import the AsyncStorage functions

const HomeScreen = () => {
  const { user } = useAuth();
  const { tasks, groupings, deleteTask } = useTasks();
  const [taskGroups, setTaskGroups] = useState<TaskGroupData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchSelectedFilters();
    loadSettings();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && groupings.length > 0) {
      const currentDate = new Date();
      let filteredTasks = tasks;

      if (selectedPeriod === "day") {
        filteredTasks = tasks.filter((task) => {
          const startDate = new Date(task.start_date_time);
          return (
            startDate.getDate() === currentDate.getDate() &&
            startDate.getMonth() === currentDate.getMonth() &&
            startDate.getFullYear() === currentDate.getFullYear()
          );
        });
      } else if (selectedPeriod === "week") {
        const startOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
        );
        const endOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)
        );
        filteredTasks = tasks.filter((task) => {
          const startDate = new Date(task.start_date_time);
          return startDate >= startOfWeek && startDate <= endOfWeek;
        });
      } else if (selectedPeriod === "month") {
        filteredTasks = tasks.filter((task) => {
          const startDate = new Date(task.start_date_time);
          return (
            startDate.getMonth() === currentDate.getMonth() &&
            startDate.getFullYear() === currentDate.getFullYear()
          );
        });
      } else if (selectedPeriod === "year") {
        filteredTasks = tasks.filter((task) => {
          const startDate = new Date(task.start_date_time);
          return startDate.getFullYear() === currentDate.getFullYear();
        });
      }

      const groupedTasks: { [key: string]: Task[] } = {};
      filteredTasks.forEach((task) => {
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
          is_complete: task.is_complete,
          // assignedToId: task.assigned_to,
        };

        if (!groupedTasks[task.grouping_id]) {
          groupedTasks[task.grouping_id] = [];
        }
        groupedTasks[task.grouping_id].push(transformedTask);
      });

      const taskGroupsData: TaskGroupData[] = groupings
        .filter((grouping) => selectedFilters.includes(grouping.id))
        .map((grouping) => ({
          groupTitle: grouping.name,
          color: grouping.default_color,
          tasks: groupedTasks[grouping.id] || [],
        }));

      setTaskGroups(taskGroupsData);
    }
  }, [tasks, groupings, selectedPeriod, selectedFilters]);

  const fetchSelectedFilters = async () => {
    const { data, error } = await supabase
      .from("user_filters")
      .select("filters")
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error fetching selected filters:", error);
    } else {
      if (data.length > 0) {
        setSelectedFilters(data[0].filters);
      } else {
        setSelectedFilters(groupings.map((g) => g.id));
      }
    }
  };

  const saveSelectedFilters = async (filters: string[]) => {
    const { data, error } = await supabase
      .from("user_filters")
      .upsert([{ user_id: user?.id, filters }], {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error saving selected filters:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    // Update the local state to reflect the deletion
    setTaskGroups((prevTaskGroups) =>
      prevTaskGroups.map((group) => ({
        ...group,
        tasks: group.tasks.filter((task) => task.id !== taskId),
      }))
    );
  };

  const onEdit = (task: Task) => {
    navigation.navigate("UpdateForm", { task });
  };

  const onShare = (task: Task) => {
    // Implement your share logic here
  };

  const renderItem = ({ item }: { item: TaskGroupData }) => (
    <TaskGroup
      groupTitle={item.groupTitle}
      tasks={item.tasks}
      color={item.color}
      onDelete={handleDeleteTask}
      onEdit={onEdit}
      onShare={onShare}
    />
  );

  const periodOptions = [
    { label: "Tasks for the Day", value: "day" },
    { label: "Tasks for the Week", value: "week" },
    { label: "Tasks for the Month", value: "month" },
    { label: "Tasks for the Year", value: "year" },
  ];

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleFilterSelect = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((filter) => filter !== value)
      : [...selectedFilters, value];

    setSelectedFilters(newFilters);
    saveSelectedFilters(newFilters);
  };

  const loadSettings = async () => {
    const period = await getSelectedPeriod();
    if (period) {
      setSelectedPeriod(period);
    }
  };

  useEffect(() => {
    saveSelectedPeriod(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="default" />
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Header
              onFilterPress={handleFilterPress}
              filterOptions={groupings.map((g) => ({
                label: g.name,
                value: g.id,
              }))}
              selectedFilters={selectedFilters}
            />
            <View style={styles.periodSelector}>
              <Dropdown
                options={periodOptions}
                selectedValue={selectedPeriod}
                onValueChange={(value) => setSelectedPeriod(value)}
              />
            </View>
          </View>
        }
        data={taskGroups}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupTitle}
      />
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={groupings.map((g) => ({ label: g.name, value: g.id }))}
        selected={selectedFilters}
        onSelect={handleFilterSelect}
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
});

export default HomeScreen;
