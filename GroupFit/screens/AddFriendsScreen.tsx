import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";

type AddFriendsScreenProps = NativeStackScreenProps<
  CommunitiesStackParamList,
  "AddFriends"
> & {
  routeName: string;
};

type UserProfile = {
  id: string;
  username: string;
  isInvited?: boolean;
};

const AddFriendsScreen = ({ navigation, routeName }: AddFriendsScreenProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (searchResults.length > 0) {
      checkFriendRequests();
    }
  }, [searchResults]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .ilike("username", `%${query}%`)
        .neq("id", user?.id);

      if (error) {
        console.error("Error searching users:", error);
      } else {
        setSearchResults(data);
      }
    } else {
      setSearchResults([]);
    }
  };

  const checkFriendRequests = async () => {
    const friendIds = searchResults.map((user) => user.id);
    const { data, error } = await supabase
      .from("friendships")
      .select("friend_id")
      .in("friend_id", friendIds)
      .eq("user_id", user?.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error checking friend requests:", error);
    } else {
      const invitedFriends = data.map((item) => item.friend_id);
      setSearchResults((prevResults) =>
        prevResults.map((user) => ({
          ...user,
          isInvited: invitedFriends.includes(user.id),
        }))
      );
    }
  };

  const handleSendRequest = async (friendId: string) => {
    const { data, error } = await supabase.from("friendships").insert([
      {
        user_id: user?.id,
        friend_id: friendId,
        status: "pending",
        created_by: user?.id,
        updated_by: user?.id,
      },
    ]);

    if (error) {
      console.error("Error sending friend request:", error);
    } else {
      // Update the UI to show "Invited"
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === friendId ? { ...user, isInvited: true } : user
        )
      );
    }
  };

  const renderUserCard = ({ item }: { item: UserProfile }) => (
    <View style={styles.userCard}>
      <View style={styles.profileCard}>
        <View style={styles.profilePicture}>
          <Ionicons name="person-circle-outline" size={48} color="black" />
        </View>
        <Text style={styles.usernameText}>{item.username}</Text>
        <TouchableOpacity
          style={[styles.inviteButton, item.isInvited && styles.invitedButton]}
          onPress={() => handleSendRequest(item.id)}
          disabled={item.isInvited}>
          <Text style={styles.buttonText}>
            {item.isInvited ? "Invited" : "Invite"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{routeName}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by username"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={searchResults}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        style={styles.userList}
      />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  userList: {
    flex: 1,
  },
  userCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  usernameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  inviteButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  invitedButton: {
    backgroundColor: "#b3d9ff",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});

export default AddFriendsScreen;
