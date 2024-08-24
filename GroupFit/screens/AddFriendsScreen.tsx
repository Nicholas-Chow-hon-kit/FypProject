import React, { useState } from "react";
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
>;

type UserProfile = {
  id: string;
  username: string;
  email: string;
};

const AddFriendsScreen = ({ navigation }: AddFriendsScreenProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email")
        .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
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

  const handleSendRequest = async (friendId: string) => {
    const { data, error } = await supabase
      .from("friendships")
      .insert([{ user_id: user?.id, friend_id: friendId, status: "pending" }]);

    if (error) {
      console.error("Error sending friend request:", error);
    } else {
      // Handle success
    }
  };

  const renderUserCard = ({ item }: { item: UserProfile }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.usernameText}>{item.username}</Text>
        <Text style={styles.emailText}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => handleSendRequest(item.id)}>
        <Text style={styles.buttonText}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by username or email"
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userInfo: {
    flex: 1,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  inviteButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});

export default AddFriendsScreen;
