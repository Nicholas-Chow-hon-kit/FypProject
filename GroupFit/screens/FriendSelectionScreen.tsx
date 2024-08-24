import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";

type FriendSelectionScreenProps = NativeStackScreenProps<
  CommunitiesStackParamList,
  "FriendSelection"
>;

const FriendSelectionScreen = ({ navigation }: FriendSelectionScreenProps) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<{ id: any; username: any }[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<(string | number)[]>(
    []
  );
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", user?.id)
      .eq("status", "accepted");

    if (error) {
      console.error("Error fetching friends:", error);
    } else {
      const friendIds = data.map((item) => item.friend_id);
      const { data: friendData, error: friendError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", friendIds);

      if (friendError) {
        console.error("Error fetching friend profiles:", friendError);
      } else {
        setFriends(friendData);
      }
    }
  };

  const handleSelectFriend = (friendId: number | string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleCreateGroup = async () => {
    const { data, error } = await supabase.from("groupings").insert([
      {
        name: groupName,
        created_by: user?.id,
        members: selectedFriends,
      },
    ]);

    if (error) {
      console.error("Error creating group:", error);
    } else {
      navigation.navigate("CommunitiesScreen");
    }
  };

  interface FriendItem {
    id: number | string;
    username: string;
  }

  const renderFriendCard = ({ item }: { item: FriendItem }) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => handleSelectFriend(item.id)}>
      <View style={styles.friendInitialsCircle}>
        <Text style={styles.friendInitialsText}>{item.username[0]}</Text>
      </View>
      <Text style={styles.friendNameText}>{item.username}</Text>
      {selectedFriends.includes(item.id) && (
        <Ionicons name="checkmark-circle" size={24} color="green" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.groupNameInput}
        placeholder="Group name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <FlatList
        data={friends}
        renderItem={renderFriendCard}
        keyExtractor={(item) => item.id.toString()}
        style={styles.friendList}
      />
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={handleCreateGroup}>
        <Text style={styles.createGroupButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  groupNameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  friendList: {
    flex: 1,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  friendInitialsCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  friendInitialsText: {
    fontSize: 20,
    color: "white",
  },
  friendNameText: {
    fontSize: 16,
  },
  createGroupButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  createGroupButtonText: {
    color: "white",
    fontSize: 14,
  },
});

export default FriendSelectionScreen;
