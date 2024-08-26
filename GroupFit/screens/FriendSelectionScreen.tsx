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
import { useNavigation } from "@react-navigation/native";
import ColorPickerModal from "../components/ColorPickerModal"; // Import the color picker modal
import { useTasks } from "../contexts/TaskProvider";

type FriendSelectionScreenProps = NativeStackScreenProps<
  CommunitiesStackParamList,
  "FriendSelection"
>;

const FriendSelectionScreen = ({ navigation }: FriendSelectionScreenProps) => {
  const { user } = useAuth();
  const { fetchGroupings } = useTasks(); // Get the fetchGroupings function from the useTasks hook
  const [friends, setFriends] = useState<{ id: any; username: any }[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<(string | number)[]>(
    []
  );
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#54c5c9"); // State for the group color
  const [showColorModal, setShowColorModal] = useState(false); // State to control the color picker modal visibility

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select("friend_id, user_id, status")
      .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`)
      .eq("status", "accepted");

    if (error) {
      console.error("Error fetching friends:", error);
    } else {
      const friendIds = data.map((item) =>
        item.user_id === user?.id ? item.friend_id : item.user_id
      );
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
    // Include the user's ID in the members array
    const membersWithUser = [...selectedFriends, user?.id];

    // Insert the new grouping
    const { data: groupingData, error: groupingError } = await supabase
      .from("groupings")
      .insert([
        {
          name: groupName,
          created_by: user?.id,
          default_color: groupColor,
        },
      ])
      .select("id"); // Select the ID of the newly created grouping

    if (groupingError) {
      console.error("Error creating group:", groupingError);
      return;
    }

    const groupingId = groupingData[0].id;

    // Insert the members into the grouping_members table
    const memberInsertData = membersWithUser.map((memberId) => ({
      grouping_id: groupingId,
      user_id: memberId,
      role: "member", // You can set the role as needed
    }));

    const { error: membersError } = await supabase
      .from("grouping_members")
      .insert(memberInsertData);

    if (membersError) {
      console.error("Error adding members to group:", membersError);
      return;
    }

    // Refetch the groupings
    await fetchGroupings();

    navigation.navigate("CommunitiesScreen");
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
      </View>
      <TextInput
        style={styles.groupNameInput}
        placeholder="Group name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <View style={styles.colorPickerContainer}>
        <Text style={styles.colorPickerLabel}>Group Color:</Text>
        <TouchableOpacity
          style={[styles.colorCircle, { backgroundColor: groupColor }]}
          onPress={() => setShowColorModal(true)}
        />
      </View>
      <ColorPickerModal
        visible={showColorModal}
        onClose={() => setShowColorModal(false)}
        onSelectColor={(color) => setGroupColor(color.hex)}
        currentColor={groupColor}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  groupNameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  colorPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorPickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
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
