import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";

type FriendRequestsScreenProps = NativeStackScreenProps<
  CommunitiesStackParamList,
  "FriendRequests"
>;

type FriendRequest = {
  id: any;
  user_id: any;
  friend_id: any;
  status: any;
};

const FriendRequestsScreen = ({ navigation }: FriendRequestsScreenProps) => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select("id, user_id, friend_id, status")
      .eq("friend_id", user?.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching friend requests:", error);
    } else {
      setFriendRequests(data);
    }
  };

  const handleAcceptRequest = async (requestId: number | string) => {
    const { data, error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (error) {
      console.error("Error accepting friend request:", error);
    } else {
      fetchFriendRequests();
    }
  };

  const handleDeclineRequest = async (requestId: number | string) => {
    const { data, error } = await supabase
      .from("friendships")
      .update({ status: "declined" })
      .eq("id", requestId);

    if (error) {
      console.error("Error declining friend request:", error);
    } else {
      fetchFriendRequests();
    }
  };

  interface FriendRequest {
    user_id: string;
    id: number;
  }

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestCard}>
      <Text style={styles.requestText}>
        Friend request from user {item.user_id}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item.id)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDeclineRequest(item.id)}>
          <Text style={styles.buttonText}>Decline</Text>
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
        <Text style={styles.headerTitle}>Friend Requests</Text>
      </View>
      <FlatList
        data={friendRequests}
        renderItem={renderFriendRequest}
        keyExtractor={(item) => item.id.toString()}
        style={styles.requestList}
      />
      <TouchableOpacity
        style={styles.addFriendButton}
        onPress={() => navigation.navigate("AddFriends")}>
        <Ionicons name="person-add" size={24} color="white" />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  requestList: {
    flex: 1,
  },
  requestCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  requestText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  declineButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  addFriendButton: {
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

export default FriendRequestsScreen;
