import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface HeaderProps {
  onFilterPress: () => void;
  onSettingsPress: () => void;
  onViewChange: () => void;
}

const Header: React.FC<HeaderProps> = ({ onFilterPress, onSettingsPress, onViewChange }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>Tasks for the Week</Text>
    <View style={styles.headerIcons}>
      <Pressable onPress={onViewChange}>
        <FontAwesome name="angle-down" size={24} color="black" />
      </Pressable>
      <Pressable onPress={onFilterPress}>
        <FontAwesome name="filter" size={24} color="black" />
      </Pressable>
      <Pressable onPress={onSettingsPress}>
        <FontAwesome name="ellipsis-v" size={24} color="black" />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 100,
  },
});

export default Header;
