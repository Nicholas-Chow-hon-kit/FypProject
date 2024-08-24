import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
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
}

const CommunitiesScreen = () => {
  const { user } = useAuth();
  const { groupings } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  const navigation =
    useNavigation<NativeStackNavigationProp<CommunitiesStackParamList>>();

  useEffect(() => {
    // Fetch friend requests count
    fetchFriendRequestsCount();
    // Set initial groups
    setInitialGroups();
  }, []);

  const fetchFriendRequestsCount = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select("id")
      .eq("friend_id", user?.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching friend requests count:", error);
    } else {
      setFriendRequestsCount(data.length);
    }
  };

  const setInitialGroups = () => {
    const filteredGroupings = groupings.filter(
      (group) => group.name !== "Personal"
    );
    setGroups(filteredGroupings);
  };

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groupings")
      .select("id, name")
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
        .select("id, name")
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
    <View style={styles.groupCard}>
      <Text style={styles.groupNameText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups"
          value={searchQuery}
          onChangeText={handleSearch}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
