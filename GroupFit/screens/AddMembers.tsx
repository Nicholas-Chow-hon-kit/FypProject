// src/screens/AddMembers.tsx
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
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

type AddMembersScreenProps = NativeStackScreenProps<
  CommunitiesStackParamList,
  "AddMembers"
> & {
  routeName: string;
};

const AddMembersScreen = ({ routeName }: AddMembersScreenProps) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<{ id: any; username: any }[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<(string | number)[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<
    { id: any; username: any }[]
  >([]);
  const [currentGroupMembers, setCurrentGroupMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute<AddMembersScreenProps["route"]>();
  const { groupId } = route.params;

  useEffect(() => {
    fetchFriends();
    fetchCurrentGroupMembers();
  }, []);

  useEffect(() => {
    filterFriends();
  }, [currentGroupMembers, friends]);

  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select("friend_id, user_id, status")
      .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`)
      .eq("status", "accepted");

    if (error) {
      console.error("Error fetching friends:", error);
      setLoading(false);
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
        setLoading(false);
      } else {
        setFriends(friendData);
        setLoading(false);
      }
    }
  };

  const fetchCurrentGroupMembers = async () => {
    const { data, error } = await supabase
      .from("grouping_members")
      .select("user_id")
      .eq("grouping_id", groupId);

    if (error) {
      console.error("Error fetching current group members:", error);
    } else {
      const memberIds = data.map((member) => member.user_id);
      setCurrentGroupMembers(memberIds);
    }
  };

  const filterFriends = () => {
    const filtered = friends.filter(
      (friend) => !currentGroupMembers.includes(friend.id)
    );
    setFilteredFriends(filtered);
  };

  const handleSelectFriend = (friendId: number | string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleAddMembers = async () => {
    const memberInsertData = selectedFriends.map((memberId) => ({
      grouping_id: groupId,
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

    navigation.goBack();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = friends.filter((friend) =>
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filtered);
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
          style={styles.checkmarkIcon}
        />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Add Members</Text>

        <Text style={styles.instructionsText}>
          Tap on members in the friend list to select and deselect them for the
          group.
        </Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => setSearchQuery("")}>
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {friends.length > 0 ? (
          <FlatList
            data={filteredFriends}
            renderItem={renderFriendCard}
            keyExtractor={(item) => item.id.toString()}
            style={styles.friendList}
          />
        ) : (
          <Text style={styles.noFriendsText}>No friends available</Text>
        )}
      </View>
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.tabButtonText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.tabButton} onPress={handleAddMembers}>
          <Text style={styles.tabButtonText}>Add</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  friendList: {
    flex: 1,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
  checkmarkIcon: {
    marginLeft: "auto",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFriendsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default AddMembersScreen;
