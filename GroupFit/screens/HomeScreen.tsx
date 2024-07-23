import React from "react";
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
import { data } from "../store/dummyData";

const onDelete = (id: number) => {
  // Implement your delete logic here
};

const onEdit = (task: Task) => {
  // Implement your edit logic here
};

const onShare = (task: Task) => {
  // Implement your share logic here
};

const HomeScreen = () => {
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupTitle} // Adjust keyExtractor as needed
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
