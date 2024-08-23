import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface HeaderProps {
  onFilterPress: (event: any) => void;
  filterOptions: any;
  selectedFilters: any;
}

const Header = ({
  onFilterPress,
  filterOptions,
  selectedFilters,
}: HeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../assets/Logo/groupfit-high-resolution-logo-black-transparent-Side.png")}
        style={styles.logo}
      />
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={onFilterPress}>
          <Ionicons name="options" size={24} style={styles.icon} />
        </TouchableOpacity>
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
    marginHorizontal: 20,
  },
});

export default Header;
