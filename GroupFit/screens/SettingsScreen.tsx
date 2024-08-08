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
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase"; // Adjust the path as necessary
import { Session } from "@supabase/supabase-js";

const SettingsScreen = ({ session }: { session: Session }) => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Alert.alert("Signed Out", "You have been signed out.");
      console.log(`User with UUID ${session.user.id} has signed out.`);
      // No need to navigate manually, the session state change will handle it
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
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

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="help-circle-outline" size={24} color="#000" />
        <Text style={styles.optionText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Ionicons name="information-circle-outline" size={24} color="#000" />
        <Text style={styles.optionText}>About</Text>
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
