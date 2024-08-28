// src/screens/GroupDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunitiesStackParamList } from "../types";
import { supabase } from "../lib/supabase";
import { RouteProp } from "@react-navigation/native";
import { Menu, Provider } from "react-native-paper";
import ColorPickerModal from "../components/ColorPickerModal"; // Import the color picker modal

type GroupDetailsScreenNavigationProp = NativeStackNavigationProp<
  CommunitiesStackParamList,
  "GroupDetails"
>;

type GroupDetailsScreenRouteProp = RouteProp<
  CommunitiesStackParamList,
  "GroupDetails"
>;

const GroupDetailsScreen: React.FC<{ routeName: string }> = ({ routeName }) => {
  const navigation = useNavigation<GroupDetailsScreenNavigationProp>();
  const route = useRoute<GroupDetailsScreenRouteProp>();
  const { groupId } = route.params;
  const [group, setGroup] = useState<{
    id: string;
    name: string;
    default_color: string;
  } | null>(null);
  const [members, setMembers] = useState<
    { id: string; name: string; role: string; avatar_url?: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<
    { id: string; name: string; role: string; avatar_url?: string }[]
  >([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showColorModal, setShowColorModal] = useState(false); // State for the color picker modal
  const [groupColor, setGroupColor] = useState("#54c5c9"); // State for the group color

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupMembers();
  }, []);

  const fetchGroupDetails = async () => {
    const { data, error } = await supabase
      .from("groupings")
      .select("id, name, default_color")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error fetching group details:", error);
    } else {
      setGroup(data);
      setNewGroupName(data.name);
      setGroupColor(data.default_color); // Set the group color
    }
  };

  const fetchGroupMembers = async () => {
    const { data: memberData, error } = await supabase
      .from("grouping_members")
      .select("user_id, role")
      .eq("grouping_id", groupId);

    if (error) {
      console.error("Error fetching group members:", error);
      return;
    }

    const userIds = memberData.map((member) => member.user_id);

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return;
    }

    const combinedData = memberData.map((member) => {
      const profile = profilesData.find(
        (profile) => profile.id === member.user_id
      );
      return {
        id: member.user_id,
        name: profile?.full_name || "Unknown",
        role: member.role,
        avatar_url: profile?.avatar_url,
      };
    });

    setMembers(combinedData);
    setFilteredMembers(combinedData);
  };

  const renderMember = ({
    item,
  }: {
    item: { id: string; name: string; role: string; avatar_url?: string };
  }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onLongPress={(event) => {
        setSelectedMemberId(item.id);
        setContextMenuAnchor({
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        });
        setContextMenuVisible(true);
      }}>
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.memberAvatar} />
      ) : (
        <View style={styles.defaultAvatar}>
          <Ionicons name="person" size={24} color="gray" />
        </View>
      )}
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = members.filter((member) =>
      member.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      setSearchQuery("");
      setFilteredMembers(members);
    }
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const updateGroupName = async () => {
    navigation.navigate("GroupNameChange", {
      groupId,
      groupName: group?.name ?? "",
    });
  };

  const addMembers = () => {
    navigation.navigate("AddMembers", { groupId });
  };

  const removeMember = async () => {
    if (selectedMemberId) {
      const { error } = await supabase
        .from("grouping_members")
        .delete()
        .eq("grouping_id", groupId)
        .eq("user_id", selectedMemberId);

      if (error) {
        console.error("Error removing member:", error);
      } else {
        setMembers(members.filter((member) => member.id !== selectedMemberId));
        setFilteredMembers(
          filteredMembers.filter((member) => member.id !== selectedMemberId)
        );
        setContextMenuVisible(false);
      }
    }
  };

  const handleColorChange = async (color: string) => {
    setGroupColor(color);
    await supabase
      .from("groupings")
      .update({ default_color: color })
      .eq("id", groupId);
  };

  return (
    <Provider>
      <View style={styles.container}>
        {isSearchMode ? (
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={toggleSearchMode}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        ) : (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.iconButtons}>
              <TouchableOpacity
                style={styles.searchIcon}
                onPress={toggleSearchMode}>
                <Ionicons name="search" size={24} color="gray" />
              </TouchableOpacity>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={openMenu}>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                }
                anchorPosition="bottom"
                contentStyle={{ backgroundColor: "#f2f2f2" }}>
                <Menu.Item
                  onPress={updateGroupName}
                  title="Change Group Name"
                  titleStyle={{ color: "black" }}
                />
                <Menu.Item
                  onPress={addMembers}
                  title="Add Members"
                  titleStyle={{ color: "black" }}
                />
              </Menu>
            </View>
          </View>
        )}
        {!isSearchMode && group && (
          <View style={styles.groupInfo}>
            <View
              style={[
                styles.groupProfileCircle,
                { backgroundColor: groupColor },
              ]}>
              <Text style={styles.groupProfileText}>{group.name[0]}</Text>
            </View>
            <View style={styles.groupNameContainer}>
              <Text style={styles.groupName}>{group.name}</Text>
              <TouchableOpacity
                style={styles.colorCircle}
                onPress={() => setShowColorModal(true)}>
                <View
                  style={[
                    styles.colorCircleInner,
                    { backgroundColor: groupColor },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.memberCount}>{members.length} members</Text>
          </View>
        )}
        <View style={styles.membersSection}>
          {!isSearchMode && (
            <View style={styles.membersHeader}>
              <Text style={styles.membersTitle}>{members.length} members</Text>
            </View>
          )}
          <FlatList
            data={isSearchMode ? filteredMembers : members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            style={styles.memberList}
          />
        </View>
        {!isSearchMode && (
          <TouchableOpacity style={styles.exitButton}>
            <Ionicons name="exit" size={24} color="red" marginLeft={10} />
            <Text style={styles.exitText}>Exit Group</Text>
          </TouchableOpacity>
        )}
        <Menu
          visible={contextMenuVisible}
          onDismiss={() => setContextMenuVisible(false)}
          anchor={contextMenuAnchor ?? { x: 0, y: 0 }}
          contentStyle={{ backgroundColor: "white" }}>
          <Menu.Item onPress={removeMember} title="Remove Member" />
        </Menu>
        <ColorPickerModal
          visible={showColorModal}
          onClose={() => setShowColorModal(false)}
          onSelectColor={(color) => handleColorChange(color.hex)}
          currentColor={groupColor}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  iconButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 5,
  },
  groupInfo: {
    alignItems: "center",
    padding: 20,
  },
  groupProfileCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  groupProfileText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  groupNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  memberCount: {
    fontSize: 16,
    color: "gray",
  },
  membersSection: {
    padding: 10,
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  membersTitle: {
    fontSize: 18,
    color: "gray",
  },
  memberList: {},
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberRole: {
    fontSize: 14,
    color: "gray",
  },
  exitButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  exitText: {
    color: "red",
    fontSize: 18,
    marginLeft: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  colorCircleInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default GroupDetailsScreen;
