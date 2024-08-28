import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTasks } from "../contexts/TaskProvider";
import { CommunitiesStackParamList } from "../types";

interface GroupItem {
  id: string;
  name: string;
  default_color: string;
}

const CommunitiesScreen = () => {
  const { user } = useAuth();
  const { filteredGroupings, friendRequestsCount, fetchFriendRequestsCount } =
    useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<GroupItem[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<CommunitiesStackParamList>>();

  useEffect(() => {
    // Set initial groups
    setInitialGroups();
  }, [filteredGroupings]);

  const setInitialGroups = () => {
    setGroups(filteredGroupings);
  };

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groupings")
      .select("id, name, default_color")
      .neq("name", "Personal")
      .eq("created_by", user?.id);

    if (error) {
      console.error("Error fetching groups:", error);
    } else {
      setGroups(data);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query) {
      const { data, error } = await supabase
        .from("groupings")
        .select("id, name, default_color")
        .ilike("name", `%${query}%`)
        .neq("name", "Personal")
        .eq("created_by", user?.id);

      if (error) {
        console.error("Error searching groups:", error);
      } else {
        setGroups(data);
      }
    } else {
      fetchGroups();
    }
  };

  const renderGroupCard = ({ item }: { item: GroupItem }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() =>
        navigation.navigate("GroupCalendarScreen", { groupId: item.id })
      }>
      <View
        style={[
          styles.groupProfileCircle,
          { backgroundColor: item.default_color },
        ]}>
        <Text style={styles.groupProfileText}>{item.name[0]}</Text>
      </View>
      <Text style={styles.groupNameText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/Logo/groupfit-high-resolution-logo-black-transparent-Side.png")}
            style={styles.logo}
          />
          <TouchableOpacity
            style={styles.friendRequestsIcon}
            onPress={() => navigation.navigate("FriendRequests")}>
            <Ionicons name="people" size={24} color="black" />
            {friendRequestsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{friendRequestsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={groups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        style={styles.groupList}
      />
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={() => navigation.navigate("FriendSelection")}>
        <MaterialIcons name="library-add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 50,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  friendRequestsIcon: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  groupList: {
    flex: 1,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  groupProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  groupProfileText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  groupNameText: {
    fontSize: 16,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CommunitiesScreen;
