import React from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../lib/supabase"; // Adjust the path as necessary
import { Session } from "@supabase/supabase-js";
import { SettingsStackParamList } from "../navigation/SettingsStack";
import User from "../watermelondb/Model/User";
import { useAuth } from "../contexts/AuthProvider";

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();
  const { user, session, setSession } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Alert.alert("Signed Out", "You have been signed out.");
      console.log(`User with UUID ${user?.id} has signed out.`);
      // No need to navigate manually, the session state change will handle it
      setSession(null);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!session?.user?.id) {
        Alert.alert("Error", "User session is not available.");
        return;
      }
      const { data, error } = await supabase
        .from("deletionRequests")
        .insert([{ user_id: session.user.id }]);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="notifications-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="color-palette-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Appearance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Privacy & Security</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="language-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Language</Text>
      </TouchableOpacity>

      {/* New Account Option */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => navigation.navigate("Account")}>
        <Ionicons name="person-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="help-circle-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="information-circle-outline" size={24} color="#000" />
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      {/* Deactivate Account Option */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => {
          Alert.alert(
            "Deactivate Account",
            "Are you sure you want to deactivate your account? This action cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Deactivate", onPress: handleDeleteAccount },
            ],
            { cancelable: true }
          );
        }}>
        <Ionicons name="close-circle-outline" size={24} color="black" />
        <Text style={styles.optionText}>Deactivate Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionContainer, styles.signOutContainer]}
        onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color="#FF6F61" />
        <Text style={[styles.optionText, styles.signOutText]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 16,
    flex: 1,
    textAlign: "left",
  },
  signOutContainer: {
    marginTop: 20,
    backgroundColor: "#FFEBE8",
  },
  signOutText: {
    color: "#FF6F61",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
