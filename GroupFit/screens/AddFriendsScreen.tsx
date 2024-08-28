import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleSendRequest(item.id)}
      disabled={item.isInvited}>
      <View style={styles.defaultAvatar}>
        <Ionicons name="person" size={24} color="gray" />
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
    </TouchableOpacity>
  );

  const onClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{routeName}</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by username"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.searchIcon} onPress={onClear}>
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={searchResults}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          style={styles.userList}
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  userList: {
    flex: 1,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultAvatar: {
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

export default AddFriendsScreen;
