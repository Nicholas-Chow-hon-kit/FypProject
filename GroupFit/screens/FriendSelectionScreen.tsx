import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
> & {
  routeName: string;
};

const FriendSelectionScreen = ({
  navigation,
  routeName,
}: FriendSelectionScreenProps) => {
  const { user } = useAuth();
  const { fetchGroupings } = useTasks(); // Get the fetchGroupings function from the useTasks hook
  const [friends, setFriends] = useState<{ id: any; username: any }[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<(string | number)[]>(
    []
  );
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#54c5c9"); // State for the group color
  const [showColorModal, setShowColorModal] = useState(false); // State to control the color picker modal visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState<
    { id: any; username: any }[]
  >([]);

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
        setFilteredFriends(friendData);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = friends.filter((friend) =>
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      setSearchQuery("");
      setFilteredFriends(friends);
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
      <View style={styles.defaultAvatar}>
        <Ionicons name="person" size={24} color="gray" />
      </View>
      <Text style={styles.friendNameText}>{item.username}</Text>
      {selectedFriends.includes(item.id) && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color="green"
          marginLeft="40%"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Create Group</Text>
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
        <View style={styles.separator} />
        <Text style={styles.instructionsText}>
          Tap on members in the friend list to select and deselect them for the
          group.
        </Text>
        <View style={styles.friendsHeader}>
          <Text style={styles.friendsCount}>{friends.length}</Text>
          <Text style={styles.friendsTitle}> Friends</Text>
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={toggleSearchMode}>
            <Ionicons
              name={isSearchMode ? "close" : "search"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {isSearchMode && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        )}
        <FlatList
          data={isSearchMode ? filteredFriends : friends}
          renderItem={renderFriendCard}
          keyExtractor={(item) => item.id.toString()}
          style={styles.friendList}
        />
      </View>
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.tabButtonText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.tabButton} onPress={handleCreateGroup}>
          <Text style={styles.tabButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  content: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 12,
  },
  groupNameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  colorPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 10,
    marginBottom: 20,
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
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  friendsHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  friendsTitle: {
    fontSize: 18,
    color: "gray",
  },
  friendsCount: {
    fontSize: 18,
    color: "gray",
    marginRight: 5,
  },
  searchIcon: {
    marginLeft: "auto",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
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
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  friendNameText: {
    fontSize: 16,
    marginHorizontal: 20,
  },
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabButtonText: {
    fontSize: 16,
  },
});

export default FriendSelectionScreen;
