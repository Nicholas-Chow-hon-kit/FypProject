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
> & {
  routeName: string;
};

interface FriendRequest {
  user_id: string;
  id: number;
  friend_id: string;
  created_by: string;
  username?: string;
}

const FriendRequestsScreen = ({
  navigation,
  routeName,
}: FriendRequestsScreenProps) => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [requestType, setRequestType] = useState<"received" | "sent">(
    "received"
  );

  useEffect(() => {
    fetchFriendRequests();
  }, [requestType]);

  const fetchFriendRequests = async () => {
    let query = supabase
      .from("friendships")
      .select("id, user_id, friend_id, status, created_by");

    if (requestType === "received") {
      query = query.eq("friend_id", user?.id).eq("status", "pending");
    } else {
      query = query.eq("user_id", user?.id).eq("status", "pending");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching friend requests:", error);
    } else {
      console.log("Friend requests fetched:", data);
      if (requestType === "received") {
        await fetchSenderProfiles(data);
      } else {
        await fetchFriendProfiles(data);
      }
    }
  };

  const fetchSenderProfiles = async (requests: FriendRequest[]) => {
    const senderIds = requests.map((request) => request.created_by);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", senderIds);

    if (error) {
      console.error("Error fetching sender profiles:", error);
    } else {
      const updatedRequests = requests.map((request) => {
        const profile = data.find((p) => p.id === request.created_by);
        return { ...request, username: profile?.username };
      });
      setFriendRequests(updatedRequests);
    }
  };

  const fetchFriendProfiles = async (requests: FriendRequest[]) => {
    const friendIds = requests.map((request) => request.friend_id);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", friendIds);

    if (error) {
      console.error("Error fetching friend profiles:", error);
    } else {
      const updatedRequests = requests.map((request) => {
        const profile = data.find((p) => p.id === request.friend_id);
        return { ...request, username: profile?.username };
      });
      setFriendRequests(updatedRequests);
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

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.profileCard}>
        <View style={styles.profilePicture}>
          <Ionicons name="person-circle-outline" size={48} color="black" />
        </View>
        <Text style={styles.usernameText}>{item.username}</Text>
        {requestType === "sent" && (
          <TouchableOpacity
            style={[styles.inviteButton, styles.invitedButton]}
            disabled={true}>
            <Text style={styles.buttonText}>Invited</Text>
          </TouchableOpacity>
        )}
      </View>
      {requestType === "received" && (
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
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{routeName}</Text>
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            requestType === "received" && styles.activeToggleButton,
          ]}
          onPress={() => setRequestType("received")}>
          <Text
            style={[
              styles.toggleButtonText,
              requestType === "received" && styles.activeToggleButtonText,
            ]}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            requestType === "sent" && styles.activeToggleButton,
          ]}
          onPress={() => setRequestType("sent")}>
          <Text
            style={[
              styles.toggleButtonText,
              requestType === "sent" && styles.activeToggleButtonText,
            ]}>
            Sent
          </Text>
        </TouchableOpacity>
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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeToggleButton: {
    backgroundColor: "#007aff",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#000",
  },
  activeToggleButtonText: {
    color: "#fff",
  },
  requestList: {
    flex: 1,
  },
  requestCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
  inviteButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  invitedButton: {
    backgroundColor: "#b3d9ff",
  },
});

export default FriendRequestsScreen;
