import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { supabase } from "../lib/supabase";
import { RouteProp } from "@react-navigation/native";

type GroupNameChangeScreenNavigationProp = NativeStackNavigationProp<
  CommunitiesStackParamList,
  "GroupNameChange"
>;

type GroupNameChangeScreenRouteProp = RouteProp<
  CommunitiesStackParamList,
  "GroupNameChange"
>;

const GroupNameChangeScreen: React.FC<{ routeName: string }> = ({
  routeName,
}) => {
  const navigation = useNavigation<GroupNameChangeScreenNavigationProp>();
  const route = useRoute<GroupNameChangeScreenRouteProp>();
  const { groupId, groupName } = route.params;
  const [newGroupName, setNewGroupName] = useState(groupName);
  const [remainingChars, setRemainingChars] = useState(100 - groupName.length);

  const handleGroupNameChange = async () => {
    const { data, error } = await supabase
      .from("groupings")
      .update({ name: newGroupName })
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error updating group name:", error);
    } else {
      navigation.goBack();
    }
  };

  const handleTextChange = (text: string) => {
    setNewGroupName(text);
    setRemainingChars(100 - text.length);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Enter group Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newGroupName}
            onChangeText={handleTextChange}
            autoFocus
            maxLength={100}
          />
          <Text style={styles.charCount}>{remainingChars}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.tab, styles.cancelTab]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.tabText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, styles.okTab]}
          onPress={handleGroupNameChange}>
          <Text style={styles.tabText}>OK</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 24,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginTop: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#007abb",
  },
  charCount: {
    marginLeft: 10,
    fontSize: 18,
    color: "lightgrey",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  cancelTab: {
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  okTab: {
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
  },
  tabText: {
    fontSize: 16,
  },
});

export default GroupNameChangeScreen;
