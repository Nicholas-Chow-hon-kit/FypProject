import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CommunitiesScreenProps } from "../types";

const CommunitiesScreen = ({
  session,
  navigation,
  route,
}: CommunitiesScreenProps) => {
  return (
    <View>
      <Text>Communities Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommunitiesScreen;
