import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../assets/Logo/groupfit-high-resolution-logo-black-transparent-Side.png")}
        style={styles.logo}
      />
      <View style={styles.iconsContainer}>
        <MaterialIcons name="filter-list" size={24} style={styles.icon} />
        <MaterialIcons name="more-vert" size={24} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default Header;
